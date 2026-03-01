'use client';

import { useRef, useState } from 'react';

type UploadResponse = {
  document?: {
    id: string;
    title: string;
  };
  embeddingWarning?: string | null;
  error?: string;
};

export function UploadDocumentButton() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [messageType, setMessageType] = useState<'success' | 'error' | 'warning' | null>(null);

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setMessage(null);
    setMessageType(null);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/documents/upload', {
        method: 'POST',
        body: formData,
      });

      const data = (await response.json()) as UploadResponse;

      if (!response.ok) {
        throw new Error(data.error || 'Upload failed');
      }

      if (data.embeddingWarning) {
        setMessage(data.embeddingWarning);
        setMessageType('warning');
      } else {
        setMessage('Upload thành công. Đang làm mới dữ liệu...');
        setMessageType('success');
      }

      setTimeout(() => {
        window.location.reload();
      }, 700);
    } catch (error: any) {
      setMessage(error.message || 'Upload thất bại');
      setMessageType('error');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  return (
    <div className="flex flex-col items-end gap-2">
      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf,.docx,.txt,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document,text/plain"
        className="hidden"
        onChange={handleFileSelect}
        disabled={isUploading}
      />
      <button
        onClick={() => fileInputRef.current?.click()}
        disabled={isUploading}
        className="rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-70"
      >
        {isUploading ? 'Uploading...' : '+ Upload Document'}
      </button>
      {message && (
        <p
          className={`max-w-xs text-right text-sm ${
            messageType === 'error'
              ? 'text-red-600 dark:text-red-400'
              : messageType === 'warning'
                ? 'text-amber-600 dark:text-amber-400'
                : 'text-green-600 dark:text-green-400'
          }`}
        >
          {message}
        </p>
      )}
    </div>
  );
}
