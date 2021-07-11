import { Component } from 'react';
import type { BasicLayoutProps } from '@ant-design/pro-layout';
import type { GLOBAL } from '@/typings';
import './index.less';

interface InlineState {
  meta: GLOBAL.Router;
  iFrameHeight: number;
}

class Inline extends Component<BasicLayoutProps, InlineState> {
  constructor(props: BasicLayoutProps) {
    super(props);
    this.state = {
      meta: props.route?.meta,
      iFrameHeight: 0,
    };
  }

  render() {
    return <iframe className="iframe" src={this.state.meta.uri} />;
  }
}

export default Inline;
