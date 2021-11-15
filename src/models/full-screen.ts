import { useState, useEffect } from 'react';

export default () => {
  const [isFull, setFull] = useState(false);
  const [isContentFull, setIsContentFull] = useState(false);

  const full = (dom?: HTMLElement) => {
    if (!document.fullscreenElement) {
      (dom || document.getElementsByTagName('body')[0]).requestFullscreen();
    }
  };

  const exit = () => {
    if (document.fullscreenElement) {
      document.exitFullscreen();
    }
  };

  const contentFull = () => {
    setIsContentFull(true);
  };
  const contentExit = () => {
    setIsContentFull(false);
  };

  useEffect(() => {
    const fullscreenchangeListener = () => {
      setFull(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', fullscreenchangeListener);
    return () => {
      document.removeEventListener('fullscreenchange', fullscreenchangeListener);
    };
  }, []);

  return { isFull, full, exit, isContentFull, contentFull, contentExit };
};
