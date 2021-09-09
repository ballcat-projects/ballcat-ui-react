import React, { useState, useEffect } from 'react';
import { settings } from '@/utils/ConfigUtils';
import { getIconFile } from '@/services/ant-design-pro/icon';
import Icon from './Icon';
import './IconSelect.less';
import { Input, Modal, Spin, Tabs } from 'antd';
import I18n from '@/utils/I18nUtils';

const iconArray: { key: string; title: string; types: string[] }[] = [
  {
    key: 'directional',
    title: '方向性图标',
    types: [
      'step-backward',
      'step-forward',
      'fast-backward',
      'fast-forward',
      'shrink',
      'arrows-alt',
      'down',
      'up',
      'left',
      'right',
      'caret-up',
      'caret-down',
      'caret-left',
      'caret-right',
      'up-circle',
      'down-circle',
      'left-circle',
      'right-circle',
      'doubleright',
      'doubleleft',
      'verticalleft',
      'verticalright',
      'forward',
      'backward',
      'rollback',
      'enter',
      'retweet',
      'swap',
      'swap-left',
      'swap-right',
      'arrowup',
      'arrowdown',
      'arrow-left',
      'arrow-right',
      'play-circle',
      'up-square',
      'down-square',
      'left-square',
      'right-square',
      'login',
      'logout',
      'menu-fold',
      'menu-unfold',
      'border-bottom',
      'border-horizontal',
      'border-inner',
      'border-left',
      'border-right',
      'border-top',
      'border-verticle',
      'pic-center',
      'pic-left',
      'pic-right',
      'radius-bottomleft',
      'radius-bottomright',
      'radius-upleft',
      'fullscreen',
      'fullscreen-exit',
    ],
  },
  {
    key: 'suggested',
    title: '提示建议性图标',
    types: [
      'question',
      'question-circle',
      'plus',
      'plus-circle',
      'pause',
      'pausecircle',
      'minus',
      'minus-circle',
      'plus-square',
      'minus-square',
      'infomation',
      'info-circle',
      'exclamation',
      'exclamation-circle',
      'close',
      'close-circle',
      'close-square',
      'check',
      'check-circle',
      'check-square',
      'clock',
      'warning',
      'issues-close',
      'stop',
    ],
  },
  {
    key: 'editor',
    title: '编辑类图标',
    types: [
      'edit',
      'edit-square',
      'copy',
      'scissor',
      'delete',
      'snippets',
      'diff',
      'highlight',
      'align-center',
      'align-left',
      'align-right',
      'bg-colors',
      'bold',
      'italic',
      'underline',
      'strikethrough',
      'redo',
      'undo',
      'zoomin',
      'zoomout',
      'font-colors',
      'font-size',
      'line-height',
      'colum-height',
      'dash',
      'small-dash',
      'sort-ascending',
      'sort-descending',
      'drag',
      'orderedlist',
      'radius-setting',
    ],
  },
  {
    key: 'data',
    title: '数据类图标',
    types: [
      'areachart',
      'piechart',
      'barchart',
      'dot-chart',
      'linechart',
      'radarchart',
      'heatmap',
      'fall',
      'rise',
      'stock',
      'boxplot',
      'fund',
      'sliders',
    ],
  },
  {
    key: 'brand_logo',
    title: '网站通用图标',
    types: [
      'lock',
      'unlock',
      'unorderedlist',
      'book',
      'calendar',
      'cloud',
      'cloud-download',
      'code',
      'copy',
      'creditcard',
      'delete',
      'desktop',
      'download',
      'ellipsis',
      'file',
      'file-text',
      'file-unknown',
      'file-pdf',
      'file-word',
      'file-excel',
      'file-jpg',
      'file-ppt',
      'file-markdown',
      'file-add',
      'folder',
      'folder-open',
      'folder-add',
      'hdd',
      'frown',
      'meh',
      'smile',
      'box',
      'laptop',
      'appstore',
      'link',
      'mail',
      'mobile',
      'notification',
      'paperclip',
      'picture',
      'poweroff',
      'reload',
      'search',
      'setting',
      'share',
      'shoppingcart',
      'tablet',
      'tag',
      'tags',
      'totop',
      'upload',
      'user',
      'video',
      'home',
      'loading',
      'loading--quarters',
      'cloud-upload',
      'star',
      'heart',
      'position',
      'eye',
      'camera',
      'save',
      'team',
      'solution',
      'phone',
      'filter',
      'file-exception',
      'export',
      'customerservice',
      'qrcode',
      'scan',
      'like',
      'unlike',
      'message',
      'pay-circle',
      'calculator',
      'pushpin',
      'bulb',
      'select',
      'switcher',
      'rocket',
      'bell',
      'disconnect',
      'database',
      'compass',
      'barcode',
      'hourglass',
      'key',
      'flag',
      'layout',
      'printer',
      'sound',
      'USB',
      'skin',
      'tool',
      'sync',
      'wifi',
      'car',
      'schedule',
      'adduser',
      'deleteuser',
      'usergroup-add',
      'usergroup-delete',
      'man',
      'woman',
      'shop',
      'gift',
      'idcard',
      'medicinebox',
      'redenvelope',
      'coffee',
      'copyright',
      'trademark',
      'safety',
      'wallet',
      'bank',
      'trophy',
      'contacts',
      'global',
      'shake',
      'api',
      'fork',
      'dashboard',
      'table',
      'profile',
      'alert',
      'audit',
      'branches',
      'build',
      'border',
      'crown',
      'experiment',
      'fire',
      'moneycollect',
      'propertysafety',
      'read',
      'reconciliation',
      'rest',
      'securityscan',
      'insurance',
      'interation',
      'safety-certificate',
      'project',
      'thunderbolt',
      'block',
      'cluster',
      'deploymentunit',
      'dollar',
      'EURO',
      'Pound',
      'filedone',
      'file-exclamation',
      'fileprotect',
      'filesearch',
      'filesync',
      'gateway',
      'gold',
      'robot',
      'shopping',
    ],
  },
  {
    key: 'application',
    title: '品牌和标识',
    types: [
      'android',
      'apple',
      'windows',
      'IE',
      'chrome',
      'github-fill',
      'aliwangwang',
      'dingtalk',
      'weibo',
      'taobao',
      'HTML',
      'twitter',
      'wechat-fill',
      'Youtube',
      'alipay',
      'skype',
      'QQ',
      'medium',
      'Gitlab',
      'linkedin',
      'google',
      'dropbox',
      'facebook',
      'codepen',
      'CodeSandbox',
      'amazon',
      'antdesign',
      'aliyun',
      'zhihu',
      'slack',
      'behance',
      'dribbble',
      'instagram',
      'yuque',
      'alibaba',
      'yahoo',
    ],
  },
  {
    key: 'other',
    title: '其他',
    types: [],
  },
];

const [directional, suggested, editor, data, brand_logo, application, other] = iconArray;
const jsExp = new RegExp('id=".+?"', 'g');
const iconIdArray: string[] = [];

const pushIconId = (regStr: string) => {
  const id = regStr.substring(4 + settings.iconPrefix.length, regStr.length - 1);

  if (
    directional.types.indexOf(id) !== -1 ||
    suggested.types.indexOf(id) !== -1 ||
    editor.types.indexOf(id) !== -1 ||
    data.types.indexOf(id) !== -1 ||
    brand_logo.types.indexOf(id) !== -1 ||
    application.types.indexOf(id) !== -1
  ) {
    return;
  }

  if (other.types.indexOf(id) === -1) {
    iconIdArray.push(id);
  }
};

export type IconSelectProps = {
  value?: string;
  onChange?: (val?: string) => void;
};

const IconSelect = (props: IconSelectProps) => {
  const { value, onChange = () => {} } = props;
  const [loading, setLoading] = useState(false);
  const [tabPanes, setTabPanes] = useState<React.ReactNode[]>([]);
  const [visible, setVisible] = useState(false);
  const [selectIcon, setSelectIcon] = useState(value);

  useEffect(() => {
    if (iconIdArray.length === 0) {
      setLoading(true);
      // 初始化
      getIconFile(settings.iconfontUrl)
        .then((res) => {
          res.match(jsExp)?.forEach((reg) => {
            const regStr = reg.toString();
            pushIconId(regStr);
          });
          other.types = iconIdArray;
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, []);

  useEffect(() => {
    if (!loading) {
      const tabs: React.ReactNode[] = [];
      // 加载数据
      iconArray.forEach((icon) => {
        const iconNodes: React.ReactNode[] = [];
        icon.types.forEach((type) => {
          iconNodes.push(
            <li
              className={`is-li ${selectIcon && selectIcon === type ? 'active' : ''}`}
              key={`is-li-${icon.key}-${type}`}
              onClick={() => setSelectIcon(type)}
            >
              <Icon key={`is-icon-${icon.key}-${type}`} type={type} style={{ fontSize: 36 }} />
            </li>,
          );
        });

        tabs.push(
          <Tabs.TabPane
            style={{ userSelect: 'none' }}
            key={`is-tp-${icon.key}`}
            tabKey={icon.key}
            tab={icon.title}
          >
            <ul className="is-ul" key={`is-ul-${icon.key}`}>
              {iconNodes}
            </ul>
          </Tabs.TabPane>,
        );
      });

      setTabPanes(tabs);
    }
  }, [loading, value, selectIcon]);

  return (
    <>
      <Spin spinning={loading} style={{ userSelect: 'none' }}>
        <Input
          readOnly
          // allowClear
          value={value}
          title={I18n.text('icon.select')}
          placeholder={I18n.text('icon.select')}
          addonAfter={
            <Icon
              title={I18n.text('icon.select')}
              type="setting"
              onClick={() => setVisible(true)}
            />
          }
          style={{ userSelect: 'none' }}
          prefix={value && value.length > 0 ? <Icon type={value} /> : ''}
          suffix={
            <Icon
              title={I18n.text('icon.clean')}
              type="close"
              onClick={() => {
                onChange(undefined);
              }}
            />
          }
          onClick={() => setVisible(true)}
        />

        <Modal
          visible={visible}
          onCancel={() => setVisible(false)}
          onOk={() => {
            onChange(selectIcon);
            setVisible(false);
          }}
          width="800px"
        >
          <Tabs style={{ userSelect: 'none' }}>{tabPanes}</Tabs>
        </Modal>
      </Spin>
    </>
  );
};

export default IconSelect;
