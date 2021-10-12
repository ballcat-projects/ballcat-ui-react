import { Component } from 'react';
import './index.less';
import type { Route } from '@ant-design/pro-layout/lib/typings';

export type InlineMeta = {
  uri: string;
};

export interface InlineState {
  meta: InlineMeta;
}

export type InlineProps = {
  meta?: InlineMeta;
  route?: Route;
};

class Inline extends Component<InlineProps, InlineState> {
  constructor(props: InlineProps) {
    super(props);
    const { meta, route } = props;
    this.state = { meta: meta || route?.meta };
  }

  render() {
    const { meta } = this.state;

    return <iframe className="iframe" src={meta.uri} />;
  }
}

export default Inline;
