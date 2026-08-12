import { FileInput } from '@var-ui/react';
import { useState } from 'react';

export default function Preview() {
  const [file, setFile] = useState<File | null>(null);
  return (
    <FileInput
      label="Upload"
      value={file}
      onChange={(next) => setFile(Array.isArray(next) ? (next[0] ?? null) : next)}
      accept=".pdf,image/*"
    />
  );
}
