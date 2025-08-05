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
  imageFiles: File[]
): Promise<string> => {
  try {
    const imageUrls: string[] = [];

    // Upload all images
    for (const imageFile of imageFiles) {
      const timestamp = Date.now();
      const fileExtension = imageFile.name.split('.').pop();
      const filename = `${timestamp}_${Math.random().toString(36).substring(2)}.${fileExtension}`;
      const imagePath = `clothing/${filename}`;
      
      const imageRef = ref(storage, imagePath);
      await uploadBytes(imageRef, imageFile);
      const imageUrl = await getDownloadURL(imageRef);
      imageUrls.push(imageUrl);
    }

    // Add item to Firestore
    const docRef = await addDoc(collection(db, COLLECTION_NAME), {
      ...item,
      imageUrls,
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
  newImageFiles?: File[]
): Promise<void> => {
  try {
    let imageUrls = updates.imageUrls;

    // If there are new images, upload them and get the URLs
    if (newImageFiles && newImageFiles.length > 0) {
      const newImageUrls: string[] = [];

      for (const imageFile of newImageFiles) {
        const timestamp = Date.now();
        const fileExtension = imageFile.name.split('.').pop();
        const filename = `${timestamp}_${Math.random().toString(36).substring(2)}.${fileExtension}`;
        const imagePath = `clothing/${filename}`;
        
        const imageRef = ref(storage, imagePath);
        await uploadBytes(imageRef, imageFile);
        const imageUrl = await getDownloadURL(imageRef);
        newImageUrls.push(imageUrl);
      }

      // Combine existing and new image URLs
      imageUrls = [...(updates.imageUrls || []), ...newImageUrls];
    }

    // Update the document
    const docRef = doc(db, COLLECTION_NAME, id);
    await updateDoc(docRef, {
      ...updates,
      ...(imageUrls && { imageUrls }),
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

export const deleteClothingItem = async (id: string, imageUrls: string[]): Promise<void> => {
  try {
    // Delete all images from storage
    for (const imageUrl of imageUrls) {
      try {
        const decodedUrl = decodeURIComponent(imageUrl);
        const startIndex = decodedUrl.indexOf('/o/') + 3;
        const endIndex = decodedUrl.indexOf('?');
        const imagePath = decodedUrl.substring(startIndex, endIndex);
        const imageRef = ref(storage, imagePath);
        await deleteObject(imageRef);
      } catch (error) {
        console.warn('Error deleting image, continuing with other images:', error);
      }
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
    let items = (await getDocs(q)).docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        // Handle legacy items that might have imageUrl instead of imageUrls
        imageUrls: data.imageUrls || (data.imageUrl ? [data.imageUrl] : []),
        createdAt: data.createdAt.toDate(),
        updatedAt: data.updatedAt.toDate()
      };
    }) as ClothingItem[];

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