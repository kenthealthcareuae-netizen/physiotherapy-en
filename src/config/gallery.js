// Gallery Configuration
// Clean gallery with no text details - just images and videos

export const galleryConfig = {
  items: [
    {
      id: 1,
      type: 'image',
      src: 'https://res.cloudinary.com/du2afeuwp/image/upload/v1760219139/DSC05032_oh0ekm.webp'
    },
    {
      id: 2,
      type: 'image',
      src: 'https://res.cloudinary.com/du2afeuwp/image/upload/v1760219139/1_irksdj.webp'
    },
    {
      id: 3,
      type: 'image',
      src: 'https://res.cloudinary.com/du2afeuwp/image/upload/v1760219138/DSC00936_nedfof.webp'
    },
    {
      id: 4,
      type: 'image',
      src: 'https://res.cloudinary.com/du2afeuwp/image/upload/v1760219138/12Kent_Facility_Photos_zlmc1c.webp'
    },
    {
      id: 5,
      type: 'video',
      src: 'https://res.cloudinary.com/du2afeuwp/video/upload/v1760220063/Expo_High_V4_omoni3.webm',
      thumbnail: 'https://res.cloudinary.com/du2afeuwp/image/upload/v1760220230/thumbnail_1_1.5s_tnkitf.webp'
    }
  ]
};

// Instructions for adding your Cloudinary links:
// 1. Replace the placeholder URLs above with your actual Cloudinary links
// 2. For videos: provide both the video URL and a thumbnail image URL
// 3. For images: just provide the image URL
// 4. You can add more items by copying the structure above
// 5. Make sure to update the id numbers if you add more items
