import {FC, useEffect, useState} from 'react';
import {YgoEvent} from "@/atoms/ygoEventsAtom";
import {
  Alert,
  Box,
  Divider,
  Grid, LinearProgress,
  Snackbar, SnackbarContent
} from '@mui/material';
import { useForm, Controller } from "react-hook-form";
import { useRouter } from 'next/router';
import {DateTimePicker, LoadingButton} from '@mui/lab';
import {useAuthState} from "react-firebase-hooks/auth";
import { auth } from '@/firebase/clientApp';
import { useDropzone } from 'react-dropzone';
import { YgoPairing, YgoRound } from '@/atoms/ygoRoundsAtom';
import useYgoRounds from '@/hooks/useYgoRounds';
import Papa from 'papaparse'
import YgoPairingTable from "@/content/YgoPairings/YgoPairingTable";

interface RoundFormProps{
  event?: YgoEvent;
  round?: YgoRound;
}

interface RoundForm{
  round: YgoRound;
  csvFile: any;
}

const RoundForm: FC<RoundFormProps> = ({event, round}) => {
  const router = useRouter();
  const { control, handleSubmit, formState: { errors }, watch } = useForm<RoundForm>();

  const {createYgoRound} = useYgoRounds();

  const boxPadding = 2;
  const itemSpacingXs = 12;
  const itemSpacingMd = 6;

  const [currUser] = useAuthState(auth);

  const [isUpdating, setIsUpdating] = useState(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [csvLoading, setCsvLoading] = useState<boolean>(false);
  const [isOwner, setIsOwner] = useState<boolean>(false); // disable the form for viewers?
  const [showToast, setShowToast] = useState<boolean>(false);
  const [pairings, setPairings] = useState<YgoPairing[]>([]);
  const [submitMsg, setSubmitMsg] = useState<string | null>(null);

  // Set isUpdating based on whether an event prop was passed
  if (round) {
    if (!isUpdating) {
      setIsUpdating(true);
    }
  } else {
    if (isUpdating) {
      setIsUpdating(false);
    }
  }

  useEffect(() => {
    if (isUpdating){ // if we are on the form details, give perms
      if (currUser.uid === event?.createdBy){setIsOwner(false)}
      else {setIsOwner(true)}
    }
  }, [])

  useEffect(() => {
    console.log(pairings);
  }, [pairings]);

  const handleDelete = async () => {
    setLoading(true);
    try {
      // router.push(`/events/${event.id}`)
      window.location.reload();
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  }

  const onDrop = (acceptedFiles: File[]) => {
    const csvFile = acceptedFiles[0];
    setPairings([]); // Clear previous pairings
    const reader = new FileReader();

    reader.onload = () => {
      setCsvLoading(true);
      const csvData = reader.result;

      Papa.parse(csvData as string, {
        delimiter: ',',
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          const rows = results.data;
          const pairings = [];

          rows.forEach((row) => {
            try {
              const table = row['Table'];
              const player1 = row['Player 1'];
              const player2 = row['Player 2'];

              if (!table || !player1 || !player2) {
                setSubmitMsg('Missing required fields');
                throw new Error('Missing required fields');
              }

              pairings.push({ table, player1, player2 });
            } catch (error) {
              setSubmitMsg('Error processing row: ' + error.message);
              // Handle the error as per your requirement (e.g., skip the row, log the error, etc.)
            }
          });

          setPairings(pairings);
          setCsvLoading(false);
          console.log(pairings);
        },
        error: (error) => {
          setSubmitMsg('Error parsing CSV: ' + error.message);
          // Handle the CSV parsing error as per your requirement
        }
      });
    };


    reader.readAsText(csvFile);
    setCsvLoading(false);
  };

  const { getRootProps, getInputProps, isDragActive, acceptedFiles } = useDropzone({
    multiple: undefined,
    onDragEnter: undefined,
    onDragLeave: undefined,
    onDragOver: undefined,
    onDrop: onDrop
  });

  const onSubmit = async (formData: {}) => {
    setLoading(true);
    setSubmitMsg(null);
    console.log(formData);

    // create sub collection
    try {
      if (isUpdating) {
        // handle update
        console.log("updating", formData);
        setShowToast(true); // Show the toast notification
      } else {
        // handle create
        await createYgoRound(formData, pairings, event);
        setSubmitMsg("Success!")
        window.location.reload();
      }
    } catch (e) {
      console.error(e);
      setSubmitMsg(`An error occured: ${e.toString()}`);
    }

    setLoading(false);
  };

  const handleToastClose = () => {
    setShowToast(false); // Hide the toast notification
  };

  // noinspection TypeScriptValidateTypes
  return (
      <form onSubmit={handleSubmit(onSubmit)}>
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
              message="YGO ROUND handled successfully!" // Message to be displayed in the toast
          />
        </Snackbar>
        <Grid
            container
            direction="row"
            justifyContent="left"
            alignItems="stretch"
            spacing={0}
        >
          <Grid item xs={12}>
            <h2>Upload Round Pairings CSV for the next round</h2>
          </Grid>
          <Grid item xs={itemSpacingXs} md={itemSpacingMd}>
            <Box p={boxPadding}>
              <div
                  {...getRootProps()}
                  style={{
                    border: '1px solid',
                    padding: '20px',
                    background: isDragActive ? '#364C62' : '#223344',
                    borderRadius: '4px',
                    textAlign: 'center',
                    cursor: 'pointer',
                  }}
              >
                <input {...getInputProps()} />
                {isDragActive ? (
                    <p style={{ margin: 0, color: '#FFFFFF' }}>Drop the CSV file here...</p>
                ) : (
                    <p style={{ margin: 0, color: '#FFFFFF' }}>Drag 'n' drop a CSV file here, or click to select files</p>
                )}
              </div>
              {errors.csvFile && (
                  <p style={{ color: 'red', marginTop: '8px' }}>{errors.csvFile.message}</p>
              )}
            </Box>
          </Grid>
          <Grid item xs={12}>
            {
              csvLoading ? (
                  <LinearProgress  />
              ) : (
                  <></>
              )
            }

            {
              isUpdating ? (
                  // if updating -> on the details page -> only show if this event was created by the logged in user
                  <>
                    {
                      event?.createdBy === currUser.uid ? (
                          <>
                            <Grid item xs={12}>
                              <Box p={boxPadding}>
                                <LoadingButton disabled={pairings.length == 0} variant={'outlined'} color={'primary'} loading={loading} type="submit">Submit</LoadingButton>
                              </Box>
                            </Grid>
                            <Grid item xs={12}>
                              <Box p={boxPadding}>
                                <LoadingButton variant={'outlined'} color={'secondary'} loading={loading} onClick={handleDelete}>Delete</LoadingButton>
                              </Box>
                            </Grid>
                          </>
                      ) : <></>
                    }
                  </>
              ) : (
                  // if creating -> on the creation modal -> do not show the delete button
                  <>
                    <Grid item xs={2}>
                      <Box p={boxPadding}>
                        <LoadingButton disabled={pairings.length == 0} variant={'outlined'} color={'primary'} loading={loading} type="submit">Submit</LoadingButton>
                      </Box>
                    </Grid>
                  </>
              )
            }

            <Divider />

            {/*csv file loaded*/}
            <Grid item xs={12}>
              <Box p={0}>
                {
                  pairings.length > 0 ? (
                      <>
                        <Alert severity="success">CSV Loaded! Number of pairings: {pairings.length}</Alert>
                        <YgoPairingTable ygoPairings={pairings} />
                      </>
                  ) : (
                      <></>
                  )
                }
                {
                  submitMsg ? (
                      <Alert severity="warning">{submitMsg}</Alert>
                  ) : <></>
                }
              </Box>
            </Grid>

          </Grid>
          <Divider />


        </Grid>
      </form>
  );
};

export default RoundForm;
