import React, { useState, useCallback, useEffect } from 'react';
import { Button, Icon, Typography, Grid, Box, Divider } from '@mui/material';
import useStyles from './AudioRecorder.css';
import clsx from 'clsx';

let mediaRecorder: any = null;
let audioFragments: any = [];

type AudioRecorderProps = {
  onSuccess?(audio: Blob): void;
  onError?(error: string): void;
  disabled?: boolean;
  inputSource?: any;
  time?: number; // value on seconds
  textTime?: string;
  buttonComplete?: boolean;
};

const AudioRecorder: React.FC<AudioRecorderProps> = (props: AudioRecorderProps) => {
  const classes = useStyles();
  const { onSuccess, onError, textTime, time, inputSource, disabled, buttonComplete } = props;
  const [isRecordingActive, setIsRecordingActive] = useState<boolean>(false);
  const [audioSRC, setAudioSRC] = useState<string | null>(null);
  const [idInterval, setIdInterval] = useState<any>(null);
  const [currentSeconds, setCurrentSeconds] = useState<number>(0);
  const [elapsedTime, setElapsedTime] = useState<string>('00:00:00');
  const permissionName = 'microphone' as PermissionName;

  const handleStopRecording = useCallback(() => {
    try {
      mediaRecorder.stop();
      mediaRecorder = null;
      clearInterval(idInterval);
    } catch (error) {}
  }, [idInterval]);

  const startCounting = useCallback(() => {
    const tiempoSegundos = Date.now();
    const auxIdInterval = setInterval(() => {
      setCurrentSeconds((Date.now() - tiempoSegundos) / 1000);
    }, 1000);
    setIdInterval(auxIdInterval);
  }, []);

  const verifyMicrophonePermission = async () => {
    const result = await navigator.permissions
      .query({ name: permissionName })
      .then((res: PermissionStatus) => {
        if (res.state === 'granted') {
          return true;
        }
        if (res.state === 'prompt') {
          return true;
        }
        if (res.state === 'denied') {
          return false;
        }
      })
      .catch(() => {
        return false;
      });
    return result;
  };

  const handleStartRecording = useCallback(() => {
    if (!verifyMicrophonePermission()) {
      onError && onError('Problemas al grabar, verifique que tenga un microfono disponible');
      return;
    }

    navigator.mediaDevices
      .getUserMedia({
        audio: true,
        video: false
      })
      .then((stream: any) => {
        audioFragments = [];
        // eslint-disable-next-line
        // @ts-ignore
        mediaRecorder = new MediaRecorder(stream);
        mediaRecorder.start();
        setIsRecordingActive(true);
        startCounting();
        mediaRecorder.addEventListener('dataavailable', (evento: any) => {
          // Add audio
          audioFragments.push(evento.data);
        });

        mediaRecorder.addEventListener('stop', () => {
          // Stop el stream
          stream.getTracks().forEach((track: any) => track.stop());

          // Convert audio
          const blobAudio = new Blob(audioFragments || [], { type: 'audio/ogg' });
          setAudioSRC(URL.createObjectURL(blobAudio));
          onSuccess && onSuccess(blobAudio);
        });
      })
      .catch(() => {
        onError && onError('Problemas al grabar, verifique que tenga un microfono disponible');
      });
  }, [onError, onSuccess, startCounting]);

  const handleReplayRecording = useCallback(() => {
    setElapsedTime('00:00:00');
    setCurrentSeconds(0);
    setAudioSRC(null);
    audioFragments = [];
    setIsRecordingActive(false);
  }, []);

  const convertToTime = useCallback(
    (segundos: number) => {
      let seconds = segundos;

      let hh: string = '';
      let mm: string = '';
      let ss: string = '';
      const h: number = Math.floor(seconds / 60 / 60);
      seconds -= h * 60 * 60;
      const m: number = Math.floor(seconds / 60);
      seconds -= m * 60;
      const s: number = Math.floor(seconds);
      hh = h < 10 ? '0' + h : String(h);
      mm = m < 10 ? '0' + m : String(m);
      ss = s < 10 ? '0' + s : String(s);
      setElapsedTime(`${hh}:${mm}:${ss}`);
      if (time && time + 1 <= segundos) {
        handleStopRecording();
      }
    },
    [handleStopRecording, time]
  );

  useEffect(() => {
    convertToTime(currentSeconds);
  }, [currentSeconds, convertToTime]);

  useEffect(() => {
    if (audioSRC === null) {
      inputSource && setAudioSRC(inputSource);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <Grid container spacing={1}>
        {!audioSRC && (
          <Grid
            item
            xs={12}
            sm={12}
            md={12}
            lg={12}
            xl={12}
            style={{ flexDirection: 'column', display: 'flex', alignItems: 'center' }}
          >
            <Icon
              fontSize="large"
              className={clsx(
                classes.microphone,
                !isRecordingActive && classes.microphoneDisabled,
                isRecordingActive && classes.microphoneEnabled
              )}
            >
              mic
            </Icon>

            <Typography>{elapsedTime}</Typography>
          </Grid>
        )}
        {!isRecordingActive && !audioSRC && (
          <Grid
            item
            xs={12}
            sm={12}
            md={12}
            lg={12}
            xl={12}
            className={buttonComplete ? classes.completeButton : classes.contentButton}
          >
            <Button
              disabled={disabled || false}
              className={clsx(classes.button, classes.buttonDefault)}
              variant="contained"
              size="large"
              startIcon={<Icon>fiber_manual_record_icon</Icon>}
              onClick={handleStartRecording}
            >
              <Typography>Comenzar a Grabar</Typography>
            </Button>
          </Grid>
        )}
        {isRecordingActive && !audioSRC && (
          <Grid
            item
            xs={12}
            sm={12}
            md={12}
            lg={12}
            xl={12}
            className={buttonComplete ? classes.completeButton : classes.contentButton}
          >
            <Button
              disabled={disabled || false}
              className={clsx(classes.button)}
              style={{ color: 'white' }}
              variant="contained"
              color="secondary"
              size="large"
              startIcon={<Icon>stop</Icon>}
              onClick={handleStopRecording}
            >
              Detener grabación
            </Button>
          </Grid>
        )}
        {!audioSRC && textTime && (
          <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
            <Divider style={{ border: '1px solid #96C262' }} />
            <Typography align="center" style={{ color: '#828282' }}>
              {textTime}
            </Typography>
          </Grid>
        )}
        {audioSRC && (
          <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
            <audio controls className={clsx(buttonComplete ? classes.audioComplete : classes.audio)}>
              <source src={audioSRC} type="audio/ogg" />
              El navegador no soporta audio.
            </audio>
            <Box width="100%" className={buttonComplete ? classes.completeButton : classes.contentButton}>
              <Button
                disabled={disabled || false}
                className={clsx(classes.button)}
                variant="contained"
                color="primary"
                size="large"
                startIcon={<Icon>replay</Icon>}
                onClick={handleReplayRecording}
              >
                Volver a grabar
              </Button>
            </Box>
          </Grid>
        )}
      </Grid>
    </>
  );
};

export default React.memo(AudioRecorder);
