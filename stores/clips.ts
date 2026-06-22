import { Clip } from "@/types/clips";
import { StateCreator } from "zustand";
import { Store } from "@/types/store";
import { deleteClip, fetchClips, giveClipTitle, moveClipToCollection, updateClip } from "@/services/clip";
import { current } from "immer";
import { stat } from "fs";
import { showToaster } from "@/lib/utils";

type ClipActions = {
    getAllClips: (filter: any) => Promise<Clip[]>,
    setFilters: (filters: any) => void,
    onPlatformChange: (value: string) => void,
    onFolderChange: (value: string) => void,
    onSearchChange: (search: string) => void,
    handleMoveClip: (clipId: string, collectionId: string) => Promise<void>,
    handleEditClip: (clipId: string, text: string) => Promise<void>,
    deleteClip: (clipId: string) => Promise<void>,
    giveClipTitle: (clipId: string, title: string) => Promise<void>,
}

export type ClipSlice = {
    clips: Clip[],
    isloading: {
        isfetching: boolean,
        isMoving: boolean,
        isEditing: boolean,
        isDeleteing: boolean,
        isGivingTitle: boolean,
    },
    clipFilters: {
        platform: string,
        collectionId: string,
        search: string,
        currentPage: number,
        limit: number,
    };
} & ClipActions;

export const createClipSlice: StateCreator<Store, [['zustand/immer', never]], [], ClipSlice> = (set, get) => ({
    clips: [],
    clipFilters: {
        platform: "",
        collectionId: "",
        search: "",
        currentPage: 1,
        limit: 10,
    },
    isloading: { isfetching: false, isMoving: false, isEditing: false, isDeleteing: false, isGivingTitle: false },

    getAllClips: async (filters: any) => {
        try {
            set((state) => ({ isloading: { ...state.isloading, isfetching: true } }));
            const clips = await fetchClips(filters);
            set({ clips });
            return clips;
        } catch (error) {
            console.error("Error fetching clips:", error);
        } finally {
            set((state) => ({ isloading: { ...state.isloading, isfetching: false } }));
        }
    },
    setFilters: (filters) => {
        console.log("setFilters", filters);
        set((state) => ({
            clipFilters: {
                ...state.clipFilters,
                ...filters,
            },
        }));
    },
    onPlatformChange: (value: string) => {
        set((state) => ({
            clipFilters: {
                ...state.clipFilters,
                platform: value,
                currentPage: 1,
            },
        }));
    },
    onFolderChange: (value: string) => {
        set((state) => ({
            clipFilters: {
                ...state.clipFilters,
                collectionId: value,
                currentPage: 1,
            },
        }));

    },
    onSearchChange: (search: string) => {
        set((state) => ({
            clipFilters: {
                ...state.clipFilters,
                search,
                currentPage: 1,
            },
        }));
    },
    handleMoveClip: async (clipId: string, collectionId: string) => {
        try {
            set((state) => ({ isloading: { ...state.isloading, isMoving: true } }));
            await moveClipToCollection(clipId, collectionId);
            set((state) => ({
                clips: state.clips.filter((clip) =>
                    clip._id !== clipId
                ),
            }));
            showToaster("Clip moved successfully", "success");
        } catch (error) {
            console.error("Error moving clip:", error);
        } finally {
            set((state) => ({ isloading: { ...state.isloading, isMoving: false } }));
        }
    },

    handleEditClip: async (clipId: string, text: string) => {
        try {
            set((state) => ({ isloading: { ...state.isloading, isEditing: true } }));
            await updateClip(clipId, text);
            set((state) => ({
                clips: state.clips.map((clip) =>
                    clip._id === clipId ? { ...clip, text } : clip
                ),
            }));
        } catch (error) {
            console.error("Error editing clip:", error);
        } finally {
            set((state) => ({ isloading: { ...state.isloading, isEditing: false } }));
        }
    },

    deleteClip: async (clipId: string) => {
        try {
            set((state) => ({ isloading: { ...state.isloading, isDeleteing: true } }));
            await deleteClip(clipId);
            set((state) => ({
                clips: state.clips.filter((clip) => clip._id !== clipId),
            }));
            showToaster("Clip deleted successfully", "success");
        } catch (error) {
            console.error("Error deleting clip:", error);
        } finally {
            set((state) => ({ isloading: { ...state.isloading, isDeleteing: false } }));
        }
    },

    giveClipTitle: async (clipId: string, title: string) => {
        try {
            set((state) => ({ isloading: { ...state.isloading, isGivingTitle: true } }));
            await giveClipTitle(clipId, title);
            set((state) => ({
                clips: state.clips.map((clip) =>
                    clip._id === clipId ? { ...clip, title } : clip
                ),
            }));
            showToaster("Clip title updated successfully", "success");
        } catch (error) {
            console.error("Error updating clip title:", error);
        } finally {
            set((state) => ({ isloading: { ...state.isloading, isGivingTitle: false } }));
        }
    },

});
