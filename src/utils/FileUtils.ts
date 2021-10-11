async function remoteFileDownload(blob: Blob, fileName?: string) {
  const name = fileName || new Date().getTime().toString();
  // @ts-ignore
  if (window.navigator.msSaveOrOpenBlob) {
    // 兼容IE10
    // @ts-ignore
    navigator.msSaveBlob(blob, fileName);
  } else {
    const href = URL.createObjectURL(blob); // 创建新的URL表示指定的blob对象
    const a = document.createElement('a'); // 创建a标签
    a.style.display = 'none';
    a.href = href; // 指定下载链接
    a.download = name; // 指定下载文件名
    a.click(); // 触发下载
    URL.revokeObjectURL(a.href); // 释放URL对象
  }
}

async function getBase64(blob: Blob) {
  return new Promise<string | ArrayBuffer | null>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = (e) => reject(e);
    reader.readAsDataURL(blob);
  });
}

export default { remoteFileDownload, getBase64 };
