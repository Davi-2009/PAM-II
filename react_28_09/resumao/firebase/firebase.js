import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBfj3FZ_ReMcH9_9yaXOkDDMOMXlftOCkA",
  authDomain: "mim-ser-indio.firebaseapp.com",
  projectId: "mim-ser-indio",
  storageBucket: "mim-ser-indio.firebasestorage.app",
  messagingSenderId: "618689209448",
  appId: "1:618689209448:web:1440d622a74d7a3c8707dd"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);