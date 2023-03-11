import type { CropperOptions, CropperProps } from '.';
import type { ReactCropperElement } from 'react-cropper';
import ReactCropper from 'react-cropper';
import { useEffect, useImperativeHandle, useMemo, useRef, useState } from 'react';
import { Col, Row } from 'antd';
import 'cropperjs/dist/cropper.css';
import { debounce } from 'lodash';
import CropperAvatar from './CropperAvatar';
import FileUtils from '@/utils/FileUtils';

/**
 * https://github.com/fengyuanchen/cropperjs#options
 */
const defaultOptions: CropperOptions = {
  viewMode: 2,
  // 是否显示背景的马赛克
  background: true,
  responsive: true,
  //  默认值0.8（图片的80%）。--0-1之间的数值，定义自动剪裁区域的大小
  autoCropArea: 0.3,
  checkOrientation: false,
  zoomTo: 0.5,
  // 是否允许放大图像
  zoomable: true,
  // 显示在裁剪框上方的虚线
  guides: true,
  // 是否旋转
  rotatable: true,
  // 默认true ,是否允许拖动 改变裁剪框大小
  cropBoxResizable: true,
  // 是否可以拖拽裁剪框 默认true
  cropBoxMovable: true,
  // 拖动模式, 默认crop当鼠标 点击一处时根据这个点重新生成一个 裁剪框，move可以拖动图片，none:图片不能拖动
  dragMode: 'move',
  center: true,
  minCropBoxHeight: 10,
  minCropBoxWidth: 10,
  initialAspectRatio: 1,
  autoCrop: true,
  highlight: true,
};

const Cropper = ({
  value,
  onChange,
  onUrlChange,
  options,
  imgWidth = 400,
  imgHeight = 400,
  previewWidth = imgWidth,
  previewHeight = imgHeight,
  cr,
}: CropperProps) => {
  const cropperRef = useRef<ReactCropperElement>(null);

  const [originSrc, setOriginSrc] = useState<string>();

  // 防抖
  const debounceChange = useMemo(
    () =>
      debounce((instance: Cropper) => {
        const canvas = instance.getCroppedCanvas();

        if (onChange) {
          canvas.toBlob((blob) => onChange(blob || undefined));
        }

        if (onUrlChange) {
          onUrlChange(canvas.toDataURL());
        }
      }, 500),
    [onChange, onUrlChange],
  );

  const onCrop = (): void => {
    const instance = cropperRef?.current?.cropper;
    if (instance && (onChange || onUrlChange)) {
      debounceChange(instance);
    }
  };

  useImperativeHandle(cr, () => ({
    // 传入正数放大， 负数缩小
    zoom: (ratio: number) => {
      cropperRef?.current?.cropper?.zoom(ratio);
    },
    // 传入正数右旋转，负数左旋转
    rotate: (degree: number) => {
      cropperRef?.current?.cropper?.rotate(degree);
    },
    // 获取原始实例
    getCropper: () => cropperRef?.current?.cropper,
  }));

  useEffect(() => {
    if (!value) {
      setOriginSrc(undefined);
      return;
    }

    if (typeof value === 'string') {
      setOriginSrc(value);
    } else {
      FileUtils.getBase64(value).then((url) => {
        // @ts-ignore
        setOriginSrc(url);
      });
    }
  }, [value]);

  return (
    <Row style={{ userSelect: 'none', WebkitUserSelect: 'none' }}>
      <Col xs={24} md={12}>
        <div style={{ width: '100%' }}>
          <ReactCropper
            {...defaultOptions}
            {...options}
            preview=".lt-cropper-preview"
            style={{
              height: `${imgHeight}px`,
              width: `${imgWidth}px`,
              backgroundImage:
                "url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQAQMAAAAlPW0iAAAAA3NCSVQICAjb4U/gAAAABlBMVEXMzMz////TjRV2AAAACXBIWXMAAArrAAAK6wGCiw1aAAAAHHRFWHRTb2Z0d2FyZQBBZG9iZSBGaXJld29ya3MgQ1M26LyyjAAAABFJREFUCJlj+M/AgBVhF/0PAH6/D/HkDxOGAAAAAElFTkSuQmCC')",
            }}
            src={originSrc}
            crop={onCrop}
            ref={cropperRef}
          />
        </div>
      </Col>
      <Col
        xs={24}
        md={12}
        style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
      >
        <div
          className="lt-cropper-preview"
          style={{
            overflow: 'hidden',
            display: 'inline-block',
            boxSizing: 'border-box',
            height: `${previewHeight}px`,
            width: `${previewWidth}px`,
            boxShadow: '0 0 4px #ccc',
            WebkitBoxShadow: '0 0 4px #ccc',
          }}
        />
      </Col>
    </Row>
  );
};

Cropper.Avatar = CropperAvatar;

export default Cropper;
