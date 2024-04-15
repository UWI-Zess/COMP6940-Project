import { useState } from "react";
import { collection, doc, getDocs, increment, query, writeBatch } from 'firebase/firestore';
import { firestore } from "@/firebase/clientApp";
import { YgoPairing, YgoRound, YgoRounds_CollectionName } from '@/atoms/ygoRoundsAtom';
import {YgoEvent, YgoEvents_CollectionName} from "@/atoms/ygoEventsAtom";

const useYgoRounds = () => {
  const [ygoRoundLoading, setYgoRoundLoading] = useState<boolean>(false);

  const createYgoRound = async (formData: {}, pairings : YgoPairing[], event: YgoEvent) => {
    setYgoRoundLoading(true);
    // handle create
    console.log("creating", formData);
    if (pairings.length > 0){
      try {
        const batch = writeBatch(firestore);

        const newRound: YgoRound = {
          roundNumber: event.numRounds + 1, // go to the next round
          pairings: pairings as YgoPairing[],
          eventId: event.id
        }

        batch.set(
          doc(
            firestore,
            `${YgoEvents_CollectionName}/${event.id}/${YgoRounds_CollectionName}`,
            event.id + newRound.roundNumber
          ),
          newRound
        )

        batch.update(
          doc(firestore, YgoEvents_CollectionName, event.id), {
            numRounds: increment(1)
          }
        )

        await batch.commit();

        console.log("created round");
      } catch (e) {
        console.error(e);
      }
    } else {
      console.error("tried to create a round with no pairings");
    }
    setYgoRoundLoading(false);
  }

  /**
   * only the most recently uploaded round can be deleted.
   * @param round
   * @param event
   */
  const deleteYgoRound = async (round : YgoRound, event: YgoEvent) => {
    setYgoRoundLoading(true);

    if (round.roundNumber == event.numRounds){
      try {
        const batch = writeBatch(firestore);

        batch.delete(
          doc(
            firestore,
            `${YgoEvents_CollectionName}/${event.id}/${YgoRounds_CollectionName}/${event.id + round.roundNumber}`,
          )
        )

        batch.update(
          doc(firestore, YgoEvents_CollectionName, event.id), {
            numRounds: increment(-1)
          }
        )

        await batch.commit();

        console.log("deleted round ", JSON.stringify(round));
        window.location.reload();
      } catch (e) {
        console.error(e);
      }

    } else {
      console.error("cant delete this round since theres already a round after it.");
    }

    setYgoRoundLoading(false);
  }

  /**
   * delete all docs in this subcollection instance
   * @param rounds
   * @param event
   */
  const deleteAllYgoRounds = async (rounds : YgoRound[], event: YgoEvent) => {
    setYgoRoundLoading(true);

    if (rounds.length > 0){
      try {
        const batch = writeBatch(firestore);

        rounds.forEach(round => {
          batch.delete(
            doc(
              firestore,
              `${YgoEvents_CollectionName}/${event.id}/${YgoRounds_CollectionName}/${event.id + round.roundNumber}`,
            )
          )
        })
        await batch.commit();

      } catch (e) {
        console.error(e);
      }

    } else {
      console.warn("couldnt delete rounds collection for event: no rounds found");
    }

    setYgoRoundLoading(false);
  }

  const listYgoRounds = async (event: YgoEvent): Promise<YgoRound[] | null> => {
    let val = null;
    setYgoRoundLoading(true);
    try {
      const roundsQuery = query(
        collection(
          firestore,
          `${YgoEvents_CollectionName}/${event.id}/${YgoRounds_CollectionName}`,
        )
      )
      const roundsDocs = await getDocs(roundsQuery);
      val = roundsDocs.docs.map((doc) => ({ ...doc.data() }));
      console.log(val);
    } catch (e) {
      console.error(e);
    }
    setYgoRoundLoading(false);
    return val;
  }

  return {
    createYgoRound,
    deleteYgoRound,
    listYgoRounds,
    deleteAllYgoRounds,
  };
};

export default useYgoRounds;
