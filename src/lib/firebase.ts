import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyBqYVW4rujRBgPekZA4LgSYHuEsRLdtZH4',
  authDomain: 'qr-generation-24976.firebaseapp.com',
  projectId: 'qr-generation-24976',
  storageBucket: 'qr-generation-24976.firebasestorage.app',
  messagingSenderId: '564493084655',
  appId: '1:564493084655:web:9018a9bfd86f0f26e4b81a',
  measurementId: 'G-E5DK4K6MEV',
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);

export type QrHistoryItem = {
  id: string;
  content: string;
  darkColor: string;
  lightColor: string;
  size: number;
  hasLogo: boolean;
  imageData: string;
  filename: string;
  createdAt: string;
};
