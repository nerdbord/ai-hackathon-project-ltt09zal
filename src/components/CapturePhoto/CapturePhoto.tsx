import { useState, useEffect, useRef } from 'react';
import styles from './CapturePhoto.module.scss';
import Camera from '../icons/Camera';
import Image from 'next/image';
import LoaderSpinner from '../LoaderSpinner/LoaderSpinner';
import ocr from '@/utils/ocr';
import { useStore } from '@/store/useStore';

type Base64 = string;

interface Props {
  enableControls?: boolean;
}

const CapturePhoto: React.FC<Props> = ({ enableControls = false }) => {
  const [isLoading, setLoading] = useState<boolean>(false);
  const [base64img, setBase64img] = useState<Base64>('');
  const [isCameraOpen, setIsCameraOpen] = useState<boolean>(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const { initCamera, startOcr, textOcr, setTextOcr } = useStore();

  useEffect(() => {
    if (!isCameraOpen && initCamera) {
      setIsCameraOpen(true);
    } else if (isCameraOpen && !initCamera) {
      // setTextOcr('');
      // setBase64img('');
      setIsCameraOpen(false);
      closeCamera();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initCamera]);

  useEffect(() => {
    if (!isCameraOpen && initCamera) {
      setTextOcr('');
      setBase64img('');
      setIsCameraOpen(true);
    }

    if (isCameraOpen) {
      handleTakePhoto();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [startOcr]);

  useEffect(() => {
    base64img !== '' && textOcr === '' && analizePhoto();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [base64img]);

  useEffect(() => {
    let videoElement = videoRef.current;
    async function initializeCamera() {
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
    }

    if (isCameraOpen) {
      initializeCamera();
      setTextOcr('');
      setBase64img('');
    }

    return () => {
      closeCamera();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isCameraOpen]);

  function closeCamera() {
    if (videoRef.current) {
      const mediaStream = videoRef.current.srcObject as MediaStream;
      if (mediaStream) {
        mediaStream.getTracks().forEach((track) => track.stop());
      }
    }
  }

  if (!initCamera) {
    closeCamera();
    return null;
  }

  async function takePhotoHandler(
    videoElement: HTMLVideoElement
  ): Promise<Base64> {
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
  }

  async function handleTakePhoto(): Promise<void> {
    setIsCameraOpen(false);
    closeCamera();
    try {
      if (videoRef.current) {
        const imageData: Base64 = await takePhotoHandler(videoRef.current);
        setBase64img(imageData);
      }
    } catch (error) {
      console.error('Error taking photo:', error);
    }
  }

  const analizePhoto = async (): Promise<void> => {
    setLoading(true);
    try {
      const textOCR = await ocr(base64img);
      setTextOcr(textOCR);
    } catch (error) {
      console.error('Error fetching OCR results:', error);
    } finally {
      setLoading(false);
    }
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
              // onClick={handleTakePhoto}
            >
              <video className={styles.preview} ref={videoRef} autoPlay />
              {/* <p>Kliknij aby zrobić zdjęcie.</p> */}
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
                  setTextOcr('');
                }}
              >
                Zrób nowe
              </button>
              <button onClick={analizePhoto} disabled={isLoading}>
                Analizuj
              </button>
            </div>
          )}

          <code>{textOcr}</code>
        </div>
      )}
    </div>
  );
};

export default CapturePhoto;
