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

function ManagementUserProfile() {
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
                    <title>User Details - Management</title>
                </Head>
                <Container sx={{ mt: 3 }} maxWidth="lg">
                    <Grid
                        container
                        direction="row"
                        justifyContent="center"
                        alignItems="stretch"
                        spacing={3}
                    >
                        <Grid item xs={12}>
                            <ProfileCover user={user} />
                        </Grid>
                        <Grid item xs={12}>
                            <EditProfileTab
                                appUser={appUser}
                                updateAppUser={updateAppUser}
                            />
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

ManagementUserProfile.getLayout = (page) => (
    <SidebarLayout>{page}</SidebarLayout>
);

export default ManagementUserProfile;
