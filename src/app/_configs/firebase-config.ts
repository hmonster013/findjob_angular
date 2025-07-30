import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { environment } from '../../environments/environment'; // 🔥 Import environment config

// Khởi tạo Firebase App
const app = initializeApp(environment.firebaseConfig);

// Lấy Firestore Database từ Firebase App
const db = getFirestore(app);

// Export để các service/component dùng
export { db };
