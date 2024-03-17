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

  const {
    initCamera,
    startOcr,
    textOcr,
    setTextOcr,
    currApiKey,
    setCurrApiKey,
  } = useStore();

  useEffect(() => {
    if (initCamera) {
      setIsCameraOpen(true);
    } else {
      setTextOcr('');
      setBase64img('');
      closeCamera();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initCamera]);

  useEffect(() => {
    isCameraOpen && initializeCamera();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isCameraOpen]);

  useEffect(() => {
    if (initCamera && !videoRef.current) {
      setTextOcr('');
      setBase64img('');
      setIsCameraOpen(true);
      initializeCamera();
    } else {
      handleTakePhoto();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [startOcr]);

  useEffect(() => {
    base64img !== '' && textOcr === '' && analizePhoto();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [base64img]);

  async function initializeCamera() {
    let videoElement = videoRef.current;
    try {
      if (videoElement) {
        // Clear video if existing
        const mediaStreamRef = videoElement.srcObject as MediaStream;
        if (mediaStreamRef) {
          mediaStreamRef.getTracks().forEach((track) => track.stop());
        }
        const mediaStream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: { ideal: 'environment' } },
          audio: false,
        });
        videoElement.srcObject = mediaStream;
        videoElement.play();
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
    }
  }

  function closeCamera() {
    if (videoRef.current) {
      const mediaStream = videoRef.current.srcObject as MediaStream;
      if (mediaStream) {
        mediaStream.getTracks().forEach((track) => track.stop());
        setIsCameraOpen(false);
      }
    }
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
    try {
      if (videoRef.current) {
        const imageData: Base64 = await takePhotoHandler(videoRef.current);
        imageData.length > 20 && setBase64img(imageData);
      }
    } catch (error) {
      console.error('Error taking photo:', error);
    }
    closeCamera();
  }

  const analizePhoto = async (): Promise<void> => {
    setLoading(true);
    if (base64img !== 'data:,') {
      try {
        const { ocrText, usedApiKeyNo } = await ocr(base64img, currApiKey);
        console.log(ocrText);
        // Set the ocr text into zustand store
        setTextOcr(ocrText);

        // Update last used API key index
        if (currApiKey !== usedApiKeyNo) {
          setCurrApiKey(usedApiKeyNo);
        }
      } catch (error) {
        console.error('Error fetching OCR results:', error);
      }
    } else {
      setBase64img('');
    }
    setLoading(false);
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
              <video className={styles.preview} ref={videoRef} autoPlay/>
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
        </div>
      )}
    </div>
  );
};

export default CapturePhoto;
