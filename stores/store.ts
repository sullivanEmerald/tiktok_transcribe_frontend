import { createClipSlice } from "./clips";
import { Store } from "@/types/store";
import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { createCollectionSlice } from "./collection";
import { createAuthSlice } from "./auth";

export const useStore = create<Store>()(immer((...a) => ({
    ...createClipSlice(...a),
    ...createCollectionSlice(...a),
    ...createAuthSlice(...a)
})));