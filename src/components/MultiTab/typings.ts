export type MultiTabRef = {
  switch: (key: string, dom?: any) => void;
  update: (key: string, dom: any) => void;
  get: (key: string) => any;
};

export type MultiTabProps = {
  multiTabRef: React.MutableRefObject<MultiTabRef | undefined>;
};

export type MultiTabPaneProps = {
  key: string;
  tab: string;
};
