import type { WangEditorProps } from '.';
import WangEditor from 'wangeditor';
import { useCallback, useEffect, useState } from 'react';
import FileUtils from '@/utils/FileUtils';
import UrlUtils from '@/utils/UrlUtils';

export default ({
  readOnly,
  value,
  onChange,
  uploadImage,
  uploadVideo,
  uploadAudio,
}: WangEditorProps) => {
  const [editor, setEditor] = useState<WangEditor>();

  const update = useCallback(
    (val: string) => {
      if (onChange) {
        onChange(val);
      }
    },
    [onChange],
  );

  useEffect(() => {
    let we: WangEditor;

    try {
      we = new WangEditor(`#wang-editor-dom`);
    } catch (e) {
      // 组件缓存时. 从有这个组件的页面切换出去会导致这里不停的报错. 找不到 wang-editor-dom Dom.
      // 这里捕获异常就不管了.  切换回来这个组件会重新渲染
      return () => {};
    }

    setEditor(we);
    we.config.onchange = (val: string) => update(val);

    // if(uploadImage){
    we.config.customUploadImg = (files: File[], insertFn: (url: string) => void) => {
      if (uploadImage) {
        // 自定义上传
        uploadImage(files).then((urls) => {
          urls.forEach((url) => {
            insertFn(UrlUtils.resolveImage(url));
          });
        });
      } else {
        // base64解析上传
        files.forEach((file) => {
          FileUtils.getBase64(file).then((b6) => {
            insertFn(b6 as string);
          });
        });
      }
    };

    if (uploadVideo) {
      we.config.customUploadVideo = (files: File[], insertFn: (url: string) => void) => {
        uploadVideo(files).then((urls) => {
          urls.forEach((url) => {
            insertFn(UrlUtils.resolveVideo(url));
          });
        });
      };
    }

    // 用户无操作 200 毫秒更新值
    we.config.onchangeTimeout = 200;
    we.config.zIndex = 100;
    we.create();

    return () => {
      we.destroy();
    };
  }, [uploadImage, uploadVideo, uploadAudio]);

  useEffect(() => {
    if (readOnly) {
      editor?.disable();
    } else {
      editor?.enable();
    }
  }, [editor, readOnly]);

  useEffect(() => {
    if (value !== editor?.txt.html()) {
      editor?.txt.html(value);
    }
  }, [editor, value]);

  return (
    <>
      <div id="wang-editor-dom" />
    </>
  );
};
