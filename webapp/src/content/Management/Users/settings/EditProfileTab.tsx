import {
  Grid,
  Typography,
  CardContent,
  Card,
  Box,
  Divider,
  Button, TextField, Snackbar, SnackbarContent
} from '@mui/material';

import EditTwoToneIcon from '@mui/icons-material/EditTwoTone';
import DoneTwoToneIcon from '@mui/icons-material/DoneTwoTone';
import Text from '@/components/Text';
import Label from '@/components/Label';
import {FC, useState} from "react";
import {AppUser, AppUserForm} from "@/atoms/appUsersAtom";
import AppUtil from "@/AppUtil";
import { useForm, Controller } from "react-hook-form";
import {Timestamp} from "firebase/firestore";

interface EditProfileTabProps{
  appUser: AppUser;
  updateAppUser: (data: AppUserForm) => void | Promise<void>;
}

const EditProfileTab: FC<EditProfileTabProps> = ({appUser, updateAppUser}) => {
  const { handleSubmit, control } = useForm<AppUserForm>();

  const [showToast, setShowToast] = useState<boolean>(false);
  const handleToastClose = () => {
    setShowToast(false); // Hide the toast notification
  };
  const onSubmit = async (data : AppUserForm) => {
    // Logic to handle form submission
    try {
      console.log(data.cossyId);
      await updateAppUser(data);
      setShowToast(true);
    } catch (e) {
      console.error(e)
    }
  };

  return (
      <Grid container spacing={3}>
        <Snackbar
            open={showToast}
            autoHideDuration={3000} // Duration for which the toast should be displayed (in milliseconds)
            onClose={handleToastClose}
            anchorOrigin={{ vertical: 'top', horizontal: 'center' }} // Position of the toast notification
        >
          <SnackbarContent
              sx={{
                backgroundColor: '#E1BEE7', // Light purple color
                paddingTop: 10, // Padding top of 4 units
              }}
              message="Form updated successfully!" // Message to be displayed in the toast
          />
        </Snackbar>
        <Grid item xs={12}>
          <Card>
            <Box
                p={3}
                display="flex"
                alignItems="center"
                justifyContent="space-between"
            >
              <Box>
                <Typography variant="h4" gutterBottom>
                  Account Info
                </Typography>
              </Box>
            </Box>
            <Divider />
            <CardContent sx={{ p: 4 }}>
              <Typography variant="subtitle2">
                <Grid container spacing={0}>
                  <Grid item xs={12} sm={4} md={3} textAlign={{ sm: 'right' }}>
                    <Box pr={3} pb={2}>
                      Created on:
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={8} md={9}>
                    <Text color="black">
                      <b>{AppUtil.printDate(appUser.createdAt as Timestamp)}</b>
                    </Text>
                  </Grid>
                </Grid>
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
  );
}

export default EditProfileTab;
