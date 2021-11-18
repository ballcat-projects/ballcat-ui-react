export interface CaptchaProps {
  isSlideShow: boolean;
  close: () => void;
  success: (captchaVerification: string) => void;
}

export interface CaptchaState {
  mode: string;
  vSpace: number;
  imgSize: {
    width: number;
    height: number;
  };
  barSize: {
    width: number;
    height: number;
  };
  blockSize: {
    width: number;
    height: number;
  };
  setSize: {
    imgHeight: number;
    imgWidth: number;
    barHeight: number;
    barWidth: number;
  };
  // 验证码背景图片
  backImgBase: string;
  // 验证滑块的背景图片
  blockBackImgBase: string;
  // 后端返回的唯一token值
  backToken: string;
  // 移动开始的时间
  startMoveTime: number;
  // 移动结束的时间
  endMoveTime: number;
  // 提示词的背景颜色
  tipsBackColor: string;
  // 后端返回的加密秘钥 字段
  secretKey: string;
  captchaType: 'blockPuzzle' | 'clickWord';
  moveBlockBackgroundColor: string;
  leftBarBorderColor: string;
  iconColor: string;
  barAreaLeft: number;
  barAreaOffsetWidth: number;
  startLeft: number;
  moveBlockLeft: any;
  leftBarWidth: any;
  // 鼠标状态
  status: boolean;
  // 是够验证完成
  isEnd: boolean;
  passFlag: boolean;
  tipWords: string;
  text: string;
  finishText: string;
  transitionWidth?: string;
  transitionLeft?: string;
  iconClass: string;
  move: (e: any) => void;
  end: () => void;
}

export const captchaStateInit: CaptchaState = {
  mode: 'fixed',
  vSpace: 5,
  imgSize: {
    width: 330,
    height: 155,
  },
  barSize: {
    width: 310,
    height: 40,
  },
  blockSize: {
    width: 50,
    height: 50,
  },
  setSize: {
    imgHeight: 155,
    imgWidth: 330,
    barHeight: 40,
    barWidth: 310,
  },
  // 验证码背景图片
  backImgBase: '',
  // 验证滑块的背景图片
  blockBackImgBase: '',
  // 后端返回的唯一token值
  backToken: '',
  // 移动开始的时间
  startMoveTime: 0,
  // 移动结束的时间
  endMoveTime: 0,
  // 提示词的背景颜色
  tipsBackColor: '',
  // 后端返回的加密秘钥 字段
  secretKey: '',
  captchaType: 'blockPuzzle',
  moveBlockBackgroundColor: 'rgb(255, 255, 255)',
  leftBarBorderColor: '',
  iconColor: '',
  barAreaLeft: 0,
  barAreaOffsetWidth: 0,
  startLeft: 0,
  moveBlockLeft: null,
  leftBarWidth: null,
  // 鼠标状态
  status: false,
  // 是够验证完成
  isEnd: false,
  passFlag: false,
  tipWords: '',
  finishText: '',
  iconClass: 'icon-right',
  text: '',
  move: () => {},
  end: () => {},
};
