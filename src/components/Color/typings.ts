import type React from 'react';
import type { PopoverProps } from 'antd';
import type { SketchPickerProps } from 'react-color';

export type ColorProps = {
  // 初始颜色
  value?: string;
  // 预设颜色
  presetColors?: string[];
  // 值变化
  onChange?: (value: string | undefined) => void;
  children?: React.ReactNode;
  // 扩展
  sketchPickerProps?: SketchPickerProps;
  popoverProps?: PopoverProps;
};
