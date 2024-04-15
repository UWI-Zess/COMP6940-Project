import {
  Typography,
  Button,
  Box,
  alpha,
  lighten,
  Avatar,
  styled
} from '@mui/material';
import DocumentScannerTwoToneIcon from '@mui/icons-material/DocumentScannerTwoTone';
import AddAlertTwoToneIcon from '@mui/icons-material/AddAlertTwoTone';
import {FC} from "react";
import {EmojiEvents, EventAvailable, EventNote, EventSeat, EventSharp, Facebook} from "@mui/icons-material";
import {YgoEvent} from "@/atoms/ygoEventsAtom";
import QRCodeButtonModal from "@/components/Modals/QRCodeButtonModal";

const AvatarPageTitle = styled(Avatar)(
  ({ theme }) => `
      width: ${theme.spacing(8)};
      height: ${theme.spacing(8)};
      color: ${theme.colors.primary.main};
      margin-right: ${theme.spacing(2)};
      background: ${
        theme.palette.mode === 'dark'
          ? theme.colors.alpha.trueWhite[10]
          : theme.colors.alpha.white[50]
      };
      box-shadow: ${
        theme.palette.mode === 'dark'
          ? '0 1px 0 ' +
            alpha(lighten(theme.colors.primary.main, 0.8), 0.2) +
            ', 0px 2px 4px -3px rgba(0, 0, 0, 0.3), 0px 5px 16px -4px rgba(0, 0, 0, .5)'
          : '0px 2px 4px -3px ' +
            alpha(theme.colors.alpha.black[100], 0.4) +
            ', 0px 5px 16px -4px ' +
            alpha(theme.colors.alpha.black[100], 0.2)
      };
`
);

interface EventsPageHeaderProps {
  className?: string;
  ygoEvent: YgoEvent;
}

const EventPageHeader: FC<EventsPageHeaderProps> = ({ ygoEvent }) => {

  return (
    <Box
      display="flex"
      alignItems={{ xs: 'stretch', md: 'center' }}
      flexDirection={{ xs: 'column', md: 'row' }}
      justifyContent="space-between"
    >
      <Box display="flex" alignItems="center">
        <AvatarPageTitle variant="rounded">
          <EmojiEvents fontSize="large" />
        </AvatarPageTitle>
        <Box>
          <Typography variant="h3" component="h3" gutterBottom>
            {ygoEvent.name}
          </Typography>
          <QRCodeButtonModal value={window.location.href} />
          {/*<Typography variant="subtitle2">*/}
          {/*  {ygoEvent.description}*/}
          {/*</Typography>*/}
        </Box>
      </Box>
      {/*<Box mt={{ xs: 3, md: 0 }}>*/}
      {/*  <Button variant="contained" startIcon={<Facebook />}>*/}
      {/*    Export*/}
      {/*  </Button>*/}
      {/*</Box>*/}
    </Box>
  );
}

export default EventPageHeader;
