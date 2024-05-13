import Head from 'next/head';
import SidebarLayout from '@/layouts/SidebarLayout';
import Footer from '@/components/Footer';

import { Container } from '@mui/material';

import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '@/firebase/clientApp';
import React, { useEffect, useState } from 'react';
import useAppUser from "@/hooks/useAppUser";
import FullScreenSpinner from "@/components/Spinners/FullScreenSpinner";
import * as d3 from 'd3';
import HeatmapComponent from '@/components/D3/HeatmapComponent';

const csvPath = 'data/cleaned_hate_crime.csv'

function Heatmap() {
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

    const [data, setData] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            const rawData = await d3.csv('data/cleaned_hate_crime_forecasting.csv');
            const aggregatedData = aggregateData(rawData);
            setData(aggregatedData);
        };
        fetchData();
    }, []);

    const aggregateData = (rawData) => {
        return d3.rollups(rawData, v => v.length, d => d.state_name)
            .map(([state, count]) => ({ state, count }));
    };


    if (!appUserLoading && appUser){
        return (
            <>
                <Head>
                    <title>Heatmap</title>
                </Head>
                <Container sx={{ mt: 3 }} maxWidth="lg">
                    <HeatmapComponent data={data} />
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

Heatmap.getLayout = (page) => (
    <SidebarLayout>{page}</SidebarLayout>
);

export default Heatmap;
