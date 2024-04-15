import {
    // Typography,
    Box,
    Card,
    Container,
    Button,
    styled, Avatar, ListItemText, CircularProgress
} from '@mui/material';
import type { ReactElement } from 'react';
import BaseLayout from 'src/layouts/BaseLayout';

import Link from 'src/components/Link';
import Head from 'next/head';

// import Logo from 'src/components/LogoSign';
import Hero from 'src/content/Overview/Hero';
import {useAuthState, useSignInWithGoogle} from "react-firebase-hooks/auth";
import {auth} from "@/firebase/clientApp";
import {signOut} from "@firebase/auth";
import {useRouter} from "next/router";
import FullScreenSpinner from '@/components/Spinners/FullScreenSpinner';
// import { useRecoilState } from 'recoil';
// import { appUserState } from '@/atoms/appUsersAtom';
import { UserCredentialImpl } from '@firebase/auth/dist/src/core/user/user_credential_impl';

const HeaderWrapper = styled(Card)(
  ({ theme }) => `
  width: 100%;
  display: flex;
  align-items: center;
  height: ${theme.spacing(10)};
  margin-bottom: ${theme.spacing(10)};
`
);

const OverviewWrapper = styled(Box)(
  ({ theme }) => `
    overflow: auto;
    background: ${theme.palette.common.white};
    flex: 1;
    overflow-x: hidden;
`
);

function Overview() {
    // currently signed in user
    const [
        currUser,
        authLoading,
        userError
    ] = useAuthState(auth);

    // use google sign in
    const [
        signInWithGoogle,
        user,
        loading,
        error
    ] = useSignInWithGoogle(auth);
    // next router to redirect us to the dashboard on successful signin
    const router = useRouter();
    // const [appUserStateValue, setAppUserStateValue] = useRecoilState(appUserState);

    const signInAndRedirect = async () => {
        try {
            const res = await signInWithGoogle() as UserCredentialImpl;
            if (res && !error) {
                // redirect to dashboard
                // const appUser = await new AppUser().get(res.user.uid);
                // setAppUserStateValue((prev) => ({
                //     ...prev,
                //       user: appUser as AppUser
                // }));
                await router.push('/profile');
            }
        } catch (e) {
            // handle error
            console.log(e)
        }
    };

    const signOutAndRedirect = async () => {
        try {
            await signOut(auth);
            // setAppUserStateValue((prev) => ({
            //     ...prev,
            //     user: null
            // }));
            // redirect to dashboard
            await router.push('/');
        } catch (e) {
            // handle error
            console.log(e)
        }
    };

    if (loading || authLoading){
        return <FullScreenSpinner />
    }

    return (
      <OverviewWrapper>
          <Head>
              <title>D00LM8</title>
          </Head>
          <HeaderWrapper>
              <Container maxWidth="lg">
                  <Box display="flex" alignItems="center">
                      {/*<Logo />*/}
                      <Box
                        display="flex"
                        alignItems="center"
                        justifyContent="space-between"
                        flex={1}
                      >
                          <Box />
                          {
                              currUser ? (
                                <Box>
                                    <Button
                                      component={Link}
                                      href="/"
                                      variant="contained"
                                      sx={{ ml: 2 }}
                                      onClick={async () => await signOutAndRedirect()}
                                      // isLoading={loading}
                                    >
                                        <ListItemText
                                          primaryTypographyProps={{
                                              variant: 'h5',
                                          }}
                                          primary="Log Out"
                                        />
                                    </Button>
                                    {
                                        error &&
                                        (
                                          <p>
                                              {error.message}
                                          </p>
                                        )
                                    }
                                </Box>
                              ) : (
                                <Box>
                                    <Button
                                      // component={Link}
                                      // href={""}
                                      variant="contained"
                                      sx={{ ml: 2 }}
                                      onClick={async () => await signInAndRedirect()}
                                      // isLoading={loading}
                                    >
                                        <Avatar
                                          sx={{ width: 15, height: 15 }}
                                          src="/static/images/logo/google.svg"
                                        />
                                        <ListItemText
                                          style={{paddingLeft: '10px'}}
                                          primaryTypographyProps={{
                                              variant: 'h5',
                                          }}
                                          primary="Log In"
                                        />
                                    </Button>
                                    {
                                        error &&
                                        (
                                          <p>
                                              {error.message}
                                          </p>
                                        )
                                    }
                                </Box>
                              )
                          }
                      </Box>
                  </Box>
              </Container>
          </HeaderWrapper>
          <Hero />
          {/*<Container maxWidth="lg" sx={{ mt: 8 }}>*/}
          {/*  <Typography textAlign="center" variant="subtitle1">*/}
          {/*    Crafted by{' '}*/}
          {/*    <Link*/}
          {/*      href="https://bloomui.com"*/}
          {/*      target="_blank"*/}
          {/*      rel="noopener noreferrer"*/}
          {/*    >*/}
          {/*      BloomUI.com*/}
          {/*    </Link>*/}
          {/*  </Typography>*/}
          {/*</Container>*/}
      </OverviewWrapper>
    );
}

export default Overview;

Overview.getLayout = function getLayout(page: ReactElement) {
    return <BaseLayout>{page}</BaseLayout>;
};
