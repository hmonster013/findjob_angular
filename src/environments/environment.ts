export const environment = {
  production: false,
  // apiUrl: 'https://a3ae-2a09-bac5-d45b-16d2-00-246-ef.ngrok-free.app',
  apiUrl: 'http://localhost:8000',

  FINDJOB_HOST_NAME: '127.0.0.1',
  EMPLOYER_FINDJOB_HOST_NAME: 'localhost',

  FINDJOB_SERVER_CLIENT_ID: 'JpQmKGALLC3uYW7hfrNsXoTp0QAckYx5aPoFRMAK',
  FINDJOB_SERVER_CLIENT_SECRECT: 'JvRWUmtcZjZ0TkBdH4TSgZWcs4HMekRSbYXobpSEf271dzQWX9O0KXIPVwWJKBGE9RXBOh40gEQbcUAloajSRncg237n2BaAZKKTQ4jLCWzTxR4UMSJ6QbnJde6BM8Qf',

  FACEBOOK_CLIENT_ID: '3224555807687290',
  FACEBOOK_CLIENT_SECRET: 'c2143e3e97aced08e941fa288a28c305',

  GOOGLE_CLIENT_ID: '755763278092-967403h40illl022pmim93p963uppd81.apps.googleusercontent.com',
  GOOGLE_CLIENT_SECRET: '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',

  GOONGAPI_KEY: '',
  GOONGAPI_ACCESS_TOKEN: '',

  chatbot: {
    jobSeeker: {
      agentId: 'f84ddd77-d671-419f-af3e-dca32b8dff90',
      chatTitle: 'Chatbot Ứng Viên',
      chatIcon: 'https://example.com/job-seeker-icon.png',
      languageCode: 'vi'
    },
    employer: {
      agentId: 'ff0a08e0-e310-47e1-9d30-0c10c0284313',
      chatTitle: 'Chatbot Nhà Tuyển Dụng',
      chatIcon: 'https://example.com/employer-icon.png',
      languageCode: 'vi'
    }
  },

  firebaseConfig: {
    apiKey: "AIzaSyDdJbQedfwBGsklTNqfoPnjnJrInML8x8k",
    authDomain: "findjob-44e98.firebaseapp.com",
    databaseURL: "https://findjob-44e98-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "findjob-44e98",
    storageBucket: "findjob-44e98.firebasestorage.app",
    messagingSenderId: "755763278092",
    appId: "1:755763278092:web:2faea93e4af1de40be1929",
    measurementId: "G-Z0ZZ7RHNKR"
  }
};
