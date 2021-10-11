import type { FormDictProps } from '..';
import FormItem from '../FormItem';

function FormDict<DP, V = any>(props: FormDictProps<V, DP> & { Component: any }) {
  const { code, dictProps, Component } = props;
  const itemProps: any = { ...props };
  delete itemProps.code;
  delete itemProps.dictProps;
  delete itemProps.Component;

  return (
    <FormItem<V> {...itemProps}>
      <Component {...dictProps} code={code} />
    </FormItem>
  );
}

export default FormDict;
