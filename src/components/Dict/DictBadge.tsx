import type { DictProps } from './typings';
import Dict from './Dict';
import { Badge } from 'antd';

const DictBadge = (props: DictProps) => {
  return (
    <Dict
      {...props}
      render={({ value, getRealName, style }, { dictItems }) => {
        let text = '';
        let color;
        let status;

        for (let index = 0; index < dictItems.length; index += 1) {
          const item = dictItems[index];
          if (item.realVal === value) {
            text = getRealName(item);
            color = item.attributes.badgeColor;
            status = item.attributes.badgeStatus;
            break;
          }
        }

        return <Badge color={color} status={status} text={text} style={{ ...style }} />;
      }}
    />
  );
};

export default DictBadge;
