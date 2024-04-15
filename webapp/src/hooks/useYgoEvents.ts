import {useState} from "react";
import {collection, doc, getDocs, serverTimestamp} from "firebase/firestore";
import {auth, firestore} from "@/firebase/clientApp";
import {YgoEvent, YgoEventForm, YgoEvents_CollectionName} from "@/atoms/ygoEventsAtom";
import {useAuthState} from "react-firebase-hooks/auth";
import {addDoc, deleteDoc, DocumentSnapshot, getDoc, setDoc} from "@firebase/firestore";

const useYgoEvents = () => {
  const [user] = useAuthState(auth);
  const [ygoEventLoading, setYgoEventLoading] = useState<boolean>(false);
  const [ygoEventSubmitMsg, setYgoEventSubmitMsg] = useState<string | null>(null);

  const createYgoEvent = async (formData: YgoEventForm): Promise<YgoEvent> => {
    setYgoEventLoading(true);
    let val = null;
    // handle create
    console.log("creating", formData);
    try {
      const newRound: YgoEvent = {
        name: formData.name,
        description: formData.description,
        venue: formData.venue,
        prizes: formData.prizes,
        cost: formData.cost,
        status: formData.status,
        type: formData.type,
        format: formData.format,
        startDate: formData.startDate,
        endDate: formData.endDate,
        numRounds: 0,
        createdBy: user.uid,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };

      const docRef = await addDoc(
          collection(firestore, YgoEvents_CollectionName),
          newRound
      )
      newRound.id = docRef.id
      console.log("created ygo event");
      val = newRound;
    } catch (e) {
      console.error(e);
      val = null;
    }
    setYgoEventLoading(false);
    return val;
  }

  const updateYgoEvent = async (formData: YgoEventForm, id: string) => {
    setYgoEventLoading(true);
    // handle update
    console.log("updating", formData);
    try {

      const docRef = doc(
          firestore,
          YgoEvents_CollectionName,
          id
      )

      const existingDataDoc = await getDoc(docRef);
      const existingData = existingDataDoc.data() as YgoEvent;

      let data: YgoEvent = {
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

      console.log("updated ygo event");
    } catch (e) {
      console.error(e);
    }
    setYgoEventLoading(false);
  }

  const deleteYgoEvent = async (id: string) => {
    setYgoEventLoading(true);
    try {
      // get doc ref

      const docRef = doc(
          firestore,
          YgoEvents_CollectionName,
          id
      );

      await deleteDoc(docRef);

    } catch (e) {
      console.error(e);
    }
    setYgoEventLoading(false);
  }

  const getYgoEvent = async (id: string): Promise<YgoEvent | null> => {
    setYgoEventLoading(true);
    let val: YgoEvent | null = null;
    try {
      // get doc ref
      const docRef = doc(
          firestore,
          YgoEvents_CollectionName,
          id
      );
      const res = await getDoc(docRef);
      if (res.exists()){
        val = res.data() as YgoEvent;
        val.id = res.id;
      }
    } catch (e) {
      console.error(e);
    }
    setYgoEventLoading(false);
    return val;
  }

  const listYgoEvents = async (): Promise<YgoEvent[] | null> => {
    setYgoEventLoading(true);
    let vals : YgoEvent[] = [];
    try {
      const snapshot = await getDocs(
          collection(firestore, YgoEvents_CollectionName)
      );
      vals = snapshot.docs.map(doc => {
        let ygoEvent = doc.data();
        ygoEvent.id = doc.id;
        return ygoEvent as YgoEvent;
      });
    } catch (e) {
      console.error(e);
    }
    setYgoEventLoading(false);
    return vals;
  }

  return {
    createYgoEvent,
    updateYgoEvent,
    deleteYgoEvent,
    getYgoEvent,
    listYgoEvents,
  };

};

export default useYgoEvents;
