/* eslint-disable */

import type { EditorProps } from '.';
import React, { useState, useEffect, useMemo } from 'react';
// 引入编辑器组件
import type { EditorState } from 'braft-editor';
import { ContentUtils } from 'braft-utils';
import BraftEditor from 'braft-editor';
// 引入编辑器样式
import 'braft-editor/dist/index.css';
import { debounce } from 'lodash';
import I18n from '@/utils/I18nUtils';
import { Button, Modal, Spin, Tabs, Upload } from 'antd';
import { ImageUtils } from 'braft-finder';
import Icon from '../Icon';
import type { UploadFile } from 'antd/lib/upload/interface';
import { PlusOutlined } from '@ant-design/icons';
import FileUtils from '@/utils/FileUtils';

const defaultLanguage = 'zh';

type languageType = 'zh' | 'zh-hant' | 'en' | 'tr' | 'ru' | 'jpn' | 'kr' | 'pl' | 'fr' | 'vi-vn';

const languages: string[] = ['zh', 'zh-hant', 'en', 'tr', 'ru', 'jpn', 'kr', 'pl', 'fr', 'vi-vn'];

const uploadButton = (
  <div>
    <PlusOutlined /> <div style={{ marginTop: 8 }}>Upload</div>
  </div>
);

export default ({
  value,
  onChange,
  uploadImage,
  uploadVideo,
  uploadAudio,
  readOnly,
}: EditorProps) => {
  const [es, setEs] = useState<EditorState>(BraftEditor.createEditorState(null));
  const [loading, setLoading] = useState(false);
  const [imageVisible, setImageVisible] = useState(false);
  const [imageList, setImageList] = useState<UploadFile[]>([]);

  const debounceChange = useMemo(
    () =>
      debounce((nes: EditorState) => {
        setEs(nes);
        if (onChange) {
          onChange(nes.toHTML());
        }
      }, 500),
    [onChange],
  );

  const sl = I18n.getLocal().split('-')[0];
  const language = languages.indexOf(sl) === -1 ? defaultLanguage : sl;

  useEffect(() => {
    if (es.toHTML() !== value) {
      setEs(BraftEditor.createEditorState(value));
    }
  }, [value]);

  return (
    <>
      <Spin spinning={loading}>
        <BraftEditor
          style={{ border: '1px solid rgba(0,0,0,.2)', borderRadius: '5px' }}
          value={es}
          readOnly={readOnly}
          language={language as languageType}
          media={{
            pasteImage: false,
          }}
          // 不用自带的媒体选择器
          excludeControls={['media']}
          extendControls={
            [
              // {
              //   type: 'component',
              //   key: 'braft-editor-upload-image',
              //   component: (
              //     <button
              //       type="button"
              //       className="control-item button upload-button"
              //       data-title="插入图片"
              //       onClick={() => setImageVisible(true)}
              //     >
              //       <Icon type="picture" />
              //     </button>
              //   ),
              // },
            ]
          }
          onChange={debounceChange}
        />
      </Spin>

      <Modal
        title="插入图片"
        bodyStyle={{ height: '340px' }}
        visible={imageVisible}
        footer={
          <>
            <a style={{ float: 'left' }}>
              <Icon type="plus" /> 添加远程资源
            </a>

            <Button onClick={() => setImageVisible(false)}>取消</Button>
            <Button
              type="primary"
              loading={loading}
              onClick={() => {
                setImageVisible(false);
                setImageList([]);
              }}
            >
              确定
            </Button>
          </>
        }
        onCancel={() => setImageVisible(false)}
      >
        {imageList.length === 0 ? (
          <Upload.Dragger
            multiple
            fileList={imageList}
            onChange={({ fileList }) => {
              const is: UploadFile[] = [];
              fileList.forEach((file) => is.push({ ...file, status: 'done' }));
              setImageList(is);
            }}
          >
            <p className="ant-upload-drag-icon">
              <Icon type="box" style={{ color: '#1890ff', fontSize: '48px' }} />
            </p>
            <p className="ant-upload-text">单击或拖动文件到此区域进行上传</p>
            <p className="ant-upload-hint">支持单次或批量上传。</p>
          </Upload.Dragger>
        ) : (
          <Upload
            multiple
            listType="picture-card"
            fileList={imageList}
            showUploadList={{
              showPreviewIcon: false,
            }}
            onChange={({ fileList }) => setImageList(fileList)}
          >
            {uploadButton}
          </Upload>
        )}
      </Modal>
    </>
  );
};
