import type { DictProps } from './typings';
import Dict from './Dict';

const DictText = (props: DictProps) => {
  return (
    <Dict
      {...props}
      render={({ value, getRealName, style }, { dictItems }) => {
        let text = '';
        let color;

        for (let index = 0; index < dictItems.length; index += 1) {
          const item = dictItems[index];
          if (item.realVal === value) {
            text = getRealName(item);
            color = item.attributes.textColor;
            break;
          }
        }

        return <span style={{ ...style, color }}>{text}</span>;
      }}
    />
  );
};

export default DictText;
