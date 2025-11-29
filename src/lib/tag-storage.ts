import { DocumentData, MergeField, DocumentType } from "@/types/document";
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

const STORAGE_KEY = "mail-buddy:document";

const validDocumentTypes: DocumentType[] = ["letter", "certificate", "label", "envelope"];

const isObject = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null;

const isValidField = (field: unknown): field is MergeField => {
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

const isValidDocument = (doc: unknown): doc is DocumentData => {
  if (!isObject(doc) || !Array.isArray(doc.fields)) {
    return false;
  }
  if (
    typeof doc.accent !== "string" ||
    typeof doc.background !== "string" ||
    typeof doc.customBackground !== "string" ||
    (doc.textAlign !== "left" &&
      doc.textAlign !== "center" &&
      doc.textAlign !== "right")
  ) {
    return false;
  }
  // documentType is optional for backward compatibility (defaults to "label")
  if (doc.documentType !== undefined && !validDocumentTypes.includes(doc.documentType as DocumentType)) {
    return false;
  }
  return doc.fields.every(isValidField);
};

// Legacy alias for backward compatibility
const isValidTag = isValidDocument;

const getStorage = (): Storage | null => {
  if (typeof window === "undefined") {
    return null;
  }
  return window.localStorage;
};

export const loadStoredDocument = (): DocumentData | null => {
  try {
    const storage = getStorage();
    if (!storage) {
      return null;
    }
    const raw = storage.getItem(STORAGE_KEY);
    if (!raw) {
      return null;
    }
    const parsed = JSON.parse(raw);
    if (!isValidDocument(parsed)) {
      return null;
    }
    // Ensure documentType exists (backward compatibility)
    if (!parsed.documentType) {
      parsed.documentType = "label";
    }
    return parsed;
  } catch (error) {
    console.error("Failed to read stored document", error);
    return null;
  }
};

// Legacy alias
export const loadStoredTag = loadStoredDocument;

export const persistDocument = (doc: DocumentData) => {
  try {
    const storage = getStorage();
    if (!storage) {
      return;
    }
    storage.setItem(STORAGE_KEY, JSON.stringify(doc));
  } catch (error) {
    console.error("Failed to persist document", error);
  }
};

// Legacy alias
export const persistTag = persistDocument;

export const clearStoredDocument = () => {
  try {
    const storage = getStorage();
    if (!storage) {
      return;
    }
    storage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error("Failed to clear stored document", error);
  }
};

// Legacy alias
export const clearStoredTag = clearStoredDocument;

// Firebase storage types
export type SavedDesign = {
  id: string;
  name: string;
  description?: string;
  data: DocumentData;
  createdAt: Timestamp | Date;
  updatedAt: Timestamp | Date;
};

// Firebase storage functions
export const saveDesignToFirebase = async (
  name: string,
  data: DocumentData,
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
    data?: DocumentData;
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


