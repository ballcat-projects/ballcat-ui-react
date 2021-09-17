function resolve(url: string) {
  if (url && !url.startsWith('http')) {
    return `https://hccake-img.oss-cn-shanghai.aliyuncs.com/${url}`;
  }
  return url;
}

export default { resolve };
