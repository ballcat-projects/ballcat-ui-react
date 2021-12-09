import type { CSSProperties } from '@umijs/renderer-react/node_modules/@types/react';

export interface MapProps extends google.maps.MapOptions {
  style?: CSSProperties;
  onClick?: (e: google.maps.MapMouseEvent) => void;
  onIdle?: (map: google.maps.Map) => void;
}

export type LatLng = google.maps.LatLngLiteral;

export const centerMap: Record<
  string,
  {
    i18nKey: string;
    zoom?: number;
  } & LatLng
> = {
  cn: {
    i18nKey: '中国',
    lat: 33.39496652889978,
    lng: 105.94416120063289,
  },
  us: {
    i18nKey: '美国',
    lat: 37.249781061035655,
    lng: -102.16820327466199,
  },
};

export type MarkerMapProps = {
  value?: LatLng;
  onChange?: (val?: LatLng) => void;
  type?: 'modal' | 'card';
  show?: boolean;
  onShow?: (show: boolean) => void;
};
