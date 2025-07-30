import { Injectable } from '@angular/core';
import { serverTimestamp } from 'firebase/firestore';
import {
  collection,
  getFirestore,
  setDoc, doc,
  getDoc,
  addDoc,
  query,
  where,
  getDocs,
  updateDoc,
  increment,
  orderBy,
  limit,
  startAfter,
  onSnapshot
} from 'firebase/firestore';
import { db } from '../_configs/firebase-config';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {

  constructor() {}

  async addDocument(collectionName: string, data: any): Promise<string> {
    const queryRef = collection(db, collectionName);
    const docRef = await addDoc(queryRef, {
      ...data,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    return docRef.id;
  }

  async updateChatRoomByPartnerId(partnerId: string, chatRoomId: string): Promise<void> {
    const chatRoomDocRef = doc(db, 'chatRooms', chatRoomId);
    await updateDoc(chatRoomDocRef, {
      recipientId: partnerId,
      unreadCount: increment(1),
      updatedAt: serverTimestamp(),
    });
  }

  async checkExists(collectionName: string, docId: string): Promise<boolean> {
    const documentRef = doc(db, collectionName, docId);
    const documentSnapshot = await getDoc(documentRef);
    return documentSnapshot.exists();
  }

  async createUser(collectionName: string, userData: any, userId: string): Promise<boolean> {
    try {
      const userRef = doc(db, collectionName, userId);
      await setDoc(userRef, {
        ...userData,
        createdAt: serverTimestamp(),
      });
      return true;
    } catch (error) {
      console.error('Create user error:', error);
      return false;
    }
  }

  async checkChatRoomExists(collectionName: string, member1: string, member2: string): Promise<string | null> {
    const chatRoomsRef = collection(db, collectionName);
    const q = query(chatRoomsRef, where('membersString', 'array-contains', `${member1}-${member2}`));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.size > 0) {
      return querySnapshot.docs[0].id;
    } else {
      return null;
    }
  }

  async getChatRoomById(chatRoomId: string, currentUserId: string): Promise<any> {
    const chatRoomRef = doc(db, 'chatRooms', chatRoomId);
    const docSnap = await getDoc(chatRoomRef);

    if (docSnap.exists()) {
      const chatRoomData = docSnap.data();
      const members: string[] = chatRoomData?.['members'] || [];

      let partnerId = '';
      if (members[0] === currentUserId) {
        partnerId = members[1];
      } else {
        partnerId = members[0];
      }

      const userAccount = await this.getUserAccount('accounts', partnerId);
      return {
        ...chatRoomData,
        id: docSnap.id,
        user: userAccount,
      };
    } else {
      return {};
    }
  }

  async getUserAccount(collectionName: string, userId: string): Promise<any> {
    const userRef = doc(db, collectionName, userId);
    const docSnap = await getDoc(userRef);
    return docSnap.exists() ? docSnap.data() : null;
  }

  generateKeywords(displayName: string): string[] {
    const name = displayName.split(' ').filter((word) => word);
    const length = name.length;
    let flagArray: boolean[] = Array(length).fill(false);
    let result: string[] = [];
    let stringArray: string[] = [];

    function createKeywords(name: string): string[] {
      const arrName: string[] = [];
      let curName = '';
      name.split('').forEach((letter) => {
        curName += letter;
        arrName.push(curName);
      });
      return arrName;
    }

    function findPermutation(k: number) {
      for (let i = 0; i < length; i++) {
        if (!flagArray[i]) {
          flagArray[i] = true;
          result[k] = name[i];
          if (k === length - 1) {
            stringArray.push(result.join(' '));
          }
          findPermutation(k + 1);
          flagArray[i] = false;
        }
      }
    }

    findPermutation(0);

    const keywords = stringArray.reduce<string[]>((acc: string[], cur: string) => {
      const words = createKeywords(cur);
      return [...acc, ...words];
    }, []);

    return keywords;
  }

  listenChatRooms(
    userId: string,
    pageSize: number,
    searchText: string,
    callback: (chatRooms: any[], lastDoc: any, count: number) => void
  ): () => void {
    const chatRoomsRef = collection(db, 'chatRooms');
    let q = query(
      chatRoomsRef,
      where('members', 'array-contains', userId),
      orderBy('updatedAt', 'desc'),
      limit(pageSize)
    );

    if (searchText) {
      q = query(
        chatRoomsRef,
        where('members', 'array-contains', userId),
        where('keywords', 'array-contains', searchText.toLowerCase()),
        orderBy('updatedAt', 'desc'),
        limit(pageSize)
      );
    }

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const rooms: any[] = [];
      let lastVisible: any = null;

      querySnapshot.forEach((doc) => {
        rooms.push({ id: doc.id, ...doc.data() });
      });

      if (!querySnapshot.empty) {
        lastVisible = querySnapshot.docs[querySnapshot.docs.length - 1];
      }

      callback(rooms, lastVisible, querySnapshot.size);
    });

    return unsubscribe;
  }

  async getMoreChatRooms(
    userId: string,
    lastDoc: any,
    pageSize: number,
    searchText: string
  ): Promise<{ chatRooms: any[], lastDoc: any }> {
    const chatRoomsRef = collection(db, 'chatRooms');
    let q = query(
      chatRoomsRef,
      where('members', 'array-contains', userId),
      orderBy('updatedAt', 'desc'),
      startAfter(lastDoc),
      limit(pageSize)
    );

    if (searchText) {
      q = query(
        chatRoomsRef,
        where('members', 'array-contains', userId),
        where('keywords', 'array-contains', searchText.toLowerCase()),
        orderBy('updatedAt', 'desc'),
        startAfter(lastDoc),
        limit(pageSize)
      );
    }

    const querySnapshot = await getDocs(q);
    const rooms: any[] = [];

    querySnapshot.forEach((doc) => {
      rooms.push({ id: doc.id, ...doc.data() });
    });

    const newLastDoc = !querySnapshot.empty ? querySnapshot.docs[querySnapshot.docs.length - 1] : null;

    return {
      chatRooms: rooms,
      lastDoc: newLastDoc
    };
  }
}
