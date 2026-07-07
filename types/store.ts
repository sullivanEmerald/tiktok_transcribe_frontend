import { ClipSlice } from "@/stores/clips";
import { CollectionSlice } from "@/stores/collection";
import { AuthSlice } from "@/stores/auth";

export type Store = ClipSlice & CollectionSlice & AuthSlice;