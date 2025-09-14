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
    set((state) => {
      if (state.credentials.find((e) => e.service === value.service)) {
        return {
          credentials: state.credentials.map((n) =>
            n.service === value.service ? { ...n, info: value.info } : n
          ),
        };
      }

      return {
        credentials: [...state.credentials, value],
      };
    }),
  // ({ ...c, credentials: [...c.credentials, value] })),
  getCredentials: () => get().credentials,
}));
