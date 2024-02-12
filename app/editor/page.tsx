"use client";

import { Editor } from "@/components/Editor/Editor";
import { Button } from "@/components/ui/button";
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarTrigger,
} from "@/components/ui/menubar";
import { Theme, useTheme } from "@/context/ThemeContext";
import { OutputData } from "@editorjs/editorjs";

import { useState } from "react";

export default function EditorPage() {
  const theme = useTheme();

  const [editorData, setEditorData] = useState<{
    key: string;
    data?: OutputData;
  }>({
    key: crypto.randomUUID(),
  });
  const [editingFile, setEditingFile] = useState<{
    fileHandle: FileSystemFileHandle;
    hasUnsavedChanges: boolean;
  }>();

  const handleSave = async () => {
    if (editingFile) {
      await saveToFile(editingFile.fileHandle);
      return;
    }

    const fileHandle = await window.showSaveFilePicker({
      suggestedName: "untitled.txt",
      types: [{ accept: { "text/plain": [".txt"] } }],
    });
    await saveToFile(fileHandle);
  };

  const saveToFile = async (fileHandle: FileSystemFileHandle) => {
    const writableStream = await fileHandle.createWritable({
      keepExistingData: false,
    });
    await writableStream.write({
      type: "write",
      data: JSON.stringify(editorData.data),
    });
    await writableStream.close();
    setEditingFile({ fileHandle, hasUnsavedChanges: false });
  };

  const handleOpen = async () => {
    const [fileHandle] = await window.showOpenFilePicker({
      multiple: false,
      types: [{ accept: { "text/plain": [".txt"] } }],
    });
    const file = await fileHandle.getFile();
    const text = await file.text();
    setEditorData({ key: crypto.randomUUID(), data: JSON.parse(text) });
    setEditingFile({ fileHandle, hasUnsavedChanges: false });
  };

  const handleNew = () => {
    setEditorData({ key: crypto.randomUUID() });
    setEditingFile(undefined);
  };

  const canSave = !editingFile || editingFile.hasUnsavedChanges;

  return (
    <div>
      <div className="max-w-[660px] mx-auto py-[16px] px-[8px] flex gap-[24px] items-center">
        <div className="flex-none">
          <Menubar>
            <MenubarMenu>
              <MenubarTrigger>File</MenubarTrigger>
              <MenubarContent>
                <MenubarItem onClick={handleNew}>New</MenubarItem>
                <MenubarItem onClick={handleOpen}>Open</MenubarItem>
                <MenubarItem onClick={handleSave} disabled={!canSave}>
                  Save
                </MenubarItem>
              </MenubarContent>
            </MenubarMenu>
            <MenubarMenu>
              <MenubarTrigger>Settings</MenubarTrigger>
              <MenubarContent>
                <MenubarItem
                  onClick={() => {
                    const switchThemeMap: Record<Theme, Theme> = {
                      dark: "light",
                      light: "dark",
                    };
                    theme.switchTheme(switchThemeMap[theme.activeTheme]);
                  }}
                >
                  Switch to{" "}
                  {{ dark: "light", light: "dark" }[theme.activeTheme]} theme
                </MenubarItem>
              </MenubarContent>
            </MenubarMenu>
          </Menubar>
        </div>
        <div className="flex-1 flex flex-col items-start text-xs">
          {editingFile && <div>{editingFile.fileHandle.name}</div>}
          {!editingFile ||
            (editingFile.hasUnsavedChanges && (
              <div className="text-sm text-muted-foreground">
                Unsaved changes
              </div>
            ))}
        </div>
        <div className="flex-none">
          <Button
            onClick={handleSave}
            disabled={!canSave}
            size="sm"
            variant="secondary"
          >
            Save
          </Button>
        </div>
      </div>

      <Editor
        key={editorData?.key}
        initialData={editorData?.data}
        onChange={(data) => {
          setEditorData((prevState) => ({ ...prevState, data }));
          setEditingFile((prevState) =>
            prevState ? { ...prevState, hasUnsavedChanges: true } : prevState
          );
        }}
      />
    </div>
  );
}
