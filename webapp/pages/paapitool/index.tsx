import Head from 'next/head';
import SidebarLayout from '@/layouts/SidebarLayout';
import Footer from '@/components/Footer';

import { Container } from '@mui/material';

import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '@/firebase/clientApp';
import {useState} from 'react';
import useAppUser from "@/hooks/useAppUser";
import FullScreenSpinner from "@/components/Spinners/FullScreenSpinner";
import IframeComponent from "@/components/Iframes/IframeComponent";

function PaApiTool() {
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
                    <title>API Tool</title>
                </Head>
                <Container sx={{ mt: 3 }} maxWidth="lg">
                    <div style={{ padding: '20px', backgroundColor: '#1e1e1e' }}> {/* Container with dark background */}
                        <IframeComponent src="https://spontaneous-constantine-ishika.koyeb.app/docs#" title="External Documentation" />
                    </div>
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

PaApiTool.getLayout = (page) => (
    <SidebarLayout>{page}</SidebarLayout>
);

export default PaApiTool;
