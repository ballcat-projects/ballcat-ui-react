import { Button, Col, Modal, Row, Spin, Upload } from 'antd';
import type { CropperAvatarProps, CropperRef } from '.';
import Cropper from '.';
import { useState, useRef } from 'react';
import type { UploadFile } from 'antd/lib/upload/interface';
import Icon from '../Icon';
import I18n from '@/utils/I18nUtils';

const avatarHeight = 200;
const avatarWidth = 200;

export default ({ visible, onVisibleChange = () => {}, onSave }: CropperAvatarProps) => {
  const cropperRef = useRef<CropperRef>();

  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [imgBlob, setImgBlob] = useState<Blob>();
  const [saveLoading, setSaveLoading] = useState<boolean>(false);

  const cropperHander = (methodName: 'zoom' | 'rotate', arg: number) => {
    if (!fileList || fileList.length === 0) {
      I18n.error('cropper.avatar.select');
      return;
    }

    if (cropperRef?.current) {
      cropperRef.current[methodName](arg);
    }
  };

  return (
    <Modal
      width="800px"
      title="头像上传"
      bodyStyle={{ paddingBottom: 0 }}
      visible={visible}
      footer={
        <Row>
          <Col xs={24} md={12} style={{ textAlign: 'left' }}>
            <Upload
              accept="image/*"
              fileList={fileList}
              showUploadList={false}
              maxCount={1}
              onChange={(e) => setFileList(e.fileList)}
            >
              <Button>
                <Icon type="upload" />
                选择图片
              </Button>
            </Upload>

            <Button style={{ marginLeft: '8px' }} onClick={() => cropperHander('zoom', 0.1)}>
              <Icon type="plus" />
            </Button>
            <Button onClick={() => cropperHander('zoom', -0.1)}>
              <Icon type="minus" />
            </Button>
            <Button onClick={() => cropperHander('rotate', -90)}>
              <Icon type="undo" />
            </Button>
            <Button onClick={() => cropperHander('rotate', 90)}>
              <Icon type="redo" />
            </Button>
          </Col>

          <Col xs={24} md={12}>
            <Button
              type="primary"
              loading={saveLoading}
              onClick={() => {
                if (!imgBlob) {
                  I18n.error('cropper.avatar.select');
                  return;
                }
                if (onSave) {
                  setSaveLoading(true);
                  // 由于 cropper 使用了防抖。 所以需要等待一会在提交数据
                  setTimeout(() => {
                    onSave(imgBlob, fileList[0]).finally(() => setSaveLoading(false));
                  }, 600);
                }
              }}
            >
              保存
            </Button>
          </Col>
        </Row>
      }
      onCancel={() => onVisibleChange(false)}
    >
      <Spin spinning={saveLoading}>
        <Cropper
          imgHeight={350}
          imgWidth={350}
          previewHeight={avatarHeight}
          previewWidth={avatarWidth}
          cr={cropperRef}
          value={fileList && fileList.length > 0 ? fileList[0].originFileObj : ''}
          options={{
            minCropBoxHeight: 200,
            minCropBoxWidth: 200,
            autoCropArea: 1,
            aspectRatio: 1,
          }}
          onChange={setImgBlob}
        />
      </Spin>
    </Modal>
  );
};
