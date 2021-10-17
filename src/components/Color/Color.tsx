import { useState } from 'react';
import { Popover } from 'antd';
import type { ColorProps } from './typings';
import { SketchPicker } from 'react-color';
import I18n from '@/utils/I18nUtils';
import { SvgIcon } from '@/components/Icon';
import { DeleteOutlined } from '@ant-design/icons';

export const DEFAULT_COLORS = [
  '#FF9D4E', // 0 - 橘黄色
  '#5BD8A6', // 1 - 绿色
  '#5B8FF9', // 2 - 蓝色
  '#F7664E', // 3 - 红色
  '#FF86B7', // 4 - 水红色
  '#2B9E9D', // 5 - 墨绿色
  '#9270CA', // 6 - 紫色
  '#6DC8EC', // 7 - 浅蓝色
  '#667796', // 8 - 黛蓝色
  '#F6BD16', // 9 - 黄色
];

const Color = (props: ColorProps) => {
  const {
    value,
    onChange = () => {},
    presetColors,
    children,
    sketchPickerProps,
    popoverProps,
  } = props;

  const [color, changeColor] = useState<string | undefined>(value || '#1890ff');

  const [visible, setVisible] = useState(false);

  const setColor = (c: string | undefined) => {
    changeColor(c);
    onChange(c);
  };

  return (
    <>
      {children}
      <Popover
        trigger="click"
        placement="right"
        {...popoverProps}
        visible={visible}
        onVisibleChange={setVisible}
        content={
          <div
            style={{
              margin: '-12px -16px',
            }}
          >
            <SketchPicker
              width="220px"
              {...sketchPickerProps}
              presetColors={presetColors || DEFAULT_COLORS}
              color={color}
              onChange={({ hex, rgb: { r, g, b, a } }) => {
                if (a && a < 1) {
                  setColor(`rgba(${r}, ${g}, ${b}, ${a})`);
                }
                setColor(hex);
              }}
            />
          </div>
        }
      >
        <SvgIcon.Straw
          title={I18n.text('color.select')}
          style={{
            marginRight: '5px',
            cursor: 'pointer',
            marginLeft: `${children ? 5 : 0}px`,
            color: '#1890ff',
          }}
        />
      </Popover>

      <DeleteOutlined
        title={I18n.text('color.clean')}
        style={{ color: '#EB1621', cursor: 'pointer' }}
        onClick={() => setColor(undefined)}
      />
    </>
  );
};

export default Color;
