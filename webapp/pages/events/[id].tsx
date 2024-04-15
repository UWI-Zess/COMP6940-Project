import SidebarLayout from '@/layouts/SidebarLayout';
import { useRouter } from 'next/router';
import { NextPage } from "next";
import {ChangeEvent, useEffect, useState} from "react";
import FullScreenSpinner from "@/components/Spinners/FullScreenSpinner";
import EventForm from "@/components/forms/EventForm";
import {Box, Card, Container, Divider, Grid, styled, Tab, Tabs, useTheme} from "@mui/material";
import TaskSearch from "@/content/Dashboards/Tasks/TaskSearch";
import Head from "next/head";
import PageTitleWrapper from "@/components/PageTitleWrapper";
import EventPageHeader from "@/content/Events/EventPageHeader";
import {useAuthState} from "react-firebase-hooks/auth";
import {auth} from "@/firebase/clientApp";
import Footer from "@/components/Footer";
import RoundForm from "@/components/forms/RoundForm";
import useYgoRounds from '@/hooks/useYgoRounds';
import { YgoRound } from '@/atoms/ygoRoundsAtom';
import YgoRoundTab from '@/content/YgoRounds/YgoRoundTab';
import {YgoEvent} from "@/atoms/ygoEventsAtom";
import useYgoEvents from "@/hooks/useYgoEvents";

const TabsContainerWrapper = styled(Box)(
    ({ theme }) => `
      padding: 0 ${theme.spacing(2)};
      position: relative;
      bottom: -1px;

      .MuiTabs-root {
        height: 44px;
        min-height: 44px;
      }

      .MuiTabs-scrollableX {
        overflow-x: auto !important;
      }

      .MuiTabs-indicator {
          min-height: 4px;
          height: 4px;
          box-shadow: none;
          bottom: -4px;
          background: none;
          border: 0;

          &:after {
            position: absolute;
            left: 50%;
            width: 28px;
            content: ' ';
            margin-left: -14px;
            background: ${theme.colors.primary.main};
            border-radius: inherit;
            height: 100%;
          }
      }

      .MuiTab-root {
          &.MuiButtonBase-root {
              height: 44px;
              min-height: 44px;
              background: ${theme.colors.alpha.white[50]};
              border: 1px solid ${theme.colors.alpha.black[10]};
              border-bottom: 0;
              position: relative;
              margin-right: ${theme.spacing(1)};
              font-size: ${theme.typography.pxToRem(14)};
              color: ${theme.colors.alpha.black[80]};
              border-bottom-left-radius: 0;
              border-bottom-right-radius: 0;

              .MuiTouchRipple-root {
                opacity: .1;
              }

              &:after {
                position: absolute;
                left: 0;
                right: 0;
                width: 100%;
                bottom: 0;
                height: 1px;
                content: '';
                background: ${theme.colors.alpha.black[10]};
              }

              &:hover {
                color: ${theme.colors.alpha.black[100]};
              }
          }

          &.Mui-selected {
              color: ${theme.colors.alpha.black[100]};
              background: ${theme.colors.alpha.white[100]};
              border-bottom-color: ${theme.colors.alpha.white[100]};

              &:after {
                height: 0;
              }
          }
      }
  `
);

interface RoundTab {
  value: string;
  label: string;
}

const EventDetails: NextPage = () => {
  // tab strip stuff
  const theme = useTheme();
  const [ygoRounds, setYgoRounds] = useState<YgoRound[]>([]);

  const [tabs, setTabs] = useState<RoundTab[]>([
    { value: 'eventDetails', label: 'Overview' }
  ]);
  const [currentTab, setCurrentTab] = useState<string>('eventDetails');

  const handleTabsChange = (_event: ChangeEvent<{}>, value: string): void => {
    setCurrentTab(value);
  };

  const [
    currUser,
    authLoading,
    userError
  ] = useAuthState(auth);

  // ygo round stuff
  const {
    listYgoRounds
  } = useYgoRounds();

  const {
    createYgoEvent,
    updateYgoEvent,
    deleteYgoEvent,
    getYgoEvent,
    listYgoEvents,
  } = useYgoEvents();

  const router = useRouter();
  const { id } = router.query;
  const [ygoEvent, setYgoEvent] = useState<YgoEvent | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {

    setLoading(true);
    const fetchYgoEventAndRounds = async () => {
      let ygoEventFromDb = await getYgoEvent(id as string);
      setYgoEvent(ygoEventFromDb)

      const ygoRoundFromDb = await listYgoRounds(ygoEventFromDb);
      setYgoRounds(ygoRoundFromDb);

      // iterate over the ygo rounds we pulled and set the tabs
      let tempTabs : RoundTab[] = [{ value: 'eventDetails', label: 'Overview' }];
      tempTabs.push(...ygoRoundFromDb.map((el, idx) => {
        return  {
          label: `Round ${el.roundNumber}`,
          value: `round${el.roundNumber}`
        };
      }))

      setTabs(tempTabs);
    }

    fetchYgoEventAndRounds().catch(console.error);
    setLoading(false);
  }, [])

  return (
      <>
        {
          loading ? (
              <FullScreenSpinner />
          ) : (
              ygoEvent ?
                  <>
                    <Head>
                      <title>{ygoEvent.name}</title>
                    </Head>
                    <PageTitleWrapper>
                      <EventPageHeader  ygoEvent={ygoEvent}/>
                    </PageTitleWrapper>
                    <Container maxWidth="lg">
                      <TabsContainerWrapper>
                        <Tabs
                            onChange={handleTabsChange}
                            value={currentTab}
                            variant="scrollable"
                            scrollButtons
                            allowScrollButtonsMobile
                            textColor="primary"
                            indicatorColor="primary"
                        >
                          {tabs.length > 0 ? (
                              tabs.map((tab, idx) => (
                                  <Tab key={`tab${idx}`} label={tab.label} value={tab.value} />
                              ))
                          ) : (
                              <></>
                          )}
                        </Tabs>
                      </TabsContainerWrapper>
                      <Card variant="outlined">
                        <Grid
                            container
                            direction="row"
                            justifyContent="center"
                            alignItems="stretch"
                            spacing={0}
                        >
                          {currentTab === 'eventDetails' && (
                              <>
                                {/*event details section*/}
                                <Grid item xs={12}>
                                  <Box p={4}>
                                    <EventForm ygoEvent={ygoEvent} rounds={ygoRounds} />
                                  </Box>
                                </Grid>
                                {/*add round - only visible to createdBy user*/}
                                {
                                  ygoEvent.createdBy === currUser.uid ? (
                                      <Grid item xs={12}>
                                        <Divider />
                                        <Box
                                            p={4}
                                            sx={{
                                              background: `${theme.colors.alpha.black[5]}`
                                            }}
                                        >
                                          <Grid container spacing={4}>
                                            <Grid item xs={12} sm={6} md={8}>
                                              <RoundForm event={ygoEvent} round={null} />
                                            </Grid>
                                            <Grid item xs={12} sm={6} md={4}>
                                              {/*<Performance />*/}
                                            </Grid>
                                          </Grid>
                                        </Box>
                                        <Divider />
                                      </Grid>
                                  ) : <></>
                                }
                              </>
                          )}
                          {
                            ygoRounds.length > 0 ? (
                                ygoRounds.map((el, idx) => {
                                  return (
                                      <Grid item xs={12} key={`ygoRound${idx}`}>
                                        {
                                            currentTab === `round${el.roundNumber}` && (
                                                <YgoRoundTab ygoRound={el} ygoEvent={ygoEvent}/>
                                            )
                                        }
                                      </Grid>
                                  )
                                })
                            ) : <></>
                          }
                        </Grid>
                      </Card>
                    </Container>
                  </> : <></>
          )
        }
        <Footer />
      </>
  );
}

EventDetails.getLayout = (page) => (
    <SidebarLayout>{page}</SidebarLayout>
);

export default EventDetails;
