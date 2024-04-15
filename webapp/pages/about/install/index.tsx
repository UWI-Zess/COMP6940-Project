import Head from 'next/head';
import SidebarLayout from '@/layouts/SidebarLayout';
import Footer from '@/components/Footer';

import {Grid, Container, CardMedia, Card, Typography} from '@mui/material';
import Image from "next/image";
import React from "react";
import {styled} from "@mui/material/styles";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import {ExpandMore} from "@mui/icons-material";
import AccordionDetails from "@mui/material/AccordionDetails";

function InstallPage() {
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
                        <h1>PWA?</h1>
                        <p>A Progressive Web App (PWA) is a web app that uses fancy technologies to simulate a mobile app experience.</p>
                        <p>This will allow modern phone browsers to install the website as if it were an application on your phone.</p>
                    </Grid>

                    <Grid item xs={12} md={8}>
                        <h1>How to install?</h1>
                        <Accordion>
                            <AccordionSummary
                                expandIcon={<ExpandMore />}
                                aria-controls="panel1a-content"
                                id="panel1a-header"
                            >
                                <Typography>Load up the app on your phone using your browser of choice (I hope it's Chrome)</Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                                <Card>
                                    <CardMedia component={"img"} height={"100%"} image={'/images/about/install/1.jpg'} />
                                </Card>
                            </AccordionDetails>
                        </Accordion>
                        <Accordion>
                            <AccordionSummary
                                expandIcon={<ExpandMore />}
                                aria-controls="panel1a-content"
                                id="panel1a-header"
                            >
                                <Typography>Install it</Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                                <Card>
                                    <CardMedia component={"img"} height={"100%"} image={'/images/about/install/2.jpg'} />
                                </Card>
                            </AccordionDetails>
                        </Accordion>
                    </Grid>
                </Grid>
            </Container>
            <Footer />
        </>
    )
}

InstallPage.getLayout = (page) => (
    <SidebarLayout>{page}</SidebarLayout>
);

export default InstallPage;
