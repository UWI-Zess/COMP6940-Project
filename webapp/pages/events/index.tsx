import Head from 'next/head';
import SidebarLayout from '@/layouts/SidebarLayout';
import PageHeader from '@/content/Management/Transactions/PageHeader';
import PageTitleWrapper from '@/components/PageTitleWrapper';
import { Grid, Container } from '@mui/material';
import Footer from '@/components/Footer';

import AllEvents from '@/content/Events/AllEvents';
import EventPageHeader from '@/content/Events/EventsPageHeader';

function Events() {
  return (
    <>
      <Head>
        <title>Events</title>
      </Head>
      <PageTitleWrapper>
        <EventPageHeader />
      </PageTitleWrapper>
      <Container maxWidth="lg">
        <Grid
          container
          direction="row"
          justifyContent="center"
          alignItems="stretch"
          spacing={3}
        >
          <Grid item xs={12}>
            <AllEvents />
          </Grid>
        </Grid>
      </Container>
      <Footer />
    </>
  );
}

Events.getLayout = (page) => (
  <SidebarLayout>{page}</SidebarLayout>
);

export default Events;
