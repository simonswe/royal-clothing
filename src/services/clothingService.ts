import { 
  collection, 
  addDoc, 
  deleteDoc,
  updateDoc, 
  doc, 
  getDocs, 
  query, 
  orderBy, 
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

export const updateClothingItem = async (
  id: string,
  updates: Partial<Omit<ClothingItem, 'id' | 'createdAt' | 'updatedAt'>>,
  newImageFile?: File
): Promise<void> => {
  try {
    let imageUrl = updates.imageUrl;

    // If there's a new image, upload it and get the URL
    if (newImageFile) {
      const timestamp = Date.now();
      const fileExtension = newImageFile.name.split('.').pop();
      const filename = `${timestamp}_${Math.random().toString(36).substring(2)}.${fileExtension}`;
      const imagePath = `clothing/${filename}`;
      
      const imageRef = ref(storage, imagePath);
      await uploadBytes(imageRef, newImageFile);
      imageUrl = await getDownloadURL(imageRef);

      // If there was an old image, delete it
      if (updates.imageUrl) {
        try {
          const oldImageUrl = updates.imageUrl;
          const decodedUrl = decodeURIComponent(oldImageUrl);
          const startIndex = decodedUrl.indexOf('/o/') + 3;
          const endIndex = decodedUrl.indexOf('?');
          const oldImagePath = decodedUrl.substring(startIndex, endIndex);
          const oldImageRef = ref(storage, oldImagePath);
          await deleteObject(oldImageRef);
        } catch (error) {
          console.warn('Error deleting old image:', error);
        }
      }
    }

    // Update the document
    const docRef = doc(db, COLLECTION_NAME, id);
    await updateDoc(docRef, {
      ...updates,
      ...(imageUrl && { imageUrl }),
      updatedAt: new Date()
    });
  } catch (error) {
    console.error('Error updating clothing item:', error);
    throw new FirebaseError(
      'Failed to update clothing item. Please try again.',
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
    let q = query(collection(db, COLLECTION_NAME), orderBy('createdAt', 'desc'));
    let items = (await getDocs(q)).docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt.toDate(),
      updatedAt: doc.data().updatedAt.toDate()
    })) as ClothingItem[];

    // Apply filters in memory for more flexible filtering
    if (filters) {
      items = items.filter(item => {
        // Price filters
        if (typeof filters.minPrice === 'number' && item.price < filters.minPrice) {
          return false;
        }
        if (typeof filters.maxPrice === 'number' && item.price > filters.maxPrice) {
          return false;
        }

        // Size filter
        if (filters.sizes && filters.sizes.length > 0 && !filters.sizes.includes(item.size)) {
          return false;
        }

        // Type filter
        if (filters.types && filters.types.length > 0 && !filters.types.includes(item.type)) {
          return false;
        }

        // Brand filter
        if (filters.brands && filters.brands.length > 0 && !filters.brands.includes(item.brand)) {
          return false;
        }

        // Color filter
        if (filters.colors && filters.colors.length > 0 && !filters.colors.includes(item.color)) {
          return false;
        }

        return true;
      });
    }

    return items;
  } catch (error) {
    console.error('Error fetching clothing items:', error);
    throw new FirebaseError(
      'Failed to fetch clothing items. Please try again.',
      error as FirestoreError
    );
  }
}; 