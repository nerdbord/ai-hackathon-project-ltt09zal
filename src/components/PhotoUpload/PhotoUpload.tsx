import React, { useState, useRef } from 'react';
import { supabase } from '../../db/supabaseClient';
import Button from '../Button/Button';
import { useStore } from '@/store/useStore';

type Props = {
  onClick?: () => void;
};

const PhotoUpload = ({ onClick }: Props) => {
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { setImageUrl, textOcr, setOpen } = useStore();
  const triggerCamera = () => {
    fileInputRef.current?.click();
  };

  const uploadPhoto = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true);
      const files = event.target.files;
      if (!files || files.length === 0) {
        throw new Error('Nie wykryto pliku.');
      }

      const file = files[0];
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${fileName}`;

      let { error: uploadError } = await supabase.storage
        .from('photos')
        .upload(filePath, file);

      if (uploadError) {
        throw uploadError;
      }

      const { data } = supabase.storage.from('photos').getPublicUrl(filePath);
      console.log('Public URL:', data.publicUrl);
      setImageUrl(data.publicUrl);
      setOpen(true);
      const { error: insertError } = await supabase.from('photos').insert([
        {
          url: data.publicUrl,
        },
      ]);

      if (insertError) {
        throw insertError;
      }
    } catch (error) {
      if (error instanceof Error) {
        alert(error.message);
      } else {
        console.error('Wystąpił nieoczekiwany błąd:', error);
      }
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={uploadPhoto}
        disabled={uploading}
        style={{ display: 'none' }}
      />
      <Button
        text={uploading ? 'PRZESYŁANIE...' : 'ZRÓB ZDJĘCIE'}
        onClick={triggerCamera}
        disabled={uploading}
      />
    </div>
  );
};

export default PhotoUpload;
