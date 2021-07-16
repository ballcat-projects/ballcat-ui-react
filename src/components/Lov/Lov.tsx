import React from 'react';
import LovModal from '@/components/Lov/LovModal';

import * as lovMap from '../../../config/lov';
import type { LovConfig, LovProps } from './typing';

const cache: Record<string, LovConfig<any>> = {};
// 使用 Object.keys 用来遍历模块
const keys = Object.keys(lovMap);

for (let i = 0; i < keys.length; i += 1) {
  const lov: LovConfig<Record<string, any>> = lovMap[keys[i]];
  cache[lov.keyword] = lov;
}

const Lov: React.FC<LovProps> = (props) => {
  const config = cache[props.keyword];

  return <LovModal {...config} />;
};

export default Lov;
