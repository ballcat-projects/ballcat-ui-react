declare namespace CAPTCHA {
  type GetParams = {
    // 块填充 | 点击文字
    captchaType: 'blockPuzzle' | 'clickWord';
  };

  type ValidParams = {
    // 块填充 | 点击文字
    captchaType: 'blockPuzzle' | 'clickWord';
    pointJson: string;
    token: string;
  };

  type Info = {
    repCode: string;
    repMsg: string;
    success: boolean;
    repData: {
      browserInfo: string;
      captchaFontSize: any;
      captchaFontType: string;
      captchaId: string;
      captchaOriginalPath: string;
      captchaType: string;
      captchaVerification: string;
      clientUid: string;
      jigsawImageBase64: string;
      originalImageBase64: string;
      point: any;
      pointJson: string;
      pointList: any[];
      projectCode: string;
      result: boolean;
      secretKey: string;
      token: string;
      ts: any;
      wordList: any[];
    };
  };

  type ValidRes = {
    repCode: string;
    repData: any;
    repMsg: string;
    success: boolean;
  };
}
