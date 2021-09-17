import type { LtFormDictProps } from '..';
import LtFormItem from '../LtFormItem';

function LtFormDict<DP, V = any>(props: LtFormDictProps<V, DP> & { Component: any }) {
  const { code, dictProps, Component } = props;
  const itemProps: any = { ...props };
  delete itemProps.code;
  delete itemProps.dictProps;
  delete itemProps.Component;

  return (
    <LtFormItem<V> {...itemProps}>
      <Component {...dictProps} code={code} />
    </LtFormItem>
  );
}

export default LtFormDict;
