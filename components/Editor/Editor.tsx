"use client";

import type EditorJS from "@editorjs/editorjs";
import { FC, useEffect, useRef } from "react";
import { imageUploader } from "./imageUploader";

import "./Editor.scss";
import { OutputData } from "@editorjs/editorjs";

export const Editor: FC<{
  initialData?: OutputData;
  onChange: (data: OutputData) => void;
}> = (props) => {
  const editor = useRef<EditorJS>();
  const id = "editor";

  useEffect(() => {
    Promise.all([
      import("@editorjs/editorjs"),
      // @ts-ignore
      import("@editorjs/header"),
      // @ts-ignore
      import("@editorjs/image"),
    ]).then(
      ([
        { default: EditorJS },
        { default: Header },
        { default: ImageTool },
      ]) => {
        if (editor.current) return;

        editor.current = new EditorJS({
          holder: id,
          tools: {
            header: Header,
            image: {
              class: ImageTool,
              config: {
                uploader: imageUploader,
              },
            },
          },
          data: props.initialData,
          onChange: () => {
            editor.current?.save().then(props.onChange);
          },
        });
      }
    );
  }, []);

  return <div id={id}></div>;
};
