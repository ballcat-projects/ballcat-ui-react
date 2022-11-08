export interface CaptchaProps {
  isSlideShow: boolean;
  close: () => void;
  success: (params: Record<string, any>) => void;
}
