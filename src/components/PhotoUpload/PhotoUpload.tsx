import React, { useState, useRef } from 'react';
import { supabase } from '../../db/supabaseClient';

const PhotoUpload = () => {
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [imageUrl, setImageUrl] = useState('');
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
  
      const { data } = supabase.storage
      
        .from('photos')
        .getPublicUrl(filePath);
        setImageUrl(data.publicUrl);
      const { error: insertError } = await supabase
        .from('photos')
        .insert([
          {
            url: data.publicUrl
          }
        ]);
  
      if (insertError) {
        throw insertError;
      }
  
      alert('Plik został przesłany i rekord został dodany do bazy danych!');
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
      <button onClick={triggerCamera} disabled={uploading}>
        {uploading ? 'Przesyłanie...' : 'Zrób zdjęcie'}
      </button>
      {imageUrl && <img src={imageUrl} alt="Uploaded" />}
    </div>
  );
};

export default PhotoUpload;
