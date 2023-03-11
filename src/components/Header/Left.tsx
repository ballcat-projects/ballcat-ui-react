import I18n from '@/utils/I18nUtils';
import {
  HomeOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  ReloadOutlined,
} from '@ant-design/icons';
import { HeaderViewProps } from '@ant-design/pro-layout/es/Header';
import type { Route } from '@ant-design/pro-layout/lib/typings';
import type { CSSProperties } from '@umijs/renderer-react/node_modules/@types/react';
import { Breadcrumb } from 'antd';
import React, { useEffect, useState } from 'react';
import { useAliveController } from 'react-activation';
import { history } from 'umi';

interface HeaderContentProps {
  collapsed: boolean;
  onCollapse: (collapsed: boolean) => void;
  route: Route;
  headerViewProps: HeaderViewProps;
}

const breadcrumbRender = (path: string, routes: Route[]) => {
  const list: any[] = [];
  if (!routes) {
    return list;
  }
  for (let i = 0; i < routes.length; i += 1) {
    const route = routes[i];
    const { path: rp, name: rn, locale, exact } = route;

    if (rp && rp !== '/') {
      if (
        // 全匹配
        (exact && path === rp) ||
        // 模糊匹配
        (!exact && path.startsWith(rp))
      ) {
        let name = rn;
        if (locale === undefined || locale === null || locale) {
          // 国际化失败, 则用key展示
          name = I18n.text(`menu.${rn}`);
        }

        list.push(<Breadcrumb.Item key={rp}>{name}</Breadcrumb.Item>);
        if (rp !== path && route?.routes) {
          list.push(...breadcrumbRender(path, route.routes));
        }

        // 找到匹配的就结束
        break;
      }
    }
  }
  return list;
};

const iconStyle: CSSProperties = {
  cursor: 'pointer',
  fontSize: '16px',
  marginRight: '5px',
};

export default (props: HeaderContentProps) => {
  const { collapsed, onCollapse, route, headerViewProps } = props;
  const { location } = history;
  const { layout } = headerViewProps || {};

  const { refreshScope } = useAliveController();

  const [breadcrumbData, setBreadcrumbData] = useState<any[]>([]);

  useEffect(() => {
    if (location.pathname && location.pathname !== '/') {
      setBreadcrumbData(breadcrumbRender(location.pathname, route.routes || []));
    } else {
      setBreadcrumbData([]);
    }
  }, [location.pathname, route.routes]);

  const CollapsedIcon = collapsed ? MenuUnfoldOutlined : MenuFoldOutlined;

  return (
    <div
      style={{
        overflow: 'hidden',
        display: 'flex',
        flexWrap: 'nowrap',
        alignItems: 'center',
        alignContent: 'center',
        height: '100%',
      }}
    >
      {layout !== 'mix' && (
        <CollapsedIcon
          title={I18n.text('component.global.header.content.fold')}
          style={iconStyle}
          onClick={() => onCollapse(!collapsed)}
        />
      )}

      <ReloadOutlined
        title={I18n.text('multiTab.refresh')}
        style={iconStyle}
        onClick={() => {
          if (location.pathname) {
            refreshScope(location.pathname);
          }
        }}
      />

      <Breadcrumb style={{ width: '300px' }}>
        <Breadcrumb.Item>
          <HomeOutlined style={{ ...iconStyle, marginRight: 0 }} />
        </Breadcrumb.Item>
        {breadcrumbData}
      </Breadcrumb>
    </div>
  );
};
