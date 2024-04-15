import Head from 'next/head';
import SidebarLayout from '@/layouts/SidebarLayout';
import Footer from '@/components/Footer';

import {Grid, Container, Box} from '@mui/material';
import Link from "next/link";
import DoneTwoToneIcon from "@mui/icons-material/DoneTwoTone";
import Label from "@/components/Label";

function AboutPage() {
    return(
        <>
            <Head>
                <title>User Details - Management</title>
            </Head>
            <Container sx={{ mt: 3 }} maxWidth="lg">
                <Grid
                    container
                    direction="row"
                    justifyContent="center"
                    alignItems="stretch"
                    spacing={0}
                >
                    <Grid item xs={12} md={8}>
                        <h1>How to Use (Player)</h1>
                        <p>
                            As a user, simply go to your <Link href={'/profile'}>profile</Link> {' '}
                            and enter your COSSY ID in the field, and save it.
                        </p>
                        <p>
                            Now, when your OTS hosts an <Link href={'/events'}>event</Link> ,
                            you'll easily be able to see your table and opponent for each round!
                        </p>
                    </Grid>

                    <Grid item xs={12} md={8}>
                        <h1>How to Use (TO)</h1>
                        <p>
                            Firstly, ensure you have
                            <Label color="success">
                                <DoneTwoToneIcon fontSize="small" />
                                <b>{' '}Premium</b>
                            </Label> {' '}
                            status on your <Link href={'/profile'}>profile</Link> {' '}.
                            This will allow you to create an event.
                        </p>
                        <p>Head over to <Link href={'/events'}>events</Link> and create a new one.</p>
                        <p>Then inside the KTS program, you can export the round pairings as a CSV file.</p>
                        <p>On the event overview tab of the event you just created, you'll see a dropzone to drag the CSV file there.</p>
                    </Grid>

                    <Grid item xs={12} md={8}>
                        <h1>Why?</h1>
                        <p>
                            The main inspiration for this app is to streamline the process of finding your table at a bigger event (Regional, National, etc). However, using it for a locals or any tournament is encouraged.
                        </p>
                        <p>
                            Another driver for this passion project is my keen interest in Data Science and statistics in games.
                        </p>
                    </Grid>

                    <Grid item xs={12} md={8}>
                        <h1>Feedback</h1>
                        <p>Please give me feedback!</p>
                        <p>Feel free to reach me via my business/personal socials!</p>
                        <a href="https://forms.gle/83FBHm2TmTAwBvJu6"><h2>Google Form</h2></a>
                        <div className="iframe-container">
                            <iframe
                                src="https://docs.google.com/forms/d/e/1FAIpQLSccQyDNOaSPWHv25WN91OwWzw3PlsZXmPBqelZQGdAeMdVtUg/viewform?embedded=true"
                                allowFullScreen
                            >
                                Loading...
                            </iframe>
                        </div>
                    </Grid>

                </Grid>
            </Container>
            <Footer />

            {/* eslint-disable-next-line react/no-unknown-property */}
            <style jsx>{`
    .iframe-container {
      position: relative;
      overflow: hidden;
      padding-top: 65%; /* Adjust the padding ratio to increase the height */
    }

    .iframe-container iframe {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
    }
  `}</style>

        </>
    )
}

AboutPage.getLayout = (page) => (
    <SidebarLayout>{page}</SidebarLayout>
);

export default AboutPage;
