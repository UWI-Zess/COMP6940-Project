import { Typography, Grid } from '@mui/material';
import {YgoPairing} from "@/atoms/ygoRoundsAtom";
import {FC, useEffect, useState} from "react";
import useAppUser from "@/hooks/useAppUser";
import YgoPairingTable from "@/content/YgoPairings/YgoPairingTable";

interface YgoPairingHighlightProps {
  pairings: YgoPairing[];
}

const YgoPairingHighlight: FC<YgoPairingHighlightProps> = ({ pairings}) => {
  const [myPairing, setMyPairing] = useState<YgoPairing|null>(null);
  const {appUser} = useAppUser();

  useEffect(() => {
    if (pairings && pairings.length > 0 && appUser){
      if (appUser.cossyId && appUser.cossyId.length > 0){
        pairings.forEach((value, index) => {
          const rowNames = value.player1.toUpperCase() + " " + value.player2.toUpperCase();
          if (rowNames.includes(appUser.cossyId)){
            setMyPairing(value);
          }
        })
      }
    }
  }, [pairings, appUser])

  return (
    <Grid container justifyContent="space-between" alignItems="center">
      <Grid item>
        <Typography p={1} variant="h3" component="h3" gutterBottom>
          YOUR PAIRING
        </Typography>
      </Grid>
      <Grid item xs={12}>
        <YgoPairingTable myPairing={myPairing} />
      </Grid>
    </Grid>
  );
}

export default YgoPairingHighlight;
