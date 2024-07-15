import React, { useState, useCallback, useRef, useEffect } from 'react';
import {
  AppBar,
  Toolbar,
  IconButton,
  useMediaQuery,
  Typography,
  Box,
  Button,
  Stack,
  Badge,
  Dialog,
  Slide
} from '@mui/material';
import { TransitionProps } from '@mui/material/transitions';
import { alpha, experimentalStyled as styled, useTheme } from '@mui/material/styles';
import { Icon } from '@iconify/react';
import peopleFill from '@iconify/icons-eva/people-fill';
import ReorderIcon from '@mui/icons-material/Reorder';
import { useSelector } from 'react-redux';
import { logOut } from '~redux-store/actions/authActions';
import { MHidden } from '~ui/components/@material-extend';
import MIconButton from '~ui/components/@material-extend/MIconButton';
import MenuPopover from '~ui/atoms/MenuPopover/MenuPopover';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import { makeStyles } from '@mui/styles';
import NotificationsSection from '~ui/molecules/NotificationsSection/NotificationsSection';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { updateCounts } from '~redux-store/actions/authActions';
import { JWT_PREFIX, SOCKET_URL } from '~config/environment';
import NotificationSound from '~assets/sounds/sonido-notification.mp3';
import { useAppDispatch } from '~redux-store/store';
import { capitalizeAllWords } from '~utils/Word';
import { Theme } from '~ui/themes';

const DRAWER_WIDTH = 280;
const APP_BAR_MOBILE = 64;
const APP_BAR_DESKTOP = 92;

const useStyles: any = makeStyles((theme: Theme) => ({
  customBadge: {
    backgroundColor: '#D84D44',
    color: 'white'
  },
  headerNotifications: {
    display: 'flex',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginBlock: '16px',
    color: '#212B36',
    fontSize: '22px',
    fontWeight: 700
  },
  papperDialog: {
    '& .MuiDialog-paper': {
      backgroundColor: theme.palette.primary.lighter,
      margin: 0
    }
  },
  iconHover: {
    '&:hover': {
      cursor: 'pointer'
    }
  }
}));

const RootStyle = styled(AppBar)(({ theme }: any) => ({
  boxShadow: 'none',
  backdropFilter: 'blur(6px)',
  WebkitBackdropFilter: 'blur(6px)', // Fix on Mobile
  backgroundColor: alpha(theme.palette.background.default, 0.72),
  [theme.breakpoints.up('lg')]: {
    width: `calc(100% - ${DRAWER_WIDTH + 1}px)`
  }
}));

const ToolbarStyle = styled(Toolbar)(({ theme }: any) => ({
  minHeight: APP_BAR_MOBILE,
  [theme.breakpoints.up('lg')]: {
    minHeight: APP_BAR_DESKTOP,
    padding: theme.spacing(0, 5)
  }
}));

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement;
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

type Notification = {
  id: string;
  tenant_id?: string;
  service?: string;
  service_id?: string;
  description?: string;
  has_seen?: boolean;
  has_sound?: boolean;
  view_at?: string;
  created_at?: string;
  icon?: string;
};

export type HeaderProps = {
  activeDrawer?: boolean;
  handleActiveDrawer?: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  children?: React.ReactNode;
  titulo?: string;
};

const CustomHeader: React.FC<HeaderProps> = (props: HeaderProps) => {
  const socket = useRef<WebSocket | null>(null);
  const { handleActiveDrawer, titulo }: HeaderProps = props;
  const anchorRef = useRef(null);
  const notificationRef = useRef(null);
  const [open, setOpen] = useState<boolean>(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [openNotifications, setOpenNotifications] = useState<boolean>(false);
  const dispatch = useAppDispatch();
  const { auth }: any = useSelector((state: any) => state);
  const classes = useStyles();
  const themes = useTheme();
  const isActiveDesktop = useMediaQuery(themes.breakpoints.down('md'));
  const [notificationsCount, setNotificationsCount] = useState<number>(0);
  // const [first, setFirst] = useState<boolean>(true);
  const token = localStorage.getItem('token');
  // Howler.volume(0.8);

  const soundPlay = useCallback((src: any) => {
    const sound = new Audio(src);
    sound.play();
  }, []);

  const handleUpdateCountsSidebar = useCallback(
    (obj: any) => {
      // update value to any badge
      // const obj = {
      //   Comunicaciones: 4,
      //   Productos: 20
      // };
      dispatch(updateCounts(obj));
    },
    [dispatch]
  );

  const _updateCounts = useCallback(
    (arr: Notification[]) => {
      const obj: any = {};
      for (let i = 0; i < arr.length; i++) {
        switch (arr[i].service) {
          case 'forms':
          case 'forms-Producers':
          case 'forms-Free':
            obj['Formularios'] = (obj['Formularios'] || 0) + 1;
            break;
          case 'tele_assistances':
            obj['Comunicaciones'] = (obj['Comunicaciones'] || 0) + 1;
            break;
          case 'producers':
            obj['Productores'] = (obj['Productores'] || 0) + 1;
            break;
          case 'inventory':
            obj['Inventario'] = (obj['Inventario'] || 0) + 1;
            break;
          default:
            break;
        }
      }
      handleUpdateCountsSidebar(obj);
    },
    [handleUpdateCountsSidebar]
  );

  const handleClose = useCallback((): void => {
    setOpen(false);
  }, []);

  const handleOpen = useCallback(() => {
    setOpen(true);
  }, []);

  const handleCloseNotifications = useCallback((): void => {
    setOpenNotifications(false);
  }, []);

  const handleOpenNotifications = useCallback(() => {
    setOpenNotifications(true);
  }, []);

  const handleLogOut = useCallback(() => {
    dispatch(logOut());
  }, [dispatch]);

  useEffect(() => {
    // console.log(notifications);
    if (notifications.length >= 0) {
      const seenNotifications = notifications.filter((element: Notification) => !element.has_seen);
      if (seenNotifications.length > 0) {
        setNotificationsCount(seenNotifications.length);
        _updateCounts(seenNotifications);
      }
    }
  }, [notifications, _updateCounts]);

  //ACTIONS

  const listNotificationsAction = useCallback(() => {
    if (socket.current?.readyState) {
      socket?.current?.send(
        JSON.stringify({
          action: 'get_recent_manager',
          tenant_id: `${auth?.organizationTheme?.organizationId}`,
          authorization: `${JWT_PREFIX} ${token}`
        })
      );
    }
  }, [auth, token]);

  const readNotificationAction = useCallback(
    (id: string) => {
      if (socket.current?.readyState) {
        socket?.current?.send(
          JSON.stringify({
            action: 'update_notification_seen',
            item_id: `${id}`,
            tenant_id: `${auth?.organizationTheme?.organizationId}`,
            authorization: `${JWT_PREFIX} ${token}`
          })
        );
      }
    },
    [auth, token]
  );
  // RESPONSES
  const onMessageResponse = useCallback(
    (data: any) => {
      const response = JSON.parse(data.data);
      if (response?.hasOwnProperty('event')) {
        switch (response.event) {
          case 'send_notification':
            listNotificationsAction();
            break;
          case 'get_recent_manager':
            const array: Notification[] = response.data;
            if (Array.isArray(array)) {
              setNotifications(array);
              // soundPlay(NotificationSound);
              if (array[0]?.has_sound) {
                soundPlay(NotificationSound);
              }
              // else {
              //   setFirst(false);
              // }
            }
            break;
          case 'update_notification_seen':
            listNotificationsAction();
            break;
          default:
            break;
        }
      }
    },
    [listNotificationsAction, soundPlay]
  );

  //CONNECTION

  const onErrorConnection = useCallback((e: any) => {
    // eslint-disable-next-line no-console
    console.log(e);
  }, []);

  const onConnectionOpenResponse = useCallback(() => {
    listNotificationsAction();
  }, [listNotificationsAction]);

  const onConnect = useCallback(() => {
    try {
      socket.current = new WebSocket(
        `${SOCKET_URL}?tenant_id=${auth?.organizationTheme?.organizationId}&authorization=${JWT_PREFIX} ${token}`
      );

      // adding listeners
      socket.current.addEventListener('open', onConnectionOpenResponse);
      socket.current.addEventListener('message', onMessageResponse);
      socket.current.addEventListener('error', onErrorConnection);
    } catch (error) {
      console.warn(error);
    }
  }, [auth, token, onConnectionOpenResponse, onMessageResponse, onErrorConnection]);

  useEffect(() => {
    if (socket.current?.readyState !== 1) {
      // console.log('iniciando conexión');
      onConnect();
    }
    // listNotifications();
  }, [onConnect]);

  useEffect(() => {
    return () => {
      socket?.current?.close();
    };
  }, []);

  return (
    <RootStyle>
      <ToolbarStyle>
        <MHidden width="lgUp">
          <Box position="absolute" color="white" top="25%" left={10}>
            <IconButton aria-controls="customized-menu" aria-haspopup="true" onClick={handleActiveDrawer} size="small">
              <ReorderIcon />
            </IconButton>
          </Box>
        </MHidden>

        <Box ml={2}>
          <Box color="#2F3336" fontSize="24px" fontWeight="600">
            {capitalizeAllWords(titulo ?? '')}
          </Box>
        </Box>

        <Box sx={{ flexGrow: 1 }} />

        <Stack direction="row" spacing={{ xs: 0.5, sm: 1.5 }}>
          <MIconButton
            ref={notificationRef}
            onClick={handleOpenNotifications}
            color={openNotifications ? 'primary' : 'default'}
            sx={{
              ...(openNotifications && {
                bgcolor: (theme: any) => alpha(theme.palette.primary.main, theme.palette.action.focusOpacity)
              })
            }}
          >
            <Badge badgeContent={notificationsCount} classes={{ badge: classes.customBadge }}>
              <NotificationsNoneIcon />
            </Badge>
          </MIconButton>
          {isActiveDesktop ? (
            <Dialog
              fullScreen
              open={openNotifications}
              onClose={handleCloseNotifications}
              TransitionComponent={Transition}
              className={classes.papperDialog}
            >
              <Box className={classes.headerNotifications}>
                <Box>
                  <IconButton onClick={handleCloseNotifications}>
                    <ArrowBackIcon />
                  </IconButton>
                </Box>
                <Box>Notificaciones</Box>
                <Box></Box>
              </Box>
              <NotificationsSection
                notificationsArray={notifications}
                readNotificationAction={readNotificationAction}
                isActiveDesktop={isActiveDesktop}
                handleCloseNotifications={handleCloseNotifications}
              />
            </Dialog>
          ) : (
            <MenuPopover
              open={openNotifications}
              onClose={handleCloseNotifications}
              anchorEl={notificationRef.current}
              sx={{ width: 400, backgroundColor: themes.palette.primary.lighter }}
            >
              <NotificationsSection
                notificationsArray={notifications}
                readNotificationAction={readNotificationAction}
                isActiveDesktop={isActiveDesktop}
                handleCloseNotifications={handleCloseNotifications}
              />
            </MenuPopover>
          )}
          {/*  */}
          <MIconButton
            ref={anchorRef}
            onClick={handleOpen}
            color={open ? 'primary' : 'default'}
            sx={{
              ...(open && {
                bgcolor: (theme: any) => alpha(theme.palette.primary.main, theme.palette.action.focusOpacity)
              })
            }}
          >
            <Icon icon={peopleFill} width={20} height={20} />
          </MIconButton>
          <MenuPopover open={open} onClose={handleClose} anchorEl={anchorRef.current} sx={{ width: 220 }}>
            <Box sx={{ my: 1.5, px: 2.5 }}>
              <Typography variant="subtitle1" noWrap>
                Usuario
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary' }} noWrap>
                {auth?.user?.payload.name} {auth?.user?.payload?.family_name}
              </Typography>
            </Box>

            <Box sx={{ p: 2, pt: 1.5 }}>
              <Button fullWidth color="inherit" variant="outlined" onClick={handleLogOut}>
                Cerrar sesión
              </Button>
            </Box>
          </MenuPopover>
        </Stack>
      </ToolbarStyle>
    </RootStyle>
  );
};

CustomHeader.defaultProps = {
  handleActiveDrawer: () => null
};

export default React.memo(CustomHeader);
