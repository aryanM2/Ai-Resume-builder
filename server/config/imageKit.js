import ImageKit from '@imagekit/nodejs';

let imagekit = null;

const getImageKit = () => {
  if (!imagekit) {
    imagekit = new ImageKit({
      privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
    });
  }
  return imagekit;
};

export default getImageKit;