# react-native-video-trimmer-core

Trim videos between specified start and end times using ffmpeg-kit-react-native

This library provides a simple and efficient way to trim video files in React Native applications. It utilizes the powerful FFmpeg library through the [ffmpeg-kit-react-native](https://www.npmjs.com/package/ffmpeg-kit-react-native) package to perform video trimming operations. With this core functionality, you can easily integrate video trimming capabilities into your React Native projects, allowing users to select specific portions of a video for further use or processing.

## Demo

![Video Trimmer UI Demo](https://github.com/techbyvj/public-assets/blob/main/react-native-video-trimmer-core-demo.gif)

Key features:
- Precise trimming: Set exact start and end times for video clips
- Fast processing: Leverages FFmpeg's efficient video manipulation capabilities
- Cross-platform: Works on both iOS and Android
- Flexible output: Trimmed videos are saved as new files, preserving the original
- Error handling: Robust error management for a smooth user experience

Whether you're building a video editing app, a social media platform with video sharing, or any application that requires video manipulation, this core library simplifies the process of implementing video trimming functionality.

## Features

- Trim videos using FFmpeg
- Supports React Native projects (Expo and bare)
- Easy to integrate and use

## Installation

```sh
npm install react-native-video-trimmer-core
```

## Dependencies

This library depends on the following packages:

- `ffmpeg-kit-react-native`: ^6.0.2
- `react-native-fs`: ^2.20.0


```sh
npm install ffmpeg-kit-react-native react-native-fs react-native-video-trimmer-core
```

Make sure to install these dependencies in your project.

## Usage

```javascript
import VideoTrimmer from 'react-native-video-trimmer-core';

// Create an instance of VideoTrimmer
const trimmer = new VideoTrimmer();

// Trim a video
const trimVideo = async (videoPath, startTime, endTime) => {
  try {
    const trimmedVideoPath = await trimmer.trimVideo(videoPath, startTime, endTime);
    console.log('Trimmed video path:', trimmedVideoPath);
  } catch (error) {
    console.error('Error trimming video:', error);
  }
};

// Delete a temporary file
const deleteTempFile = async (filePath) => {
  try {
    await trimmer.deleteTempFile(filePath);
    console.log('Temporary file deleted successfully');
  } catch (error) {
    console.error('Error deleting temporary file:', error);
  }
};
```

## API

### `VideoTrimmer`

#### Constructor

```javascript
const trimmer = new VideoTrimmer(dir?: string);
```

- `dir` (optional): Custom directory for temporary files. If not provided, it uses the default cache directory.

#### Methods

##### `trimVideo(path: string, start: number, stop: number): Promise<string>`

Trims the video at the specified path from the start time to the stop time.

- `path`: Path to the input video file.
- `start`: Start time in seconds.
- `stop`: End time in seconds.

Returns a promise that resolves with the path of the trimmed video.

##### `deleteTempFile(path: string): Promise<void>`

Deletes a temporary file at the specified path.

- `path`: Path to the temporary file to be deleted.

Returns a promise that resolves when the file is successfully deleted.

## Complete Example with react-native-ui-trimmer

Here's a complete example of how to use `react-native-video-trimmer-core` along with `react-native-video-trimmer-ui` Check (https://www.npmjs.com/package/react-native-video-trimmer-ui):

```typescript
import { useState, useEffect, useRef } from 'react';
import { View, Button, StyleSheet, Text } from 'react-native';
import VideoTrimmer, {
  type VideoTrimmerRef,
} from 'react-native-video-trimmer-ui';
import VideoTrimmerCore from 'react-native-video-trimmer-core';
import RNFS from 'react-native-fs';

const trimmer = new VideoTrimmerCore();

export default function App() {
  const [uri, setUri] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [trimmedUri, setTrimmedUri] = useState<string | null>(null);
  const trimmerRef = useRef<VideoTrimmerRef>(null);

  useEffect(() => {
    const filePath = RNFS.DocumentDirectoryPath + '/sample.mp4';
    RNFS.exists(filePath).then((exists) => {
      if (exists) {
        console.info('file exists');
        setUri(filePath);
        return;
      }
      RNFS.downloadFile({
        fromUrl:
          'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
        toFile: filePath,
      })
        .promise.then(() => {
          console.info('file downloaded');
          setUri(filePath);
        })
        .catch((err) => {
          console.error(err);
          setError(err.message);
        });
    });
    return () => {
      if (trimmedUri) {
        trimmer.deleteTempFile(trimmedUri).catch((err) => {
          console.warn('Error deleting temp file:', err);
        });
      }
    };
  }, [trimmedUri]);

  const onSelected = (start: number, end: number) => {
    console.info('start, end', start, end);
  };

  const trimVideo = () => {
    if (!trimmerRef.current) return;
    const [start, end] = trimmerRef.current.getSelection();
    if (uri) {
      trimmer.trimVideo(uri, start, end).then((path) => {
        console.info('trimmed url path', path);
        setTrimmedUri(path);
      });
    }
  };

  return (
    <View style={styles.container}>
      {trimmedUri ? <Text>Trimmed url: {trimmedUri}</Text> : null}
      {uri ? (
        <>
          <VideoTrimmer
            ref={trimmerRef}
            source={{ uri }}
            onSelected={onSelected}
          />
          <View style={styles.buttonContainer}>
            <Button onPress={trimVideo} title="Trim" />
          </View>
        </>
      ) : (
        <View style={styles.downloadContainer}>
          <Text style={styles.downloadText}>
            {error ? 'Error downloading: ' + error : 'Downloading...'}
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: 50,
    backgroundColor: 'black',
  },
  downloadContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  downloadText: {
    color: 'white',
    fontSize: 32,
    fontWeight: 'bold',
  },
  buttonContainer: {
    alignSelf: 'center',
    width: '30%',
  },
});
```

This example demonstrates:
- Loading a sample video
- Using the `VideoTrimmer` component from `react-native-video-trimmer-ui`
- Trimming the video using `react-native-video-trimmer-core`
- Displaying the trimmed video URL
- Basic error handling and loading states


## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.