import { fileToDataURL } from "./fileToBase64";

export const imageUploader = {
    uploadByFile: async (file: File): Promise<{success: 0|1; file: {url: string;}}> => {
      const dataUrl = await fileToDataURL(file);
      return { success: 1, file: { url: dataUrl }}
    },
    uploadByUrl: async (url: string): Promise<{success: 0|1; file: {url: string;}}> => {
      alert('Not supported. Coming soon!')
      return { success: 0, file: { url: '' }}
    }
  }