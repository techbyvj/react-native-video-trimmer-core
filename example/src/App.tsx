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
          'https://github.com/techbyvj/public-assets/raw/refs/heads/main/sample.mp4',
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
      {trimmedUri ? (
        <Text style={{ color: 'white', backgroundColor: 'black' }}>
          Trimmed url: {trimmedUri.split('/').pop()}
        </Text>
      ) : null}
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
