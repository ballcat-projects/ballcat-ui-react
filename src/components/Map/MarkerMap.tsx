import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { Wrapper } from '@googlemaps/react-wrapper';
import Map from './Map';
import { Button, Card, Input, Modal, Select, Space } from 'antd';
import GoogleMapUtils from '@/utils/GoogleMapUtils';
import type { MarkerMapProps } from './typings';
import { centerMap } from './typings';
import Copy from '@/components/Copy';

const Marker: React.FC<google.maps.MarkerOptions> = (options) => {
  const [marker, setMarker] = useState<google.maps.Marker>();

  useEffect(() => {
    if (!marker) {
      setMarker(new google.maps.Marker());
    }

    return () => {
      if (marker) {
        marker.setMap(null);
      }
    };
  }, [marker]);

  useEffect(() => {
    if (marker) {
      marker.setOptions(options);
    }
  }, [marker, options]);

  return null;
};

export default ({
  type = 'card',
  show = true,
  onShow = () => null,
  value,
  onChange = () => null,
}: MarkerMapProps) => {
  const [click, setClick] = useState<google.maps.LatLngLiteral>();
  const [zoom, setZoom] = useState(3); // initial zoom
  const [center, setCenter] = useState<google.maps.LatLngLiteral>({
    lat: 0,
    lng: 0,
  });

  const onClick = useCallback(
    (e: google.maps.MapMouseEvent) => {
      if (e && e.latLng) {
        const nv = {
          lat: e.latLng.lat(),
          lng: e.latLng.lng(),
        };
        setClick(nv);

        // 卡片类型时. 实时同步点击数据
        if (type === 'card') {
          onChange(nv);
        }
      } else {
        setClick(undefined);
      }
    },
    [onChange, type],
  );

  const onIdle = useCallback((m: google.maps.Map) => {
    setZoom(m.getZoom()!);
    setCenter(m.getCenter()!.toJSON());
  }, []);

  useEffect(() => {
    if (value) {
      if (value.lat !== click?.lat || value.lng !== click.lng) {
        setClick(value);
      }
    } else {
      setClick(value);
    }
  }, [value]);

  const actions = useMemo(
    () => [
      <Input readOnly key="zoom" addonBefore="层级" value={zoom} />,
      <Input readOnly key="center" addonBefore="中心点" value={`${center.lat}, ${center.lng}`} />,
      <Input
        readOnly
        key="click"
        addonBefore="经纬度"
        value={`${click?.lat || 0}, ${click?.lng || 0}`}
        addonAfter={<Copy value={`${click?.lat || 0}, ${click?.lng || 0}`} />}
      />,
      <div key="country" style={{ display: 'flex' }}>
        <Button key="button" type="text">
          切换至:
        </Button>
        <Select
          key="select"
          style={{ width: '90px' }}
          onSelect={(val) => {
            const cm = centerMap[val as string];
            setCenter({
              lat: cm.lat,
              lng: cm.lng,
            });
            setZoom(cm.zoom || 5);
          }}
        >
          {Object.keys(centerMap).map((key) => {
            return (
              <Select.Option key={key} value={key}>
                {centerMap[key].i18nKey}
              </Select.Option>
            );
          })}
        </Select>
      </div>,
    ],
    [center.lat, center.lng, click],
  );

  const mainDom = useMemo(
    () => (
      <Wrapper apiKey={GoogleMapUtils.getKey()} language={GoogleMapUtils.getLang()}>
        <Map center={center} onClick={onClick} onIdle={onIdle} zoom={zoom}>
          {click && <Marker key="click" position={click} />}
        </Map>
      </Wrapper>
    ),
    [center, click, onClick, onIdle, zoom],
  );

  return (
    <>
      {type === 'card' && (
        <Card
          hidden={!show}
          style={{ height: '100%' }}
          bodyStyle={{ height: '100%', padding: 0 }}
          actions={actions}
        >
          {mainDom}
        </Card>
      )}
      {type === 'modal' && (
        <Modal
          closable={false}
          width="1000px"
          visible={show}
          bodyStyle={{ height: '600px', padding: 0 }}
          footer={
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <Space>{actions}</Space>
              <Space style={{ marginLeft: '5px' }}>
                <Button
                  onClick={() => {
                    onShow(false);
                    setClick(value);
                  }}
                >
                  取消
                </Button>
                <Button
                  type="primary"
                  onClick={() => {
                    onShow(false);
                    onChange(click);
                  }}
                >
                  保存
                </Button>
              </Space>
            </div>
          }
          onCancel={() => {
            onShow(false);
            setClick(value);
          }}
          onOk={() => {
            onShow(false);
            onChange(click);
          }}
        >
          {mainDom}
        </Modal>
      )}
    </>
  );
};
