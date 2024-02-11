export function fileToDataURL(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = (event) => {
      if (typeof reader.result === "string") {
        resolve(reader.result);
      } else {
        reject(reader.error);
      }
    };
    reader.readAsDataURL(file);
  });
}
