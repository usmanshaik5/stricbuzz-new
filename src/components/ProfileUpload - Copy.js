import React, { useRef, useState } from 'react';
import { IconButton, Typography } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

const ProfileUpload = ({ label, storageKey }) => {
  const [image, setImage] = useState(() => localStorage.getItem(storageKey) || null);
  const inputRef = useRef(null);

  const handleUploadClick = () => {
    inputRef.current?.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setImage(reader.result);
        localStorage.setItem(storageKey, reader.result); // Use unique key
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemove = (e) => {
    e.stopPropagation();
    setImage(null);
    localStorage.removeItem(storageKey); // Remove specific key
    if (inputRef.current) {
      inputRef.current.value = null;
    }
  };

  return (
<div
  style={{
    marginLeft: '30px',
    position: 'relative',
    width: '140px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginBottom:'92px'
  }}
>

      {image && (
        <IconButton
          onClick={handleRemove}
          size="small"
          style={{
            position: 'absolute',
            top: '-10px',
            right: '1px',
            backgroundColor: '#ffe6e6',
            zIndex: 1,
          }}
          aria-label="Remove profile"
        >
          <CloseIcon fontSize="small" />
        </IconButton>
      )}

  <div
  style={{
    width: '100px',
    height: '100px',
    borderRadius: '50%',
    border: image ? '2px solid black' : 'none', // Conditional border
    overflow: 'hidden',
    backgroundColor: 'white',
    position: 'relative',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: '-30px',
  }}
  onClick={handleUploadClick}
>

        {image ? (
          <img
            src={image}
            alt="Profile"
            style={{ width: '130%', height: '130%', objectFit: 'cover' }}
          />
        ) : (
          <Typography
            variant="caption"
            color="textSecondary"
            style={{ textAlign: 'center', fontSize:'14px' }}
          >
            Upload
          </Typography>
        )}
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          style={{ display: 'none' }}
        />
      </div>

      <Typography
        variant="body2"
        style={{ marginTop: '6px', fontWeight: 'bold' }}
      >
        {label}
      </Typography>
    </div>
  );
};

export default ProfileUpload;
