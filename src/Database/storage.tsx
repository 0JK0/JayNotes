import * as MediaLibrary from 'expo-media-library';
import * as FileSystem from 'expo-file-system';

const requestPermission = async () => {
  const { status } = await MediaLibrary.requestPermissionsAsync();
  if (status !== 'granted') {
    alert('Permission to access media library is required!');
  }
};

const saveMediaToExternalStorage = async (mediaUri, mediaType) => {
    const { status } = await MediaLibrary.requestPermissionsAsync();
    if (status !== 'granted') {
      alert('Permission to access media library is required!');
      return;
    }
  
    // Get a new path for the media file in external storage
    const fileName = mediaUri.split('/').pop();
    const externalPath = `${FileSystem.documentDirectory}Movies/${fileName}`;
  
    try {
      // Copy the file from the app's internal storage to external storage
      await FileSystem.copyAsync({
        from: mediaUri,
        to: externalPath,
      });
  
      // Add the media file to the media library
      let asset;
      if (mediaType === 'video') {
        asset = await MediaLibrary.createAssetAsync(externalPath);
      } else if (mediaType === 'audio') {
        asset = await MediaLibrary.createAssetAsync(externalPath);
      }
  
      // Optionally, you can create a collection or album
      const album = await MediaLibrary.getAlbumAsync('My App Media');
      if (!album) {
        await MediaLibrary.createAlbumAsync('My App Media', asset, false);
      } else {
        await MediaLibrary.addAssetsToAlbumAsync([asset], album.id, false);
      }
  
      console.log('File saved to external storage:', externalPath);
    } catch (error) {
      console.error('Error saving media to external storage:', error);
    }
  };
  
/*   import { Video } from 'expo-av';

<Video
  source={{ uri: externalPath }}  // Path to the video file in external storage
  useNativeControls
  resizeMode="contain"
  style={{ width: 320, height: 240 }}
/>
 */