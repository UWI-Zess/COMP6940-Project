import {FC, useEffect, useState} from 'react';
import {YgoEvent, YgoEventForm} from "@/atoms/ygoEventsAtom";
import {
    Box,
    Divider,
    FormControl,
    Grid,
    InputAdornment, MenuItem,
    OutlinedInput, Select, Snackbar, SnackbarContent,
    TextField, Typography
} from '@mui/material';
import { useForm, Controller } from "react-hook-form";
import { useRouter } from 'next/router';
import {DateTimePicker, LoadingButton} from '@mui/lab';
import {useAuthState} from "react-firebase-hooks/auth";
import {auth} from "@/firebase/clientApp";
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import { format } from 'date-fns';
import { YgoRound } from '@/atoms/ygoRoundsAtom';
import useYgoRounds from '@/hooks/useYgoRounds';
import DeleteButton from "@/components/Modals/DeleteButton";
import {EventFormat, EventStatus, EventType} from "@/atoms/ygoEventsAtom";
import useYgoEvents from "@/hooks/useYgoEvents";

interface EventFormProps{
    ygoEvent?: YgoEvent;
    rounds?: YgoRound[]; // for batch delete logic
}

const EventForm: FC<EventFormProps> = ({ygoEvent, rounds}) => {
    const router = useRouter();
    const { control, handleSubmit, formState: { errors }, watch } = useForm<YgoEventForm>();

    const {
        createYgoEvent,
        updateYgoEvent,
        deleteYgoEvent,
        getYgoEvent,
        listYgoEvents,
    } = useYgoEvents();

    const {
        deleteAllYgoRounds,
    } = useYgoRounds();

    const boxPadding = 2;
    const itemSpacingXs = 12;
    const itemSpacingMd = 6;

    const [currUser] = useAuthState(auth);

    const [isUpdating, setIsUpdating] = useState(false);
    const [loading, setLoading] = useState<boolean>(false);
    const [isOwner, setIsOwner] = useState<boolean>(false); // disable the form for viewers?
    const [showToast, setShowToast] = useState<boolean>(false);

    // Set isUpdating based on whether an event prop was passed
    if (ygoEvent) {
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
            if (currUser.uid === ygoEvent?.createdBy){setIsOwner(false)}
            else {setIsOwner(true)}
        }
    }, [])

    const handleDelete = async () => {
        setLoading(true);
        try {
            await deleteAllYgoRounds(rounds, ygoEvent);
            await deleteYgoEvent(ygoEvent.id);
            router.push("/events")
        } catch (e) {
            console.error(e);
        }
        setLoading(false);
    }
    const onSubmit = async (data: YgoEventForm) => {
        setLoading(true);
        try {
            if (isUpdating) {
                // handle update
                console.log("updating", data);
                const res = await updateYgoEvent(data, ygoEvent.id)
                console.log(res);
                setShowToast(true); // Show the toast notification
            } else {
                // handle create
                console.log("creating", data);
                const res = await createYgoEvent(data);
                if (res.id){
                    // redirect to events details page:
                    router.push(`/events/${res.id}`)
                } else {
                    // failed to make the event
                }
            }
        } catch (e) {
            console.error(e);
        }
        setLoading(false);
    };

    const handleToastClose = () => {
        setShowToast(false); // Hide the toast notification
    };

    const formatDate = (date) => {
        if (date){
            return format(date, 'yyyy-MM-dd');
        }
        return format(new Date(), 'yyyy-MM-dd');
    };

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
                    message="Form updated successfully!" // Message to be displayed in the toast
                />
            </Snackbar>
            <Grid
                container
                direction="row"
                justifyContent="left"
                alignItems="stretch"
                spacing={0}
            >
                <Grid item xs={itemSpacingXs} md={itemSpacingMd}>
                    <Box p={boxPadding}>
                        <Controller
                            name="name"
                            control={control}
                            defaultValue={ygoEvent?.name || ""}
                            rules={{
                                required: "Name is required",
                                maxLength: {
                                    value: 200,
                                    message: "Name should not exceed 200 characters",
                                },
                            }}
                            render={({ field }) => (
                                <>
                                    <TextField
                                        required
                                        label="Name"
                                        error={!!errors.name}
                                        helperText={errors.name?.message}
                                        {...field}
                                        disabled={isOwner}
                                    />
                                </>
                            )}
                        />
                    </Box>
                </Grid>

                <Grid item xs={itemSpacingXs} md={itemSpacingMd}>
                    <Box p={boxPadding}>
                        <Controller
                            name="venue"
                            control={control}
                            defaultValue={ygoEvent?.venue || ""}
                            rules={{
                                required: "Venue is required",
                                maxLength: {
                                    value: 150,
                                    message: "Venue should not exceed 150 characters",
                                },
                            }}
                            render={({ field }) => (
                                <>
                                    <TextField
                                        required
                                        label="Venue"
                                        error={!!errors.venue}
                                        helperText={errors.venue?.message}
                                        {...field}
                                        disabled={isOwner}
                                    />
                                </>
                            )}
                        />
                    </Box>
                </Grid>


                <Grid item xs={itemSpacingXs} md={itemSpacingMd}>
                    <Box p={boxPadding}>
                        <Typography variant="subtitle1">Entry Fee</Typography>
                        <Controller
                            name="cost"
                            control={control}
                            defaultValue={ygoEvent?.cost || 0}
                            rules={{
                                min: 1,
                                max: 1000,
                                required: true
                            }}
                            render={({ field }) => (
                                <>
                                    <OutlinedInput
                                        startAdornment={<InputAdornment position="start">$</InputAdornment>}
                                        type="number"
                                        label="Cost"
                                        error={!!errors.cost}
                                        {...field}
                                        disabled={isOwner}
                                    />
                                    {errors.cost && <Typography variant="caption" color="error">Enter a number between 1 and 1000.</Typography>}
                                </>
                            )}
                        />
                    </Box>
                </Grid>

                <Grid item xs={itemSpacingXs} md={itemSpacingMd}>
                    <Box p={boxPadding}>
                        <Typography variant="subtitle1">Type</Typography>
                        <Controller
                            name="type"
                            control={control}
                            defaultValue={ygoEvent?.type || 'locals'}
                            render={({ field }) => (
                                <FormControl>
                                    <Select label="Type" {...field} disabled={isOwner}>
                                        <MenuItem value="locals">Locals</MenuItem>
                                        <MenuItem value="regionals">Regionals</MenuItem>
                                        <MenuItem value="nationals">Nationals</MenuItem>
                                        <MenuItem value="uds">UDS</MenuItem>
                                        <MenuItem value="ycs">YCS</MenuItem>
                                        <MenuItem value="otsc">OTSC</MenuItem>
                                        <MenuItem value="beginner">Beginner</MenuItem>
                                    </Select>
                                </FormControl>
                            )}
                        />
                    </Box>
                </Grid>

                <Grid item xs={itemSpacingXs} md={itemSpacingMd}>
                    <Box p={boxPadding}>
                        <Typography variant="subtitle1">Format</Typography>
                        <Controller
                            name="format"
                            control={control}
                            defaultValue={ygoEvent?.format || 'normal'}
                            render={({ field }) => (
                                <FormControl>
                                    <Select label="Format" {...field} disabled={isOwner}>
                                        <MenuItem value="normal">Normal</MenuItem>
                                        <MenuItem value="rogue">Rogue</MenuItem>
                                        <MenuItem value="edison">Edison</MenuItem>
                                        <MenuItem value="goat">GOAT</MenuItem>
                                        <MenuItem value="team">Team</MenuItem>
                                    </Select>
                                </FormControl>
                            )}
                        />
                    </Box>
                </Grid>

                <Grid item xs={itemSpacingXs} md={itemSpacingMd}>
                    <Box p={boxPadding}>
                        <Typography variant="subtitle1">Status</Typography>
                        <Controller
                            name="status"
                            control={control}
                            defaultValue={ygoEvent?.status || 'upcoming'}
                            render={({ field }) => (
                                <FormControl>
                                    <Select label="Status" {...field} disabled={isOwner}>
                                        <MenuItem value="upcoming">Upcoming</MenuItem>
                                        <MenuItem value="ongoing">Ongoing</MenuItem>
                                        <MenuItem value="finished">Finished</MenuItem>
                                        <MenuItem value="cancelled">Cancelled</MenuItem>
                                    </Select>
                                </FormControl>
                            )}
                        />
                    </Box>
                </Grid>

                <Grid item xs={itemSpacingXs} md={itemSpacingMd}>
                    <Box p={boxPadding}>
                        <Controller
                            name="description"
                            control={control}
                            defaultValue={ygoEvent?.description || ""}
                            rules={{
                                maxLength: {
                                    value: 1000,
                                    message: "Description should not exceed 1000 characters",
                                },
                            }}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    label="Description"
                                    multiline
                                    fullWidth
                                    rows={6}
                                    disabled={isOwner}
                                    error={!!errors.description}
                                    helperText={errors.description?.message || ''}
                                    inputProps={{
                                        maxLength: 1000,
                                    }}
                                />
                            )}
                        />
                    </Box>
                </Grid>

                <Grid item xs={itemSpacingXs} md={itemSpacingMd}>
                    <Box p={boxPadding}>
                        <Controller
                            name="prizes"
                            control={control}
                            defaultValue={ygoEvent?.prizes || ""}
                            rules={{
                                maxLength: {
                                    value: 1000,
                                    message: "Prizes should not exceed 1000 characters",
                                },
                            }}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    label="Prizes"
                                    multiline
                                    fullWidth
                                    rows={6}
                                    disabled={isOwner}
                                    error={!!errors.prizes}
                                    helperText={errors.prizes?.message || ''}
                                    inputProps={{
                                        maxLength: 1000,
                                    }}
                                />
                            )}
                        />
                    </Box>
                </Grid>

                <Grid item xs={itemSpacingXs} md={itemSpacingMd}>
                    <Box p={boxPadding}>
                        <Controller
                            name="startDate"
                            control={control}
                            defaultValue={ygoEvent?.startDate ? ygoEvent.startDate : new Date()}
                            rules={{
                                required: "Start Date is required",
                            }}
                            render={({ field }) => (
                                <LocalizationProvider dateAdapter={AdapterDateFns}>
                                    <DateTimePicker
                                        {...field}
                                        label="Start Date"
                                        value={field.value ? new Date(field.value) : null}
                                        onChange={(date) => field.onChange(date?.toISOString() || null)}
                                        disabled={isOwner}
                                        renderInput={(params) => (
                                            <TextField
                                                {...params}
                                                type="text"
                                                error={!!errors.startDate}
                                                helperText={errors.startDate?.message || ''}
                                            />
                                        )}
                                        disablePast
                                        minDate={new Date(new Date().setDate(new Date().getDate() - 1))}
                                    />
                                </LocalizationProvider>
                            )}
                        />
                    </Box>
                </Grid>

                <Grid item xs={itemSpacingXs} md={itemSpacingMd}>
                    <Box p={boxPadding}>
                        <Controller
                            name="endDate"
                            control={control}
                            defaultValue={ygoEvent?.endDate ? ygoEvent.endDate : new Date()}
                            rules={{
                                required: "End Date is required",
                            }}
                            render={({ field }) => (
                                <LocalizationProvider dateAdapter={AdapterDateFns}>
                                    <DateTimePicker
                                        {...field}
                                        label="End Date"
                                        value={field.value ? new Date(field.value) : null}
                                        onChange={(date) => field.onChange(date?.toISOString() || null)}
                                        disabled={isOwner}
                                        renderInput={(params) => (
                                            <TextField
                                                {...params}
                                                type="text"
                                                error={!!errors.endDate}
                                                helperText={errors.endDate?.message || ''}
                                            />
                                        )}
                                        disablePast
                                        minDate={new Date(new Date().setDate(new Date().getDate() - 1))}
                                    />
                                </LocalizationProvider>
                            )}
                        />
                    </Box>
                </Grid>
                <Divider />
                {
                    isUpdating ? (
                        // if updating -> on the details page -> only show if this event was created by the logged in user
                        <>
                            {
                                ygoEvent?.createdBy === currUser.uid ? (
                                    <>
                                        <Grid item xs={12} md={2}>
                                            <Box p={boxPadding}>
                                                <LoadingButton variant={'outlined'} color={'primary'} loading={loading} type="submit">Submit</LoadingButton>
                                            </Box>
                                        </Grid>
                                        <Grid item xs={12} md={2}>
                                            <Box p={boxPadding}>
                                                <DeleteButton onDelete={handleDelete} />
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
                                    <LoadingButton variant={'outlined'} color={'primary'} loading={loading} type="submit">Submit</LoadingButton>
                                </Box>
                            </Grid>
                        </>
                    )
                }

            </Grid>
        </form>
    );
};

export default EventForm;
