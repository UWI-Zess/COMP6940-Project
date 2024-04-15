import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '@/firebase/clientApp';
import { useRouter } from 'next/router';
import React, { ReactNode } from 'react';
import FullScreenSpinner from '@/components/Spinners/FullScreenSpinner';

type LayoutProps = {
  children: ReactNode;
};

const requireAuth = (Component: React.FC<LayoutProps>) => {
  return ({ children } : LayoutProps) => {
    const [user, loading, error] = useAuthState(auth);
    const router = useRouter();

    if (loading) {
      // Show loading spinner or component while Firebase auth initializes
      return <FullScreenSpinner path={"Authenticating User..."} />;
    }

    if (error) {
      // Handle any errors that occur during Firebase auth initialization
      console.error(error);
      return <div>Error initializing Firebase authentication</div>;
    }

    if (!user) {
      // Redirect to homepage if user is not authenticated
      router.push('/');
      return null;
    }

    // Render the authenticated component
    return <Component>{children}</Component>;
  };
};

export default requireAuth;
