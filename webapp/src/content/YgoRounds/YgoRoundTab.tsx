import {Box, Grid, Typography} from '@mui/material';
import { FC } from 'react';
import { YgoRound } from '@/atoms/ygoRoundsAtom';
import useYgoRounds from "@/hooks/useYgoRounds";
import YgoPairingTable from "@/content/YgoPairings/YgoPairingTable";
import DeleteButton from "@/components/Modals/DeleteButton";
import {useAuthState} from "react-firebase-hooks/auth";
import {auth} from "@/firebase/clientApp";
import {YgoEvent} from "@/atoms/ygoEventsAtom";
import YgoPairingHighlight from "@/content/YgoPairings/YgoPairingHighlight";

interface YgoRoundTabProps {
    ygoRound: YgoRound;
    ygoEvent: YgoEvent;
}

const YgoRoundTab: FC<YgoRoundTabProps> = ({ ygoRound, ygoEvent }) => {
    const [user] = useAuthState(auth);

    const {
        deleteYgoRound
    } = useYgoRounds()

    return (
        <Grid
            container
            direction="row"
            justifyContent="left"
            alignItems="stretch"
            spacing={0}
        >
            <Grid item xs={12}>
                <Box p={1}>
                    <YgoPairingHighlight pairings={ygoRound.pairings} />
                </Box>
            </Grid>

            <Grid item xs={12}>
                <Typography p={1} variant="h3" component="h3" gutterBottom>
                    All Pairings
                </Typography>
                <Box p={0}>
                    <YgoPairingTable ygoPairings={ygoRound.pairings} />
                </Box>
            </Grid>

            {
                ygoRound.roundNumber === ygoEvent.numRounds && ygoEvent.createdBy === user.uid ? (
                    <Grid item xs={12}>
                        <Box p={4} >
                            <DeleteButton onDelete={async () => await deleteYgoRound(ygoRound, ygoEvent)} />
                        </Box>
                    </Grid>
                ) : <></>
            }
        </Grid>
    );
}

export default YgoRoundTab;
