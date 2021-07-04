import { Component } from 'react';
import './index.css';
import { aes } from '@/utils/Encrypt';
import { get, valid } from '@/services/captcha';
// @ts-ignore
import { CSSTransition } from 'react-transition-group';

interface CaptchaProps {
  isSlideShow: boolean;
  close: () => void;
  success: (captchaVerification: string) => void;
}

interface CaptchaState {
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
}

class VerifySlide extends Component<CaptchaProps, CaptchaState> {
  constructor(props: CaptchaProps) {
    super(props);
    this.state = {
      mode: 'fixed',
      vSpace: 5,
      imgSize: {
        width: 310,
        height: 200,
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
        imgHeight: 200,
        imgWidth: 310,
        barHeight: 0,
        barWidth: 0,
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
      text: '向右滑动完成验证',
      finishText: '',
      iconClass: 'icon-right',
    };
  }

  componentDidMount() {
    this.init();
  }

  init() {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const that = this;

    window.removeEventListener('touchmove', function (e) {
      that.move(e);
    });
    window.removeEventListener('mousemove', function (e) {
      that.move(e);
    });

    // 鼠标松开
    window.removeEventListener('touchend', function () {
      that.end();
    });
    window.removeEventListener('mouseup', function () {
      that.end();
    });

    window.addEventListener('touchmove', function (e) {
      that.move(e);
    });
    window.addEventListener('mousemove', function (e) {
      that.move(e);
    });

    // 鼠标松开
    window.addEventListener('touchend', function () {
      that.end();
    });
    window.addEventListener('mouseup', function () {
      that.end();
    });
  }

  setBarArea(e: any) {
    // 必须限制为有效位置更新时才更新值. 避免频繁更新出错
    if (e) {
      const barAreaLeft = e.getBoundingClientRect().left;
      const barAreaOffsetWidth = e.offsetWidth;
      const update: any = {};

      if (barAreaLeft !== this.state.barAreaLeft) {
        update.barAreaLeft = barAreaLeft;
      }
      if (barAreaOffsetWidth !== this.state.barAreaOffsetWidth) {
        update.barAreaOffsetWidth = barAreaOffsetWidth;
      }

      if (update.barAreaLeft || update.barAreaOffsetWidth) {
        this.setState({ ...update });
      }
    }
  }

  async getData() {
    // 仅在展示的时候获取数据
    if (!this.props.isSlideShow) {
      return;
    }

    await get({
      captchaType: this.state.captchaType,
    }).then((res) => {
      if (res.repCode === '0000') {
        this.setState({
          backImgBase: res.repData.originalImageBase64,
          blockBackImgBase: res.repData.jigsawImageBase64,
          backToken: res.repData.token,
          secretKey: res.repData.secretKey,
        });
      }
      // 请求次数超限
      else if (res.repCode === '6201') {
        this.setState({
          backImgBase: '',
          blockBackImgBase: '',
          leftBarBorderColor: '#d9534f',
          iconColor: '#fff',
          iconClass: 'icon-close',
          passFlag: false,
          tipWords: res.repMsg,
        });
        setTimeout(() => {
          this.setState({
            tipWords: '',
          });
        }, 1000);
      }
    });
  }

  start(e: any) {
    let x;
    // 兼容PC端
    if (!e.touches) {
      x = e.clientX;
    }
    // 兼容移动端
    else {
      x = e.touches[0].pageX;
    }
    const startLeft = Math.floor(x - this.state.barAreaLeft);
    // 开始滑动的时间
    const startMoveTime = +new Date();
    if (this.state.isEnd === false) {
      this.setState({
        text: '',
        moveBlockBackgroundColor: '#337ab7',
        leftBarBorderColor: '#337AB7',
        iconColor: '#fff',
        startLeft,
        startMoveTime,
        status: true,
      });
      e.stopPropagation();
    } else {
      this.setState({
        startLeft,
        startMoveTime,
      });
    }
  }

  async refresh() {
    await this.getData();
    this.setState({
      moveBlockLeft: '',
      leftBarWidth: '',
      text: '向右滑动完成验证',
      moveBlockBackgroundColor: '#fff',
      leftBarBorderColor: '#337AB7',
      iconColor: '#fff',
      status: false,
      isEnd: false,
      iconClass: 'icon-right',
    });
  }

  move(e: any) {
    if (this.state.status && this.state.isEnd === false) {
      let x;
      if (!e.touches) {
        // 兼容PC端
        x = e.clientX;
      } else {
        // 兼容移动端
        x = e.touches[0].pageX;
      }
      const bar_area_left = this.state.barAreaLeft;
      // 小方块相对于父元素的left值
      let move_block_left = x - bar_area_left;

      if (
        move_block_left >=
        this.state.barAreaOffsetWidth - parseInt(String(this.state.blockSize.width / 2), 10) - 2
      ) {
        move_block_left =
          this.state.barAreaOffsetWidth - parseInt(String(this.state.blockSize.width / 2), 10) - 2;
      }

      if (move_block_left <= 0) {
        move_block_left = parseInt(String(this.state.blockSize.width / 2), 10);
      }
      // 拖动后小方块的left值
      this.setState({
        moveBlockLeft: move_block_left - this.state.startLeft,
        leftBarWidth: move_block_left - this.state.startLeft,
      });
    }
  }

  end() {
    this.setState({ endMoveTime: +new Date() });

    // 判断是否重合
    if (this.state.status && this.state.isEnd === false) {
      const moveLeftDistance =
        (parseInt(this.state.moveBlockLeft || 0, 10) * 310) / this.state.setSize.imgWidth;
      const { secretKey, backToken } = this.state;

      const word = JSON.stringify({
        x: moveLeftDistance,
        y: 5.0,
      });
      const data: CAPTCHA.ValidParams = {
        captchaType: this.state.captchaType,
        pointJson: secretKey ? aes.encrypt(word, secretKey) : word,
        token: backToken,
      };

      valid(data).then((res) => {
        if (res.repCode === '0000') {
          this.setState({
            isEnd: true,
            passFlag: true,
            iconClass: 'icon-check',
            tipWords: `${((this.state.endMoveTime - this.state.startMoveTime) / 1000).toFixed(
              2,
            )}s验证成功`,
          });

          const captchaVerification = secretKey
            ? aes.encrypt(`${backToken}---${word}`, secretKey)
            : `${backToken}---${word}`;

          setTimeout(() => {
            this.setState({ tipWords: '' });
            this.props.close();
            this.props.success(captchaVerification);
          }, 1000);
        } else {
          this.setState({
            isEnd: true,
            moveBlockBackgroundColor: '#d9534f',
            leftBarBorderColor: '#d9534f',
            iconColor: '#fff',
            iconClass: 'icon-close',
            passFlag: false,
            tipWords: res.repMsg || '验证失败',
          });
          setTimeout(async () => {
            await this.refresh();
            this.setState({
              tipWords: '',
            });
          }, 1000);
        }
      });

      this.setState({ status: false });
    }
  }

  render() {
    const { isSlideShow, close } = this.props;
    const {
      imgSize,
      setSize,
      vSpace,
      backImgBase,
      barSize,
      transitionWidth,
      transitionLeft,
      finishText,
      iconClass,
    } = this.state;
    return (
      <div className="mask" style={{ display: isSlideShow ? 'block' : 'none' }}>
        <div className="verifybox" style={{ maxWidth: `${imgSize.width + 30}px` }}>
          <div className="verifybox-top">
            请完成安全验证
            <span className="verifybox-close" onClick={close}>
              <i className="iconfont icon-close" />
            </span>
          </div>

          <div className="verifybox-bottom" style={{ padding: '15px' }}>
            <div style={{ position: 'relative' }} className="stop-user-select">
              <div className="verify-img-out" style={{ height: `${setSize.imgHeight + vSpace}px` }}>
                <div
                  className="verify-img-panel"
                  style={{ width: `${setSize.imgWidth}px`, height: `${setSize.imgHeight}px` }}
                >
                  {backImgBase ? (
                    <img
                      src={`data:image/png;base64,${backImgBase}`}
                      alt=""
                      style={{ width: '100%', height: '100%', display: 'block' }}
                    />
                  ) : (
                    <div
                      style={{
                        width: '100%',
                        height: '100%',
                        display: 'block',
                        lineHeight: '150px',
                        textAlign: 'center',
                      }}
                    >
                      loading
                    </div>
                  )}

                  <div className="verify-refresh" onClick={() => this.refresh()}>
                    <i className="iconfont icon-refresh" />
                  </div>

                  <CSSTransition
                    in={this.state.tipWords.length > 0}
                    timeout={150}
                    classNames="tips"
                    unmountOnExit
                  >
                    <span
                      className={this.state.passFlag ? `verify-tips suc-bg` : `verify-tips err-bg`}
                    >
                      {this.state.tipWords}
                    </span>
                  </CSSTransition>
                </div>
              </div>

              <div
                className="verify-bar-area"
                style={{
                  width: this.state.setSize.imgWidth,
                  height: barSize.height,
                  lineHeight: barSize.height,
                }}
                ref={(bararea) => this.setBarArea(bararea)}
              >
                <span className="verify-msg">{this.state.text}</span>

                <div
                  className="verify-left-bar"
                  style={{
                    width:
                      this.state.leftBarWidth !== undefined
                        ? this.state.leftBarWidth
                        : barSize.height,
                    height: barSize.height,
                    borderColor: this.state.leftBarBorderColor,
                    transition: transitionWidth,
                  }}
                >
                  <span className="verify-msg">{finishText}</span>

                  <div
                    className="verify-move-block"
                    onTouchStart={(e) => this.start(e)}
                    onMouseDown={(e) => this.start(e)}
                    style={{
                      height: `${barSize.height}px`,
                      width: `${barSize.height}px`,
                      backgroundColor: this.state.moveBlockBackgroundColor,
                      left: this.state.moveBlockLeft,
                      transition: transitionLeft,
                    }}
                  >
                    <i
                      className={`verify-icon iconfont ${iconClass}`}
                      style={{ color: this.state.iconColor }}
                    />

                    <div
                      className="verify-sub-block"
                      style={{
                        width: `${Math.floor((setSize.imgWidth * 47) / 310)}px`,
                        height: this.state.setSize.imgHeight,
                        top: `-${setSize.imgHeight + vSpace}px`,
                        backgroundSize: `${setSize.imgWidth} ${this.state.setSize.imgHeight}`,
                      }}
                    >
                      {this.state.blockBackImgBase ? (
                        <img
                          src={`data:image/png;base64,${this.state.blockBackImgBase}`}
                          alt=""
                          style={{ width: '100%', height: '100%', display: 'block' }}
                        />
                      ) : null}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default VerifySlide;
