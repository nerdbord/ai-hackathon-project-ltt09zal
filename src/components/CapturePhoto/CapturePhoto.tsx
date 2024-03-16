import { useState, useEffect, useRef } from 'react';
import styles from './CapturePhoto.module.scss';
import Camera from '../icons/Camera';
import Image from 'next/image';
import LoaderSpinner from '../LoaderSpinner/LoaderSpinner';
import ocr from '@/utils/ocr';

type Base64 = string;

interface Props {
  takePhoto: boolean;
  setPhotoReady: (value: boolean) => void;
  getText: boolean;
  setText: (value: string) => void;
  resetOcr: boolean;
  enableControls?: boolean;
}

const CapturePhoto: React.FC<Props> = ({
  takePhoto,
  setPhotoReady,
  getText,
  setText,
  resetOcr,
  enableControls = false,
}) => {
  const [isLoading, setLoading] = useState<boolean>(false);
  const [base64img, setBase64img] = useState<Base64>('');
  const [textData, setTextData] = useState<string>('');
  const [isCameraOpen, setIsCameraOpen] = useState<boolean>(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    isCameraOpen && handleTakePhoto();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [takePhoto]);

  useEffect(() => {
    base64img && analizePhoto();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getText]);

  useEffect(() => {
    setTextData('');
    setText(''); //parent reset
    setBase64img('');
    setPhotoReady(false); //parent reset
    setIsCameraOpen(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resetOcr]);

  useEffect(() => {
    let videoElement = videoRef.current;
    const initializeCamera = async () => {
      try {
        if (videoElement) {
          const mediaStream = await navigator.mediaDevices.getUserMedia({
            video: { facingMode: { ideal: 'environment' } },
            audio: false,
          });
          videoElement.srcObject = mediaStream;
          videoElement.play();
          setIsCameraOpen(true);
        }
      } catch (error) {
        console.error('Error accessing camera:', error);
      }
    };

    if (isCameraOpen) {
      initializeCamera();
    }

    return () => {
      if (videoElement) {
        const mediaStream = videoElement.srcObject as MediaStream;
        if (mediaStream) {
          mediaStream.getTracks().forEach((track) => track.stop());
        }
      }
      setPhotoReady(false);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isCameraOpen]);

  const takePhotoHandler = async (
    videoElement: HTMLVideoElement
  ): Promise<Base64> => {
    try {
      const canvasElement = document.createElement('canvas');
      const canvasContext = canvasElement.getContext('2d');

      canvasElement.width = videoElement.videoWidth;
      canvasElement.height = videoElement.videoHeight;

      canvasContext?.drawImage(
        videoElement,
        0,
        0,
        canvasElement.width,
        canvasElement.height
      );

      const imageData = canvasElement.toDataURL('image/png');
      return imageData;
    } catch (error) {
      throw error;
    }
  };

  const handleTakePhoto = async (): Promise<void> => {
    setIsCameraOpen(false);
    try {
      if (videoRef.current) {
        const imageData: Base64 = await takePhotoHandler(videoRef.current);
        setBase64img(imageData);
        setPhotoReady(true);
      }
    } catch (error) {
      console.error('Error taking photo:', error);
    }
  };

  const analizePhoto = async (): Promise<void> => {
    setLoading(true);
    try {
      const textOCR = await ocr(base64img);
      setText(textOCR);
      setTextData(textOCR); //displays inside component
    } catch (error) {
      console.error('Error fetching OCR results:', error);
    } finally {
      setLoading(false);
    }
    //gpt request
  };

  return (
    <div className={styles.container}>
      {base64img === '' ? (
        <>
          {/* View with open camera - ready to take a shot! */}
          {isCameraOpen ? (
            <div
              className={styles.container}
              style={{ cursor: 'pointer' }}
              onClick={handleTakePhoto}
            >
              <video className={styles.preview} ref={videoRef} autoPlay />
              <p>Kliknij aby zrobić zdjęcie.</p>
            </div>
          ) : (
            <div
              onClick={() => setIsCameraOpen(true)}
              style={{ cursor: 'pointer' }}
            >
              <Camera />
              <p>Kliknij aby uruchomić aparat.</p>
            </div>
          )}
        </>
      ) : (
        <div className={styles.container}>
          {/* Opens after taking Photo */}
          <div style={{ position: 'relative' }}>
            <Image
              className={styles.preview}
              src={base64img}
              width={100}
              height={100}
              alt="Taken photo"
              style={{ opacity: isLoading ? 0.7 : 1 }}
            />
            <LoaderSpinner show={isLoading} onImage />
          </div>

          {enableControls && (
            <div className={styles.buttonsContainer}>
              <button
                onClick={() => {
                  setIsCameraOpen(true);
                  setBase64img('');
                  setTextData('');
                }}
              >
                Zrób nowe
              </button>
              <button onClick={analizePhoto} disabled={isLoading}>
                Analizuj
              </button>
            </div>
          )}

          <code>{textData}</code>
        </div>
      )}
    </div>
  );
};

export default CapturePhoto;
