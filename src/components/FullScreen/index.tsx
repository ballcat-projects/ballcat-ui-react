import { FullscreenExitOutlined, FullscreenOutlined } from '@ant-design/icons';
import type { CSSProperties } from 'react';
import { useState, useCallback, useEffect } from 'react';

export type FullScreenProps = {
  full?: boolean;
  onFullChange?: (flag: boolean) => void;
  iconStyle?: CSSProperties;
  dom?: HTMLElement;
};

export const openFullScreen = (dom?: HTMLElement) => {
  (dom || document.getElementsByTagName('body')[0]).requestFullscreen();
};

export const exitFullScreen = () => document.exitFullscreen();

const FullScreen = ({ full, onFullChange, iconStyle, dom }: FullScreenProps) => {
  const [isFull, setIsFull] = useState(false);

  const changeFull = useCallback(
    (flag: boolean) => {
      setIsFull(flag);
      if (onFullChange) {
        onFullChange(flag);
      }

      // 切换成全屏 且 当前没有全屏元素
      if (flag && !document.fullscreenElement) {
        openFullScreen(dom);
      }
      // 取消全屏 且 当前有全屏元素
      else if (!flag && document.fullscreenElement) {
        document.exitFullscreen();
      }
    },
    [dom, onFullChange],
  );

  useEffect(() => {
    changeFull(!!full);
  }, [full]);

  useEffect(() => {
    const fullscreenchangeListener = () => {
      const flag = !!document.fullscreenElement;
      setIsFull(flag);
      if (onFullChange) {
        onFullChange(flag);
      }
    };
    document.addEventListener('fullscreenchange', fullscreenchangeListener);
    return () => {
      document.removeEventListener('fullscreenchange', fullscreenchangeListener);
    };
  }, []);

  const FullIcon = isFull ? FullscreenExitOutlined : FullscreenOutlined;

  return (
    <FullIcon
      style={{ fontSize: '16px', ...iconStyle }}
      onClick={() => {
        // 外部自定义触发是否全屏
        if (full === undefined && onFullChange === undefined) {
          changeFull(!isFull);
        }
      }}
    />
  );
};

FullScreen.open = openFullScreen;

FullScreen.exit = exitFullScreen;

export default FullScreen;
