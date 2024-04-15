import { atom } from "recoil";
import {FieldValue, Timestamp} from "firebase/firestore";

// model stuff
export const YgoEvents_CollectionName = "ygoEvents";

export type EventType = 'locals' | 'regionals' | 'nationals' | 'uds' | 'ycs' | 'otsc' | 'beginner';
export type EventFormat = 'normal' | 'rogue' | 'edison' | 'goat'  | 'team';
export type EventStatus = 'upcoming' | 'ongoing' | 'finished' | 'cancelled';

export interface YgoEvent {
  name: string; // th 1
  description?: string;
  venue: string; // th 2
  prizes: string;
  cost: number; // th 3
  status: EventStatus; // th 6
  type: EventType; // th 4
  format: EventFormat;
  startDate?: string | Date | null; // th 5
  endDate?: string | Date | null; // th 5
  numRounds: number;
  createdBy?: string | null;
  createdAt?: FieldValue;
  updatedAt?: FieldValue;
  id?: string | null;
}

export interface YgoEventForm {
  name: string; // th 1
  description?: string;
  venue: string; // th 2
  prizes: string;
  cost: number; // th 3
  status: EventStatus; // th 6
  type: EventType; // th 4
  format: EventFormat;
  startDate?: string | Date | null; // th 5
  endDate?: string | Date | null;
}


// atom stuff

// interface YgoEventState {
//   ygoEvents: YgoEvent[] | null;
//   // selectedYgoEvent: YgoEvent | null;
// }
//
// const defaultYgoEventState: YgoEventState = {
//   ygoEvents: null,
//   // selectedYgoEvent: null,
// };
//
// export const ygoEventState = atom<YgoEventState>({
//   key: "ygoEventsAtom",
//   default: defaultYgoEventState
// });
