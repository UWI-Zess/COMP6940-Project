import Head from 'next/head';
import { Container } from '@mui/material';
import Footer from '@/components/Footer';
import SidebarLayout from '@/layouts/SidebarLayout';
import FullScreenSpinner from '@/components/Spinners/FullScreenSpinner';
import useAppUser from "@/hooks/useAppUser";
import {useAuthState} from "react-firebase-hooks/auth";
import {useState} from "react";
import {auth} from "@/firebase/clientApp";
import NotebookHTMLComponent from "@/components/NotebookHTML";
import {NextPage} from "next";

import fs from 'fs';
import path from 'path';
// @ts-ignore
import { GetStaticProps } from 'next';

export const getStaticProps: GetStaticProps = async () => {
    const htmlPath = path.join(process.cwd(), 'public', 'notebooks', 'html', 'main.html');
    const htmlContent = fs.readFileSync(htmlPath, 'utf8');

    return {
        props: { notebookHtmlContent: htmlContent },
    };
};

// Your component here

interface FullReportProps {
    notebookHtmlContent : string;
}

const FullReport: NextPage<FullReportProps> = ({ notebookHtmlContent  }) => {
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

    if (!appUserLoading && appUser) {
        return (
            <>
                <Head>
                    <title>User Details - Management</title>
                </Head>
                <Container sx={{ mt: 3 }} maxWidth="lg">
                    {/*<NotebookHTMLComponent notebookHtmlPath={'/notebooks/html/main.html'} />  /!* Use the NotebookComponent here *!/*/}
                    <NotebookHTMLComponent notebookHtmlContent={notebookHtmlContent} />
                </Container>
                <Footer />
            </>
        );
    } else {
        return (
            <FullScreenSpinner />
        );
    }
};

FullReport.getLayout = (page) => (
    <SidebarLayout>{page}</SidebarLayout>
);

export default FullReport;
