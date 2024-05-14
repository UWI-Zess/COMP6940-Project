import Head from 'next/head';
import SidebarLayout from '@/layouts/SidebarLayout';
import Footer from '@/components/Footer';
import { Grid, Container, Typography, Box, Paper } from '@mui/material';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '@/firebase/clientApp';
import { useState } from 'react';
import useAppUser from "@/hooks/useAppUser";
import FullScreenSpinner from "@/components/Spinners/FullScreenSpinner";

function AboutProject() {
    const [user, authLoading, userError] = useAuthState(auth);
    const [loading, setLoading] = useState<boolean>(false);

    const {
        appUser,
        appUserLoading,
        appUserSubmitMsg,
        updateAppUser,
        grantAppUser,
        revokeAppUser,
    } = useAppUser();

    if (!appUserLoading && appUser){
        return (
            <>
                <Head>
                    <title>About - Project</title>
                </Head>
                <Container sx={{ mt: 3 }} maxWidth="lg">
                    <Grid container spacing={3}>
                        <Grid item xs={12}>
                            <Paper elevation={3} sx={{ p: 3 }}>
                                <Typography variant="h4" gutterBottom>
                                    About the Project
                                </Typography>
                                <Typography variant="body1" gutterBottom>
                                    Hate crimes represent a pressing societal issue, characterized by targeted acts of
                                    violence, discrimination, or intimidation against individuals or groups based on their race,
                                    religion, ethnicity, sexual orientation, or other protected characteristics. Despite societal
                                    and legislative efforts to combat hate crimes, understanding the fundamental dynamics of these
                                    acts remains challenging.
                                </Typography>
                                <Typography variant="h6" gutterBottom>
                                    Problem Statement
                                </Typography>
                                <Typography variant="body1" gutterBottom>
                                    We aim to investigate hate crime incidents using logistic regression and exploratory analysis
                                    to find trends, identify vulnerable groups, and offer useful predictions exclusively to law
                                    enforcement agencies and government entities through a heatmap display and Policy and Advocacy Tool API.
                                </Typography>
                                <Typography variant="h6" gutterBottom>
                                    Objectives
                                </Typography>
                                <Typography variant="body1" gutterBottom>
                                    Our project focuses on the following objectives:
                                    <ul>
                                        <li>Conduct exploratory data analysis to uncover trends and patterns in hate crime incidents.</li>
                                        <li>Develop logistic regression models to predict hate crime occurrences based on various factors.</li>
                                        <li>Create an interactive heatmap to visualize the spatial distribution of hate crimes.</li>
                                        <li>Develop an API to provide stakeholders with actionable insights from our analysis.</li>
                                    </ul>
                                </Typography>
                                <Typography variant="h6" gutterBottom>
                                    Methods
                                </Typography>
                                <Typography variant="body1" gutterBottom>
                                    Our analysis involves:
                                    <ul>
                                        <li>Exploratory Data Analysis (EDA) to understand the distribution, relationships, and trends within the hate crime dataset.</li>
                                        <li>Logistic Regression modeling to identify probable areas and risk factors for hate crimes.</li>
                                        <li>Heatmap Visualization to highlight high-risk areas and patterns across different geographic regions.</li>
                                        <li>Predictive Modeling to forecast future hate crime occurrences and identify key influencing factors.</li>
                                        <li>API Development to provide stakeholders with easy access to our findings and insights.</li>
                                    </ul>
                                </Typography>
                                <Typography variant="h6" gutterBottom>
                                    Team Members
                                </Typography>
                                <Typography variant="body1" gutterBottom>
                                    This project is a collaborative effort by Group A:
                                    <ul>
                                        <li>Ajay Sieunarine - 816000325</li>
                                        <li>Ishika Gopie - 81601253</li>
                                        <li>Shane Tikasingh - 816020147</li>
                                        <li>Joshua Ali - 816023462</li>
                                    </ul>
                                </Typography>
                                <Typography variant="h6" gutterBottom>
                                    Data Sources
                                </Typography>
                                <Typography variant="body1" gutterBottom>
                                    Our dataset contains detailed data on hate crime incidents, including specifics of incidents,
                                    victim and perpetrator characteristics, and geographic data. [<a href="https://ucr.fbi.gov/hate-crime">https://ucr.fbi.gov/hate-crime</a>]
                                </Typography>
                                <Typography variant="h6" gutterBottom>
                                    Methodology
                                </Typography>
                                <Typography variant="body1" gutterBottom>
                                    The Hate Crime Statistics Data Collection of the FBI’s Uniform Crime Reporting (UCR) Program collects data regarding criminal offenses
                                    that were motivated, in whole or in part, by the offender’s bias against the victim’s race/ethnicity/ancestry, gender, gender identity,
                                    religion, disability, or sexual orientation, and were committed against persons, property, or society.
                                    For more details, refer to the methodology document.
                                </Typography>
                            </Paper>
                        </Grid>
                    </Grid>
                </Container>
                <Footer />
            </>
        )
    } else {
        return (
            <FullScreenSpinner />
        )
    }
}

AboutProject.getLayout = (page) => (
    <SidebarLayout>{page}</SidebarLayout>
);

export default AboutProject;
