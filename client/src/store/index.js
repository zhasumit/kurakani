import { create } from "zustand";
import { createAuthSlice } from "./slices/auth-slice";

// import the useAppStore to use set and get methods of zustand store
export const useAppStore = create()((...a) => ({
    ...createAuthSlice(...a),
}));
