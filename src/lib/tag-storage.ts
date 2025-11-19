import { NameTagData, NameTagField } from "@/types/name-tag";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  deleteDoc,
  serverTimestamp,
  orderBy,
  query,
  type Timestamp,
} from "firebase/firestore";
import { getFirebaseAuth, getFirebaseFirestore } from "@/lib/firebase-client";

const TAG_STORAGE_KEY = "name-tag-studio:design";

const isObject = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null;

const isValidField = (field: unknown): field is NameTagField => {
  if (!isObject(field)) {
    return false;
  }
  return (
    typeof field.id === "string" &&
    typeof field.name === "string" &&
    typeof field.text === "string" &&
    typeof field.fontSize === "number" &&
    typeof field.color === "string" &&
    typeof field.x === "number" &&
    typeof field.y === "number" &&
    typeof field.visible === "boolean"
  );
};

const isValidTag = (tag: unknown): tag is NameTagData => {
  if (!isObject(tag) || !Array.isArray(tag.fields)) {
    return false;
  }
  if (
    typeof tag.accent !== "string" ||
    typeof tag.background !== "string" ||
    typeof tag.customBackground !== "string" ||
    (tag.textAlign !== "left" &&
      tag.textAlign !== "center" &&
      tag.textAlign !== "right")
  ) {
    return false;
  }
  return tag.fields.every(isValidField);
};

const getStorage = (): Storage | null => {
  if (typeof window === "undefined") {
    return null;
  }
  return window.localStorage;
};

export const loadStoredTag = (): NameTagData | null => {
  try {
    const storage = getStorage();
    if (!storage) {
      return null;
    }
    const raw = storage.getItem(TAG_STORAGE_KEY);
    if (!raw) {
      return null;
    }
    const parsed = JSON.parse(raw);
    if (!isValidTag(parsed)) {
      return null;
    }
    return parsed;
  } catch (error) {
    console.error("Failed to read stored tag", error);
    return null;
  }
};

export const persistTag = (tag: NameTagData) => {
  try {
    const storage = getStorage();
    if (!storage) {
      return;
    }
    storage.setItem(TAG_STORAGE_KEY, JSON.stringify(tag));
  } catch (error) {
    console.error("Failed to persist tag", error);
  }
};

export const clearStoredTag = () => {
  try {
    const storage = getStorage();
    if (!storage) {
      return;
    }
    storage.removeItem(TAG_STORAGE_KEY);
  } catch (error) {
    console.error("Failed to clear stored tag", error);
  }
};

// Firebase storage types
export type SavedDesign = {
  id: string;
  name: string;
  description?: string;
  data: NameTagData;
  createdAt: Timestamp | Date;
  updatedAt: Timestamp | Date;
};

// Firebase storage functions
export const saveDesignToFirebase = async (
  name: string,
  data: NameTagData,
  description?: string,
): Promise<string> => {
  const auth = getFirebaseAuth();
  const user = auth.currentUser;
  if (!user) {
    throw new Error("User must be authenticated to save designs");
  }

  const firestore = getFirebaseFirestore();
  const designId = doc(collection(firestore, "users", user.uid, "designs")).id;
  const designRef = doc(firestore, "users", user.uid, "designs", designId);

  await setDoc(designRef, {
    name,
    description: description || "",
    data,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });

  return designId;
};

export const loadDesignFromFirebase = async (
  designId: string,
): Promise<SavedDesign | null> => {
  const auth = getFirebaseAuth();
  const user = auth.currentUser;
  if (!user) {
    throw new Error("User must be authenticated to load designs");
  }

  const firestore = getFirebaseFirestore();
  const designRef = doc(firestore, "users", user.uid, "designs", designId);
  const designSnap = await getDoc(designRef);

  if (!designSnap.exists()) {
    return null;
  }

  const data = designSnap.data();
  if (!isValidTag(data.data)) {
    console.error("Invalid design data", data);
    return null;
  }

  return {
    id: designSnap.id,
    name: data.name,
    description: data.description,
    data: data.data,
    createdAt: data.createdAt,
    updatedAt: data.updatedAt,
  };
};

export const listUserDesigns = async (): Promise<SavedDesign[]> => {
  const auth = getFirebaseAuth();
  const user = auth.currentUser;
  if (!user) {
    throw new Error("User must be authenticated to list designs");
  }

  const firestore = getFirebaseFirestore();
  const designsRef = collection(firestore, "users", user.uid, "designs");
  const q = query(designsRef, orderBy("updatedAt", "desc"));
  const querySnapshot = await getDocs(q);

  const designs: SavedDesign[] = [];
  querySnapshot.forEach((doc) => {
    const data = doc.data();
    if (isValidTag(data.data)) {
      designs.push({
        id: doc.id,
        name: data.name,
        description: data.description,
        data: data.data,
        createdAt: data.createdAt,
        updatedAt: data.updatedAt,
      });
    }
  });

  return designs;
};

export const updateDesignInFirebase = async (
  designId: string,
  updates: {
    name?: string;
    description?: string;
    data?: NameTagData;
  },
): Promise<void> => {
  const auth = getFirebaseAuth();
  const user = auth.currentUser;
  if (!user) {
    throw new Error("User must be authenticated to update designs");
  }

  const firestore = getFirebaseFirestore();
  const designRef = doc(firestore, "users", user.uid, "designs", designId);

  await setDoc(
    designRef,
    {
      ...updates,
      updatedAt: serverTimestamp(),
    },
    { merge: true },
  );
};

export const deleteDesignFromFirebase = async (
  designId: string,
): Promise<void> => {
  const auth = getFirebaseAuth();
  const user = auth.currentUser;
  if (!user) {
    throw new Error("User must be authenticated to delete designs");
  }

  const firestore = getFirebaseFirestore();
  const designRef = doc(firestore, "users", user.uid, "designs", designId);
  await deleteDoc(designRef);
};


