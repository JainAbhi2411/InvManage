// src/api/uploadImage.js
export const uploadImageToCloudinary = async (file) => {
  const data = new FormData();
  data.append('file', file);
  data.append('upload_preset', process.env.REACT_APP_CLOUDINARY_UPLOAD_PRESET); // 🔁 replace with your preset
  data.append('cloud_name', process.env.REACT_APP_CLOUDINARY_CLOUD_NAME);           // 🔁 replace with your Cloudinary name

  const res = await fetch(`https://api.cloudinary.com/v1_1/${process.env.REACT_APP_CLOUDINARY_CLOUD_NAME}/image/upload`, {
    method: 'POST',
    body: data,
  });

  if (!res.ok) throw new Error('Image upload failed');

  const result = await res.json();
  return result.secure_url;
};
