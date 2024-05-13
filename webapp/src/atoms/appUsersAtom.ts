import { atom } from "recoil";
import {FieldValue} from "firebase/firestore";

export const AppUser_CollectionName = "users";

export interface AppUser {
  cossyId?: string | null;
  verified: boolean;
  id?: string | null;
  createdAt?: FieldValue;
  updatedAt?: FieldValue;
}

export interface AppUserForm {
  cossyId?: string | null;
}

interface AppUserState {
  user?: AppUser | null;
}

const defaultAppUserState: AppUserState = {
  user: null
};

export const appUserState = atom<AppUserState>({
  key: "appUserState",
  default: defaultAppUserState
});
