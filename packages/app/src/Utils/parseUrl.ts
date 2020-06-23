interface IParseUrlResponse {
  [param: string]: string;
}

export default function parseUrl(url: any): IParseUrlResponse {
  const regex = /[?&]([^=#]+)=([^&#]*)/g;
  let params = {};
  let match;

  while ((match = regex.exec(url))) {
    params[match[1]] = match[2];
  }

  return params;
}
