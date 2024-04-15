import { Card } from '@mui/material';
import EventsTable from './EventsTable';
import {YgoEvent} from "@/atoms/ygoEventsAtom";
import {useEffect, useState} from "react";
import FullScreenSpinner from "@/components/Spinners/FullScreenSpinner";
import useYgoEvents from "@/hooks/useYgoEvents";

function AllEvents() {
  const [ygoEvents, setYgoEvents] = useState<YgoEvent[] | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const {
    listYgoEvents,
  } = useYgoEvents();

  useEffect(() => {
    const fetchYgoEvents = async () => {
      setLoading(true);
      let ygoEventsFromDb = await listYgoEvents();
      setYgoEvents(ygoEventsFromDb)
      console.log(ygoEventsFromDb)
      setLoading(false);
    }
    fetchYgoEvents().catch(console.error)
  }, [])

  return (
    <Card>
      {/*{*/}
      {/*  ygoEventsStateValue.ygoEvents ?*/}
      {/*      <EventsTable ygoEvents={ygoEventsStateValue.ygoEvents} /> :*/}
      {/*      <FullScreenSpinner />*/}
      {/*}*/}
      {
        loading ? (
            <FullScreenSpinner />
        ) : (
            ygoEvents ? <EventsTable ygoEvents={ygoEvents} /> : <></>
        )
      }
    </Card>
  );
}

export default AllEvents;
