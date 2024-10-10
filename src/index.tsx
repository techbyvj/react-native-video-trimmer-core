import Utils from './utils';

class VideoTrimmer {
  private utils: Utils;

  constructor(dir?: string | undefined) {
    this.utils = new Utils(dir);
  }

  trimVideo = async (path: string, start: number, stop: number) => {
    return this.utils.trimVideo(path, start, stop);
  };

  deleteTempFile = async (path: string) => {
    return this.utils.deleteTempFile(path);
  };
}

export default VideoTrimmer;
