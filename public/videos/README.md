# Videos Directory

This directory is for storing crop and farming related videos to be used in the CropVideoBackground component.

## How to Add Your Videos:

1. **Place your video files** in this directory (e.g., `crop-fields.mp4`, `farming-timelapse.mp4`, etc.)

2. **Update the video src** in `components/ui/crop-video-background.tsx`:
   ```tsx
   <video
     ref={videoRef}
     className="absolute inset-0 w-full h-full object-cover"
     autoPlay
     muted
     loop
     playsInline
     onClick={handleVideoClick}
     src="/videos/your-video-file.mp4"  // <-- UPDATE THIS LINE
   >
   ```

## Recommended Video Content:

- **Crop field timelapses**
- **Farming equipment in action**
- **Harvesting scenes**
- **Agricultural landscapes**
- **Crop growth videos**
- **Trading operations**

## Video Specifications:

- **Format**: MP4 (recommended)
- **Resolution**: 1920x1080 or higher
- **Duration**: 10-30 seconds (looped)
- **File size**: Optimized for web (under 10MB recommended)

## Current Status:

✅ Videos directory created
✅ CropVideoBackground component ready
✅ Placeholder interface active

Replace the placeholder with your actual crop/farming videos for the best visual impact!
