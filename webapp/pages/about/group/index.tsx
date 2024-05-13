import Head from 'next/head';
import SidebarLayout from '@/layouts/SidebarLayout';
import Footer from '@/components/Footer';

import { Grid, Container } from '@mui/material';

import ProfileCover from '@/content/Management/Users/details/ProfileCover';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '@/firebase/clientApp';
import {useState} from 'react';
import useAppUser from "@/hooks/useAppUser";
import EditProfileTab from "@/content/Management/Users/settings/EditProfileTab";
import FullScreenSpinner from "@/components/Spinners/FullScreenSpinner";

function AboutGroup() {
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
                    <title>About - Group</title>
                </Head>
                <Container sx={{ mt: 3 }} maxWidth="lg">
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

AboutGroup.getLayout = (page) => (
    <SidebarLayout>{page}</SidebarLayout>
);

export default AboutGroup;
