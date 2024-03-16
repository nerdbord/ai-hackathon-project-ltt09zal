import { useState, useEffect, useRef } from 'react';
import styles from './CapturePhoto.module.scss';
import Camera from '../icons/Camera';
import Image from 'next/image';
import { createWorker } from 'tesseract.js';
import LoaderSpinner from '../LoaderSpinner/LoaderSpinner';

type Base64 = string;

const CapturePhoto = (): JSX.Element => {
  const [isLoading, setLoading] = useState<boolean>(false);
  const [base64img, setBase64img] = useState<Base64>('');
  const [testbase64img, setTestBase64img] = useState<Base64>('');
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

  const takePhoto = async (videoElement: HTMLVideoElement): Promise<Base64> => {
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
        const imageData: Base64 = await takePhoto(videoRef.current);
        setBase64img(imageData);
      }
    } catch (error) {
      console.error('Error taking photo:', error);
    }
  };

  const analizePhoto = async (): Promise<void> => {
    setLoading(true);
    try {
      // Preprocess image
      const response = await fetch('/api/process-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          base64Image: base64img.replace('data:image/png;base64,', ''),
        }),
      });

      if (!response.ok) {
        throw new Error(`API request failed with status: ${response.status}`);
      }
      const data = await response.json();

      // Recognize text using Tesseract OCR
      const worker = await createWorker();
      await worker.setParameters({
        tessedit_char_whitelist:
          '0123456789aąbcćdeęfghijklłmnńoóprsśtuwvyzźżAĄBCĆDEĘFGHIJKLŁMNŃOÓPRSSTUWVYZŹŻ -:,.?!/',
      });
      const {
        data: { text },
      } = await worker.recognize(data.img);
      await worker.terminate();

      setTextData(text);
      setTestBase64img(data.img);
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
          {/* Remove false to show processed image as iamge base for OCR */}
          {false && testbase64img && (
            <Image
              className={styles.preview}
              src={testbase64img}
              width={100}
              height={100}
              alt="Taken photo"
            />
          )}
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
          <code>{textData}</code>
        </div>
      )}
    </div>
  );
};

export default CapturePhoto;
