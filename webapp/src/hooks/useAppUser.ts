import { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, firestore } from "@/firebase/clientApp";
import {doc, serverTimestamp} from "firebase/firestore";
import {AppUser, AppUser_CollectionName, AppUserForm} from "@/atoms/appUsersAtom";
import {getDoc, setDoc} from "@firebase/firestore";

const useAppUser = () => {
  const [authUser] = useAuthState(auth);
  const [appUser, setAppUser] = useState<AppUser|null>(null);
  const [appUserLoading, setAppUserLoading] = useState<boolean>(false);
  const [appUserSubmitMsg, setAppUserSubmitMsg] = useState<string | null>(null);

  useEffect(() => {
    if (!authUser){return;} // user not logged in?
    findOrCreate().then(r => {
      setAppUser(r)
    })
  }, [authUser])

  const findOrCreate = async (): Promise<AppUser> => {
    setAppUserLoading(true);
    let val = null;
    try { // try to find the app user, they may not exist if its their first time using the app!
      const docRef = doc(
          firestore,
          AppUser_CollectionName,
          authUser.uid
      )
      const res = await getDoc(docRef);

      if (res.exists()){ // user exists and is found here
        val = res.data() as AppUser;
        setAppUser(val);
      } else { // user was not found, so create their AppUser entry now
        let newAppUser: AppUser = {
          cossyId: null,
          verified: false,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        }
        await setDoc(
            doc(firestore, AppUser_CollectionName, authUser.uid),
            newAppUser
        )
        newAppUser.id = authUser.uid;
        val = newAppUser;
      }
    } catch (e) {
      console.error(e)
    }
    setAppUserLoading(false);
    console.log("app user: ", val)
    setAppUser(val);
    return val;
  }

  /**
   * grant access to the logged-in user (verified ✅)
   */
  const grantAppUser = async () => {
    setAppUserLoading(true);
    try {

      const docRef = doc(
          firestore,
          AppUser_CollectionName,
          authUser.uid
      )

      const existingDataDoc = await getDoc(docRef);
      const existingData = existingDataDoc.data() as AppUser;

      let data: AppUser = {
        ...existingData,
        verified: true,
        updatedAt: serverTimestamp(),
      }

      // update doc
      const res = await setDoc(
          docRef,
          data as any,
          { merge: true }
      )

      console.log("updated app user");
    } catch (e) {
      console.error(e);
    }
    setAppUserLoading(false);
  }

  /**
   * remove verified status from a user
   */
  const revokeAppUser = async () => {
    setAppUserLoading(true);
    try {

      const docRef = doc(
          firestore,
          AppUser_CollectionName,
          authUser.uid
      )

      const existingDataDoc = await getDoc(docRef);
      const existingData = existingDataDoc.data() as AppUser;

      let data: AppUser = {
        ...existingData,
        verified: false,
        updatedAt: serverTimestamp(),
      }

      // update doc
      const res = await setDoc(
          docRef,
          data as any,
          { merge: true }
      )

      console.log("updated app user");
    } catch (e) {
      console.error(e);
    }
    setAppUserLoading(false);
  }

  const updateAppUser = async (formData: AppUserForm) => {
    setAppUserLoading(true);
    // handle update
    console.log("updating", formData);
    try {

      const docRef = doc(
          firestore,
          AppUser_CollectionName,
          authUser.uid
      )

      const existingDataDoc = await getDoc(docRef);
      const existingData = existingDataDoc.data() as AppUser;

      let data: AppUser = {
        ...existingData,
        ...formData,
        updatedAt: serverTimestamp(),
      }

      // update doc
      const res = await setDoc(
          docRef,
          data as any,
          { merge: true }
      )

      console.log("updated app user");
      setAppUser(data);
    } catch (e) {
      console.error(e);
    }
    setAppUserLoading(false);
  }

  return {
    appUser,
    appUserLoading,
    appUserSubmitMsg,
    updateAppUser,
    grantAppUser,
    revokeAppUser,
  };

};

export default useAppUser;
