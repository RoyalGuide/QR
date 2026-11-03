import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  orderBy,
  query,
  limit,
} from 'firebase/firestore';
import { db, type QrHistoryItem } from './firebase';

export type QrHistoryInput = {
  content: string;
  darkColor: string;
  lightColor: string;
  size: number;
  hasLogo: boolean;
  imageData: string;
  filename: string;
};

export async function saveQrHistory(input: QrHistoryInput): Promise<void> {
  await addDoc(collection(db, 'qr_codes'), {
    ...input,
    createdAt: new Date().toISOString(),
  });
}

export async function fetchQrHistory(): Promise<QrHistoryItem[]> {
  const q = query(collection(db, 'qr_codes'), orderBy('createdAt', 'desc'), limit(24));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((docSnap) => {
    const d = docSnap.data();
    return {
      id: docSnap.id,
      content: d.content ?? '',
      darkColor: d.darkColor ?? '#1c1828',
      lightColor: d.lightColor ?? '#fbf7ed',
      size: d.size ?? 1080,
      hasLogo: d.hasLogo ?? false,
      imageData: d.imageData ?? '',
      filename: d.filename ?? 'aurea-qrcode',
      createdAt: d.createdAt ?? new Date().toISOString(),
    } as QrHistoryItem;
  });
}

export async function deleteQrHistory(id: string): Promise<void> {
  await deleteDoc(doc(db, 'qr_codes', id));
}
