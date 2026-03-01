'use client';

import { useState } from 'react';

export function DeleteDocumentButton({
  documentId,
  onDeleted,
}: {
  documentId: string;
  onDeleted?: () => void;
}) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (isDeleting) return;

    const confirmed = window.confirm('Delete this document? This action cannot be undone.');
    if (!confirmed) return;

    setIsDeleting(true);

    try {
      const response = await fetch(`/api/documents/${documentId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Delete failed');
      }

      if (onDeleted) {
        onDeleted();
      } else {
        window.location.reload();
      }
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Delete failed';
      window.alert(message);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <button
      onClick={handleDelete}
      disabled={isDeleting}
      className="rounded border border-red-200 px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60 dark:border-red-900 dark:text-red-400 dark:hover:bg-red-950"
    >
      {isDeleting ? 'Deleting...' : 'Delete'}
    </button>
  );
}
