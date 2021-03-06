import type { UploadFile } from 'antd/lib/upload/interface';

export type CropperValue = string | Blob;

export type CropperOptions = {
  scaleX?: number;
  scaleY?: number;
  enable?: boolean;
  zoomTo?: number;
  rotateTo?: number;
} & Omit<Cropper.Options<HTMLImageElement>, 'crop'>;

export type CropperProps = {
  value?: CropperValue;
  onChange?: (value: Blob | undefined) => void;
  onUrlChange?: (url: string | undefined) => void;
  options?: CropperOptions;
  imgWidth?: number;
  imgHeight?: number;
  previewWidth?: number;
  previewHeight?: number;
  cr?: React.MutableRefObject<CropperRef | undefined>;
};

export type CropperAvatarProps = {
  visible?: boolean;
  onVisibleChange?: (v: boolean) => void;
  /**
   * v: 裁剪后图片的blob
   * file: 原始文件数据
   */
  onSave?: (v: Blob, file: UploadFile) => Promise<void>;
};

export type CropperRef = {
  // 传入正数放大， 负数缩小, 值 0-1 (zoom(0.1) 放大 10%)
  zoom: (ratio: number) => void;
  // 传入正数右旋转，负数左旋转, (rotate(90) 右转90度)
  rotate: (degree: number) => void;
  // 获取原始实例
  getCropper: () => Cropper | undefined;
};
