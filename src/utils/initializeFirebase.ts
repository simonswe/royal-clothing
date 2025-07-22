import { collection, addDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import { sampleClothingItems } from './sampleData';

export const initializeFirebaseWithSampleData = async () => {
  try {
    console.log('Starting to populate Firebase with sample data...');
    
    for (const item of sampleClothingItems) {
      await addDoc(collection(db, 'clothing'), {
        ...item,
        createdAt: new Date(),
        updatedAt: new Date()
      });
      console.log(`Added item: ${item.name}`);
    }

    console.log('Successfully populated Firebase with sample data!');
  } catch (error) {
    console.error('Error populating Firebase:', error);
    throw error;
  }
}; 