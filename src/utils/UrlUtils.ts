const resolveImage = (url: string) => {
  if (url && !url.startsWith('http')) {
    return `https://hccake-img.oss-cn-shanghai.aliyuncs.com/${url}`;
  }
  return url;
};

const resolveVideo = (url: string) => url;

const resolveAudio = (url: string) => url;

const UrlUtils = { resolveImage, resolveVideo, resolveAudio };
export default UrlUtils;
