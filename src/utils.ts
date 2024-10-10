import {
  FFmpegKit,
  FFmpegKitConfig,
  Level,
  ReturnCode,
} from 'ffmpeg-kit-react-native';
import RNFS from 'react-native-fs';

class Utils {
  private tempFolder: string;

  constructor(dir: string | undefined) {
    this.tempFolder = `${RNFS.CachesDirectoryPath}/temp-videos`;
    if (dir) {
      this.tempFolder = dir;
    }
  }

  deleteTempFile = async (path: string) => {
    if (await RNFS.exists(path)) {
      return RNFS.unlink(path).catch((error) =>
        console.info('error deleting temp file', error)
      );
    }
  };

  trimVideo = async (path: string, start: number, stop: number) => {
    try {
      let oldUri = `file://${path}`;
      console.info('original path', oldUri);
      await this.deleteTempFile(`${this.tempFolder}/temp.mp4`);
      await RNFS.mkdir(this.tempFolder);
      await RNFS.copyFile(oldUri, `${this.tempFolder}/temp.mp4`);
      oldUri = `${this.tempFolder}/temp.mp4`;
      const outputPath = `${this.tempFolder}/trimmed-${new Date().getTime()}.mp4`;

      const formatTime = (time: number) => {
        const pad = (num: number, size = 2) =>
          num.toString().padStart(size, '0');
        const hours = Math.floor(time / 3600);
        const minutes = Math.floor((time % 3600) / 60);
        const seconds = Math.floor(time % 60);
        const milliseconds = Math.floor((time % 1) * 1000);
        return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}.${pad(milliseconds, 3)}`;
      };

      const formattedStart = formatTime(start);
      const formattedDuration = formatTime(stop - start);

      const command = `-ss ${formattedStart} -i ${oldUri} -t ${formattedDuration} -c copy ${outputPath} -y`;
      FFmpegKitConfig.setLogLevel(Level.AV_LOG_ERROR);
      const session = await FFmpegKit.execute(command);
      const returnCode = await session.getReturnCode();

      if (ReturnCode.isSuccess(returnCode)) {
        console.log('Video trimmed successfully');
        return outputPath;
      }
      console.warn('Error trimming video:', await session.getOutput());
      return null;
    } catch (error) {
      console.warn('Error in trimVideo:', error);
      return null;
    }
  };
}

export default Utils;
