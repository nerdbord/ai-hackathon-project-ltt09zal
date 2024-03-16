import { useState, useEffect, useRef } from 'react';
import styles from './CapturePhoto.module.scss';
import Camera from '../icons/Camera';
import Image from 'next/image';
import ocr from '@/utils/ocr';

type PhotoData = string;

const CapturePhoto = (): JSX.Element => {
  const [photoData, setPhotoData] = useState<PhotoData>('');
  const [textData, setTextData] = useState<string>('');
  const [isCameraOpen, setIsCameraOpen] = useState<boolean>(false);
  const videoRef = useRef<HTMLVideoElement>(null);

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
    };
  }, [isCameraOpen]);

  const takePhoto = async (
    videoElement: HTMLVideoElement
  ): Promise<PhotoData> => {
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
    try {
      if (videoRef.current) {
        const imageData: PhotoData = await takePhoto(videoRef.current);
        setPhotoData(imageData);
      }
    } catch (error) {
      console.error('Error taking photo:', error);
    }
  };

  const analizePhoto = async (): Promise<void> => {
    const text = await ocr(photoData);
    setTextData(text);
    //gpt request
  };

  const handleToggleCamera = (): void => {
    setIsCameraOpen((prevState) => !prevState);
  };

  return (
    <div className={styles.container}>
      {isCameraOpen ? (
        <video className={styles.preview} ref={videoRef} autoPlay />
      ) : (
        <Camera />
      )}

      <div className={styles.buttonsContainer}>
        {isCameraOpen && (
          <button onClick={() => setIsCameraOpen(false)}>Zamknij aparat</button>
        )}

        <button onClick={isCameraOpen ? handleTakePhoto : handleToggleCamera}>
          {isCameraOpen ? 'Zrób zdjęcie' : 'Otwórz aparat'}
        </button>
      </div>

      {photoData && (
        <div className={styles.container}>
          <Image
            className={styles.preview}
            src={photoData}
            width={100}
            height={100}
            alt="Taken photo"
          />
          <button onClick={analizePhoto}>Analizuj</button>
          <code>{textData}</code>
        </div>
      )}
    </div>
  );
};

export default CapturePhoto;
