import { atom } from "recoil";

export const YgoRounds_CollectionName = "ygoRounds";

export interface YgoPairing {
  table: string;
  player1: string;
  player2: string;
}

export interface YgoRound {
  roundNumber: number;
  pairings: YgoPairing[];
  eventId: string;
}

interface YgoRoundsState {
  ygoRounds: YgoRound[] | null;
}

const defaultYgoRoundState: YgoRoundsState = {
  ygoRounds: null,
};

export const ygoRoundState = atom<YgoRoundsState>({
  key: "ygoRoundsAtom",
  default: defaultYgoRoundState
});
