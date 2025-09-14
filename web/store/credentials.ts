import { Credentials } from "@/lib/types";
import { create } from "zustand";

type CredentialStore = {
  credentials: Credentials[] | [];
  addCredentials: (value: Credentials) => void;
  getCredentials: (service: string) => void;
};

export const useCredentialStore = create<CredentialStore>((set, get) => ({
  credentials: [],
  addCredentials: (value: Credentials) =>
    set((c) => ({ ...c, credentials: [...c.credentials, value] })),
  getCredentials: () => get().credentials,
}));
