// import type { EditorProps } from '.';
// import WangEditor from 'wangeditor';
// import { useState, useEffect } from 'react';

// const editorId = 'wang-editor-dom';
// export default ({ value, onChange, uploadImage }: EditorProps) => {
//   const [editor, setEditor] = useState<WangEditor>();
//   const [content, setContent] = useState<string>();

//   useEffect(() => {
//     const we = new WangEditor(`#${editorId}`);
//     setEditor(we);

//     we.config.onchange = (val: string) => {
//       if (onChange) {
//         onChange(val);
//       }
//     };

//     we.config.customUploadImg = (files, insertImg)=>{
//         console.log(files,insertImg);

//     }

//     we.create();

//     return () => {
//       we.destroy();
//     };
//   }, [onChange]);

//   useEffect(() => {
//     if (value !== editor?.txt.html()) {
//       editor?.txt.html(value);
//     }
//   }, [editor, value]);

//   return (
//     <>
//       <div id={editorId}></div>
//     </>
//   );
// };
