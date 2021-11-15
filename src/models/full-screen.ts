import { useState, useEffect } from 'react';

export default () => {
  const [isFull, setFull] = useState(false);

  const full = (dom?: HTMLElement) => {
    if (!document.fullscreenElement) {
      (dom || document.getElementsByTagName('body')[0]).requestFullscreen();
    }
  };

  const contentFull = () => {
    full(document.getElementsByTagName('main')[0]);
  };

  const exit = () => {
    if (document.fullscreenElement) {
      document.exitFullscreen();
    }
  };

  const switchFull = () => {
    if (isFull) {
      exit();
    } else {
      full();
    }
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

  return { isFull, full, contentFull, exit, switchFull };
};
