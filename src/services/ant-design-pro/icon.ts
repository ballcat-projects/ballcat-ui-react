export async function getIconFile(url: string) {
  let reqUrl = url;
  if (!reqUrl.startsWith('http')) {
    reqUrl = `https:${url}`;
  }
  return fetch(reqUrl, { method: 'GET' }).then((res) => res.text());
}
