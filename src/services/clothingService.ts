import { 
  collection, 
  addDoc, 
  deleteDoc, 
  doc, 
  getDocs, 
  query, 
  where, 
  orderBy, 
  QueryConstraint,
  FirestoreError
} from 'firebase/firestore';
import { 
  ref, 
  uploadBytes, 
  getDownloadURL, 
  deleteObject,
  StorageError 
} from 'firebase/storage';
import { db, storage } from '../config/firebase';
import { ClothingItem, FilterOptions } from '../types/clothing';

const COLLECTION_NAME = 'clothing';

class FirebaseError extends Error {
  constructor(message: string, public originalError: FirestoreError | StorageError) {
    super(message);
    this.name = 'FirebaseError';
  }
}

export const addClothingItem = async (
  item: Omit<ClothingItem, 'id' | 'createdAt' | 'updatedAt'>, 
  imageFile: File
): Promise<string> => {
  try {
    // Create a unique filename
    const timestamp = Date.now();
    const fileExtension = imageFile.name.split('.').pop();
    const filename = `${timestamp}_${Math.random().toString(36).substring(2)}.${fileExtension}`;
    const imagePath = `clothing/${filename}`;
    
    // Upload image
    const imageRef = ref(storage, imagePath);
    await uploadBytes(imageRef, imageFile);
    const imageUrl = await getDownloadURL(imageRef);

    // Add item to Firestore
    const docRef = await addDoc(collection(db, COLLECTION_NAME), {
      ...item,
      imageUrl,
      createdAt: new Date(),
      updatedAt: new Date()
    });

    return docRef.id;
  } catch (error) {
    console.error('Error adding clothing item:', error);
    throw new FirebaseError(
      'Failed to add clothing item. Please try again.',
      error as FirestoreError | StorageError
    );
  }
};

export const deleteClothingItem = async (id: string, imageUrl: string): Promise<void> => {
  try {
    // Extract the path from the Firebase Storage URL
    const decodedUrl = decodeURIComponent(imageUrl);
    const startIndex = decodedUrl.indexOf('/o/') + 3;
    const endIndex = decodedUrl.indexOf('?');
    const imagePath = decodedUrl.substring(startIndex, endIndex);

    // Delete image from storage
    try {
      const imageRef = ref(storage, imagePath);
      await deleteObject(imageRef);
    } catch (error) {
      console.warn('Error deleting image, continuing with document deletion:', error);
    }

    // Delete document from Firestore
    await deleteDoc(doc(db, COLLECTION_NAME, id));
  } catch (error) {
    console.error('Error deleting clothing item:', error);
    throw new FirebaseError(
      'Failed to delete clothing item. Please try again.',
      error as FirestoreError | StorageError
    );
  }
};

export const getClothingItems = async (filters?: FilterOptions): Promise<ClothingItem[]> => {
  try {
    const constraints: QueryConstraint[] = [];

    if (filters) {
      if (filters.minPrice !== undefined) {
        constraints.push(where('price', '>=', filters.minPrice));
      }
      if (filters.maxPrice !== undefined) {
        constraints.push(where('price', '<=', filters.maxPrice));
      }
      if (filters.brands?.length) {
        constraints.push(where('brand', 'in', filters.brands));
      }
      if (filters.colors?.length) {
        constraints.push(where('color', 'in', filters.colors));
      }
      if (filters.sizes?.length) {
        constraints.push(where('size', 'in', filters.sizes));
      }
      if (filters.types?.length) {
        constraints.push(where('type', 'in', filters.types));
      }
    }

    // Always sort by newest first
    constraints.push(orderBy('createdAt', 'desc'));
    
    const q = query(collection(db, COLLECTION_NAME), ...constraints);
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt.toDate(),
      updatedAt: doc.data().updatedAt.toDate()
    })) as ClothingItem[];
  } catch (error) {
    console.error('Error fetching clothing items:', error);
    throw new FirebaseError(
      'Failed to fetch clothing items. Please try again.',
      error as FirestoreError
    );
  }
}; 