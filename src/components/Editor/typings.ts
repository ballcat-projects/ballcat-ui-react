export type EditorProps = {
  value?: string;
  onChange?: (val: string) => void;
  // 上传图片, 返回图片完整地址  例: http://www.baidu.com/1.jpg
  uploadImage?: (blobs: Blob[]) => Promise<string[]>;
  // 上传视频, 返回视频完整地址  例: http://www.baidu.com/1.mp3, 未指定时不允许上传视频
  uploadVideo?: (blobs: Blob[]) => Promise<string[]>;
  // 上传音频, 返回音频完整地址  例: http://www.baidu.com/1.mp3, 未指定时不允许上传音频
  uploadAudio?: (blobs: Blob[]) => Promise<string[]>;
  readOnly?: boolean;
};

export type WangEditorProps = {
  // editorId?: string;
} & EditorProps;
