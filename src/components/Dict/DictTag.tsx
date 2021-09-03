import type { DictProps } from './typings';
import Dict from './Dict';
import { Tag } from 'antd';

const DictTag = (props: DictProps) => {
  return (
    <Dict
      {...props}
      render={({ value, getRealName }, { dictItems }) => {
        let text = '';
        let color;

        for (let index = 0; index < dictItems.length; index += 1) {
          const item = dictItems[index];
          if (item.realVal === value) {
            text = getRealName(item);
            color = item.attributes.tagColor;
            break;
          }
        }

        return <Tag color={color}>{text}</Tag>;
      }}
    />
  );
};

export default DictTag;
