import {FC, ReactNode, useEffect} from 'react';
import PropTypes from 'prop-types';
import { Box } from '@mui/material';
import {useAuthState} from "react-firebase-hooks/auth";
import {auth} from "@/firebase/clientApp";
import {useRouter} from "next/router";

interface BaseLayoutProps {
  children?: ReactNode;
}

const BaseLayout: FC<BaseLayoutProps> = ({ children }) => {
    return (
    <Box
      sx={{
        display: 'flex',
        flex: 1,
        height: '100%'
      }}
    >
      {children}
    </Box>
  );
};

BaseLayout.propTypes = {
  children: PropTypes.node
};

export default BaseLayout;
