import { DocumentData, MergeField, DocumentType } from "@/types/document";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  type Timestamp,
} from "firebase/firestore";
import { getFirebaseAuth, getFirebaseFirestore } from "@/lib/firebase-client";

const STORAGE_KEY = "mail-buddy:document";

const validDocumentTypes: DocumentType[] = ["letter", "certificate", "label", "envelope"];

const isObject = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null;

const isValidField = (field: unknown): field is MergeField =>
  isObject(field) &&
  typeof field.id === "string" &&
  typeof field.name === "string" &&
  typeof field.text === "string" &&
  typeof field.fontSize === "number" &&
  typeof field.color === "string" &&
  typeof field.x === "number" &&
  typeof field.y === "number" &&
  typeof field.visible === "boolean";

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
  if (
    doc.documentType !== undefined &&
    !validDocumentTypes.includes(doc.documentType as DocumentType)
  ) {
    return false;
  }
  return doc.fields.every(isValidField);
};

export const loadStoredDocument = (): DocumentData | null => {
  try {
    if (typeof window === "undefined") {
      return null;
    }
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return null;
    }
    const parsed = JSON.parse(raw);
    if (!isValidDocument(parsed)) {
      return null;
    }
    parsed.documentType ??= "label";
    return parsed;
  } catch (error) {
    console.error("Failed to read stored document", error);
    return null;
  }
};

export const persistDocument = (doc: DocumentData) => {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(doc));
  } catch (error) {
    console.error("Failed to persist document", error);
  }
};

export const clearStoredDocument = () => {
  try {
    window.localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error("Failed to clear stored document", error);
  }
};

// Firebase design storage

export type SavedDesign = {
  id: string;
  name: string;
  description?: string;
  data: DocumentData;
  createdAt: Timestamp | Date;
  updatedAt: Timestamp | Date;
};

const requireUserDesigns = () => {
  const user = getFirebaseAuth().currentUser;
  if (!user) {
    throw new Error("You must be signed in to manage designs");
  }
  return collection(getFirebaseFirestore(), "users", user.uid, "designs");
};

export const saveDesignToFirebase = async (
  name: string,
  data: DocumentData,
  description?: string,
): Promise<string> => {
  const ref = await addDoc(requireUserDesigns(), {
    name,
    description: description || "",
    data,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return ref.id;
};

export const listUserDesigns = async (): Promise<SavedDesign[]> => {
  const snapshot = await getDocs(query(requireUserDesigns(), orderBy("updatedAt", "desc")));
  return snapshot.docs.flatMap((doc) => {
    const data = doc.data();
    if (!isValidDocument(data.data)) {
      return [];
    }
    return {
      id: doc.id,
      name: data.name,
      description: data.description,
      data: data.data,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    };
  });
};

export const deleteDesignFromFirebase = async (designId: string): Promise<void> => {
  await deleteDoc(doc(requireUserDesigns(), designId));
};
