// import { Card } from '@mui/material';
// import {FC, useState} from "react";
// import FullScreenSpinner from "@/components/Spinners/FullScreenSpinner";
// import {YgoPairing, YgoRound} from "@/atoms/ygoRoundsAtom";
// import YgoPairingTable from "@/content/YgoPairings/YgoPairingTable";
//
// interface RoundPairingsProps {
//   ygoRound: YgoRound;
// }
//
// const RoundPairings: FC<RoundPairingsProps> = ({ ygoRound }) => {
//   const [pairings, setPairings] = useState<YgoPairing[]>(ygoRound.pairings);
//   const [loading, setLoading] = useState<boolean>(true);
//
//   return (
//     <Card>
//       {
//         loading ? (
//           <FullScreenSpinner />
//         ) : (
//           pairings ? <YgoPairingTable ygoPairings={pairings}/> : <></>
//         )
//       }
//     </Card>
//   );
// }
//
// export default RoundPairings;
