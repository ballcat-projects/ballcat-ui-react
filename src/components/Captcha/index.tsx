import type { CaptchaProps } from '@/components/Captcha/typings';
import { captchaGet, captchaValid } from '@/services/captcha';
import I18n from '@/utils/I18nUtils';
import type { CSSProperties, RefObject } from 'react';
import React, { Component } from 'react';
import './index.css';

export * from './typings';

type State = {
  id: string;
  startX: number;
  startY: number;
  startTime: Date;
  stopTime: Date;
  trackArr: {
    x: number;
    y: number;
    type: 'down' | 'move' | 'up';
    t: number;
  }[];
  moveBtnStyles: CSSProperties;
  imgDivStyles: CSSProperties;
  end: number;
  movePercent: number;
  moveX: number;
  bgImgRef: RefObject<HTMLImageElement>;
  sliderImgRef: RefObject<HTMLImageElement>;
  raw: Record<string, any>;
  move: (e: MouseEvent | TouchEvent | Touch) => void;
  up: (e: MouseEvent | TouchEvent | Touch) => void;
};

const defaultState = {
  id: '',
  movePercent: 0,
  moveX: 0,
  end: 206,
  startTime: new Date(),
  stopTime: new Date(),
  startX: 0,
  startY: 0,
  trackArr: [],
  moveBtnStyles: {
    backgroundPosition: '-5px 11.79625%',
    transform: 'translate(0px, 0px)',
  },
  imgDivStyles: {
    transform: 'translate(0px, 0px)',
  },
  raw: {},
};

class AbstractVerify<S> extends Component<CaptchaProps, S> {
  refresh() {}
}

const clearPreventDefault = (e: Event) => {
  if (e?.preventDefault) {
    e.preventDefault();
  }
};

/**
 * 获取当前坐标
 * @returns {{x: number, y: number}}
 * @param e 事件
 */
const getCurrentCoordinate = (e: any) => {
  const event = e.touches && e.touches.length > 0 ? e.touches[0] : e;

  let startX, startY;
  if (event.pageX) {
    startX = event.pageX;
    startY = event.pageY;
  }
  let targetTouches;
  if (event.changedTouches) {
    // 抬起事件
    targetTouches = event.changedTouches;
  } else if (event.targetTouches) {
    // pc 按下事件
    targetTouches = event.targetTouches;
  } else if (event.originalEvent && event.originalEvent.targetTouches) {
    // 鼠标触摸事件
    targetTouches = event.originalEvent.targetTouches;
  }
  if (!startX && targetTouches[0].pageX) {
    startX = targetTouches[0].pageX;
    startY = targetTouches[0].pageY;
  }
  if (!startX && targetTouches[0].clientX) {
    startX = targetTouches[0].clientX;
    startY = targetTouches[0].clientY;
  }
  if (startX && startY) {
    startX = Math.round(startX);
    startY = Math.round(startY);
  }
  return [startX, startY];
};

export default class extends AbstractVerify<State> {
  constructor(props: CaptchaProps, context: any) {
    super(props, context);
    this.state = {
      ...defaultState,
      bgImgRef: React.createRef<HTMLImageElement>(),
      sliderImgRef: React.createRef<HTMLImageElement>(),
      move: (e) => this.move(e),
      up: (e) => this.up(e),
    };
  }

  refresh() {
    if (!this.props.isSlideShow) {
      return;
    }

    captchaGet({ type: 'SLIDER' })
      .then((res) => {
        const { bgImgRef, sliderImgRef } = this.state;
        if (bgImgRef.current) {
          bgImgRef.current.src = res.captcha.backgroundImage;
        }
        if (sliderImgRef.current) {
          sliderImgRef.current.src = res.captcha.sliderImage;
        }

        this.setState({ ...defaultState, id: res.id, raw: { ...res } });
      })
      .catch((err) => {
        console.error('验证码获取异常!', err);
      });
  }

  listEventElements() {
    const elements: Element[] = [];
    for (const collect of [document.getElementsByClassName('slider')]) {
      if (collect.length < 1) {
        continue;
      }

      for (let i = 0; i < collect.length; i++) {
        const element = collect.item(i);
        if (element) {
          elements.push(element);
        }
      }
    }

    return elements;
  }

  addEvent() {
    for (const element of this.listEventElements()) {
      element.addEventListener('touchmove', clearPreventDefault, false);
    }
  }

  removeEvent() {
    for (const element of this.listEventElements()) {
      element.removeEventListener('touchmove', clearPreventDefault, false);
    }
  }

  move(e: MouseEvent | TouchEvent | Touch) {
    const { startX, startY, startTime, trackArr, end, bgImgRef, moveBtnStyles } = this.state;
    const [pageX, pageY] = getCurrentCoordinate(e);
    let moveX = pageX - startX;

    trackArr.push({
      x: pageX - startX,
      y: pageY - startY,
      type: 'move',
      t: new Date().getTime() - startTime.getTime(),
    });

    if (moveX < 0) {
      moveX = 0;
    } else if (moveX > end) {
      moveX = end;
    }

    this.setState({
      moveX,
      trackArr,
      movePercent: moveX / (bgImgRef.current?.width || 1),
      moveBtnStyles: { ...moveBtnStyles, transform: `translate(${moveX}px, 0px)` },
      imgDivStyles: { transform: `translate(${moveX}px, 0px)` },
    });
  }

  up(e: MouseEvent | TouchEvent | Touch) {
    const { id, startX, startY, startTime, trackArr, raw, bgImgRef, sliderImgRef, move, up } =
      this.state;
    const [pageX, pageY] = getCurrentCoordinate(e);
    const stopTime = new Date();

    window.removeEventListener('mousemove', move);
    window.removeEventListener('mouseup', up);
    window.removeEventListener('touchmove', move);
    window.removeEventListener('touchend', up);

    trackArr.push({
      x: pageX - startX,
      y: pageY - startY,
      type: 'up',
      t: stopTime.getTime() - startTime.getTime(),
    });

    captchaValid(
      { id },
      {
        ...raw,
        bgImageWidth: raw?.backgroundImageWidth || bgImgRef.current?.width,
        bgImageHeight: raw?.backgroundImageHeight || bgImgRef.current?.height,
        sliderImageWidth: raw?.sliderImageWidth || sliderImgRef.current?.width,
        sliderImageHeight: raw?.sliderImageHeight || sliderImgRef.current?.height,
        startSlidingTime: startTime,
        entSlidingTime: stopTime,
        trackList: trackArr,
      },
    )
      .then((res) => {
        if (res) {
          this.props.success({ captchaId: id });
        } else {
          console.error('图片验证失败!');
          this.refresh();
        }
      })
      .catch((err) => {
        console.error('图片验证异常!', err);
        this.refresh();
      });
  }

  onDown(event: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>) {
    const { startTime, trackArr, move, up } = this.state;
    const [startX, startY] = getCurrentCoordinate(event);

    trackArr.push({
      x: 0,
      y: 0,
      type: 'down',
      t: new Date().getTime() - startTime.getTime(),
    });

    this.setState({
      startX,
      startY,
      trackArr,
      moveBtnStyles: { backgroundPosition: '-5px 31.0092%' },
    });

    // pc
    window.addEventListener('mousemove', move);
    window.addEventListener('mouseup', up);
    // 手机端
    window.addEventListener('touchmove', move, false);
    window.addEventListener('touchend', up, false);
  }

  componentDidMount() {
    this.addEvent();
  }

  componentWillUnmount() {
    this.removeEvent();
  }

  render() {
    const { isSlideShow } = this.props;
    const { moveBtnStyles, imgDivStyles, bgImgRef, sliderImgRef } = this.state;

    return (
      <div className="slider" style={{ display: isSlideShow ? 'block' : 'none' }}>
        <div className="content">
          <div className="bg-img-div">
            <img id="bg-img" src="" alt={'bg'} ref={bgImgRef} />
          </div>
          <div className="slider-img-div" id="slider-img-div" style={imgDivStyles}>
            <img id="slider-img" src="" alt={'slider'} ref={sliderImgRef} />
          </div>
        </div>
        <div className="slider-move">
          <div className="slider-move-track">{I18n.text('captcha.text')}</div>
          <div
            className="slider-move-btn"
            id="slider-move-btn"
            onMouseDown={(e) => this.onDown(e)}
            onTouchStart={(e) => this.onDown(e)}
            style={moveBtnStyles}
          />
        </div>
        <div className="bottom">
          <div className="close-btn" id="slider-close-btn" onClick={() => this.props.close()} />
          <div className="refresh-btn" id="slider-refresh-btn" onClick={() => this.refresh()} />
        </div>
      </div>
    );
  }
}
