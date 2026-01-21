import { IAccount } from "@/server/models/Account";
import { create } from "zustand";

type AccountState = {
  account: IAccount | null;
  setAccount: (account: IAccount) => void;
};

export const useAccountStore = create<AccountState>((set) => ({
  account: null,
  setAccount: (account) => set({ account }),
}));
