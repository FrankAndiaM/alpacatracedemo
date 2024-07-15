import React, { useCallback, useEffect, useState } from 'react';
import { Box, CircularProgress, Icon } from '@mui/material';
// import { capitalize } from '~utils/Word';
import { es } from 'date-fns/locale';
// import { format } from 'date-fns';
// import { formatToTimeZone } from 'date-fns-timezone';
import { makeStyles } from '@mui/styles';
import { useNavigate } from 'react-router-dom';
import routes from '~routes/routes';
import { formatDistanceToNowStrict } from 'date-fns';
import { useTheme } from '@mui/material';
// import { Icon as Iconify } from '@iconify/react';

const useStyles: any = makeStyles(() => ({
  boxIcon: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: '40px',
    height: '40px',
    backgroundColor: '#FFFFFF',
    borderRadius: '50%'
  },
  detail: {
    margin: '8px',
    fontSize: '14px',
    color: '#000000'
  },
  boxNotification: {
    display: 'flex',
    alignItems: 'center',
    padding: '16px',
    '&:hover': {
      cursor: 'pointer'
    }
  },
  scrollBarClass: {
    overflow: 'auto',
    '&::-webkit-scrollbar': {
      width: '8px'
    },
    /* Track */
    '&::-webkit-scrollbar-track': {
      background: '#ffffff'
    },

    /* Handle */
    '&::-webkit-scrollbar-thumb': {
      background: '#D9D9D9',
      borderRadius: '13px'
    },

    /* Handle on hover */
    '&::-webkit-scrollbar-thumb:hover': {
      background: '#888'
    }
  }
}));

const icons: any = {
  tele_assistances: 'message',
  forms: 'assignment_outlined',
  tokens: 'payment',
  producers: 'people_alt_outlined',
  default: 'message'
};

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

type NotificationsSectionProps = {
  notificationsArray: Notification[];
  readNotificationAction: (id: string) => void;
  isActiveDesktop: boolean;
  handleCloseNotifications: () => void;
};

const NotificationsSection: React.FC<NotificationsSectionProps> = (props: NotificationsSectionProps) => {
  const classes = useStyles();
  const history = useNavigate();
  const theme = useTheme();
  const { notificationsArray, readNotificationAction, isActiveDesktop, handleCloseNotifications } = props;
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const goToService = useCallback(
    (service: string, service_id?: string) => {
      switch (service) {
        case 'forms':
        case 'forms-Producers':
          history(`${routes.organizationForm}/${service_id}/data?data_type=data`);
          break;
        case 'forms-FREE':
          history(`${routes.organizationForm}/${service_id}/data?entry_entity_type=FREE`);
          break;
        case 'producers':
          if (service_id) {
            history(`${routes.farmers}/${service_id}`);
          } else {
            history(`${routes.farmers}`);
          }
          break;
        default:
          break;
      }
      if (!isActiveDesktop) handleCloseNotifications();
    },
    [handleCloseNotifications, history, isActiveDesktop]
  );

  const readNotification = useCallback(
    (notification: Notification, isRead: boolean) => {
      if (!isRead) {
        readNotificationAction(notification.id);
      }
      goToService(notification.service ?? '', notification.service_id ?? '');
    },
    [goToService, readNotificationAction]
  );

  useEffect(() => {
    setNotifications(notificationsArray);
    setIsLoading(false);
  }, [notificationsArray]);

  return (
    <Box
      className={isActiveDesktop ? '' : classes.scrollBarClass}
      style={{
        backgroundColor: theme.palette.primary.lighter,
        maxHeight: isActiveDesktop ? 'none' : '500px',
        overflow: 'auto'
      }}
    >
      {isLoading ? (
        <>
          <Box display={'flex'} justifyContent="center" alignItems={'center'} height={'10vh'}>
            <CircularProgress />
          </Box>
        </>
      ) : (
        <>
          {notifications.length > 0 &&
            notifications.map((element: Notification) => {
              // const isRead = readNotifications.includes(element.id);
              const isRead = element.has_seen ?? false;
              return (
                <Box
                  key={`${element.id}`}
                  onClick={() => readNotification(element, isRead)}
                  className={classes.boxNotification}
                  style={
                    isRead
                      ? {
                          backgroundColor: '#FFFFFF'
                        }
                      : {}
                  }
                >
                  <Box m={1}>
                    <Box className={classes.boxIcon}>
                      <Icon color="primary" sx={{ '& svg': { fontSize: '18px' } }}>
                        {icons[element.service || 'default'] ?? 'message'}
                      </Icon>
                    </Box>
                  </Box>
                  <Box className={classes.detail}>
                    <Box>{element.description}</Box>
                    <Box fontSize={'12px'}>
                      {/* {capitalize(format(new Date(element.created_at), 'EEE dd MMM', { locale: es }))}, */}
                      {/* {formatToTimeZone(new Date(element.created_at ?? ''), 'hh:mm aa', {
                        timeZone: 'America/Lima'
                      })} */}

                      {formatDistanceToNowStrict(new Date(element?.created_at ?? '01/01/2020'), {
                        addSuffix: true,
                        locale: es
                      })}
                    </Box>
                  </Box>
                </Box>
              );
            })}

          {notifications.length <= 0 && (
            <Box className={classes.detail} p={3}>
              <Box>Sin notificaciones pendientes</Box>
            </Box>
          )}
        </>
      )}
    </Box>
  );
};

export default NotificationsSection;
