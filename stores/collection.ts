import { StateCreator } from "zustand";
import { Store } from "@/types/store";
import { Collection } from "@/types/collection";
import { CreateCollection as createCollectionService, getAllCollections } from '@/services/collection';

type CollectionActions = {
    createCollection: (name: string) => Promise<Collection | undefined>,
    getAllCollections: () => Promise<Collection[]>,
}

export type CollectionSlice = {
    collections: Collection[],
    collectionState: {
        isfetching: boolean,
        isGetting: boolean,
    },
} & CollectionActions;

export const createCollectionSlice: StateCreator<Store, [['zustand/immer', never]], [], CollectionSlice> = (set, get) => ({
    collections: [],
    collectionState: { isfetching: false, isGetting: false },

    createCollection: async (name: string) => {
        if (!name || name.trim() === "") return;
        try {
            set((state) => ({ collectionState: { ...state.collectionState, isfetching: true } }));
            const newCollection = await createCollectionService(name);
            if (newCollection) {
                set((state) => ({
                    collections: [...state.collections, newCollection],
                }));
            }
            return newCollection;
        } catch (error) {
            console.error("Error creating collection:", error);
            // Rethrow so callers can handle the error if needed
            throw error;
        } finally {
            set((state) => ({ collectionState: { ...state.collectionState, isfetching: false } }));
        }
    },

    getAllCollections: async () => {
        try {
            set((state) => ({ collectionState: { ...state.collectionState, isGetting: true } }));
            const collections = await getAllCollections();
            set({ collections });
            return collections;
        } catch (error) {
            console.error("Error fetching collections:", error);
            throw error;
        } finally {
            set((state) => ({ collectionState: { ...state.collectionState, isGetting: false } }));
        }
    },
});
