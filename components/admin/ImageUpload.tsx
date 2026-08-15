'use client';

import Image from 'next/image';
import { useRef, useState } from 'react';
import styled from 'styled-components';

/* ─── Styled Components ─────────────────────────────────────────────────── */

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

const DropZone = styled.label<{ $dragging: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 2rem;
  border: 2px dashed ${({ $dragging, theme }) => $dragging ? '#FF6B35' : theme.colors.border};
  border-radius: 8px;
  cursor: pointer;
  transition: border-color 0.2s ease, background 0.2s ease;
  background: ${({ $dragging, theme }) => $dragging ? 'rgba(255, 107, 53, 0.05)' : theme.colors.bg};

  &:hover {
    border-color: #FF6B35;
  }
`;

const DropText = styled.p`
  font-family: var(--font-body);
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.textMuted};
  text-align: center;
`;

const PreviewImg = styled.div`
  position: relative;
  width: 100%;
  aspect-ratio: 16/9;
  border-radius: 8px;
  overflow: hidden;
  background: ${({ theme }) => theme.colors.border};
`;

const RemoveBtn = styled.button`
  align-self: flex-start;
  padding: 0.3rem 0.75rem;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 4px;
  background: none;
  color: ${({ theme }) => theme.colors.textMuted};
  font-family: var(--font-body);
  font-size: 0.75rem;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    border-color: #e74c3c;
    color: #e74c3c;
  }
`;

const StatusText = styled.p`
  font-family: var(--font-body);
  font-size: 0.75rem;
  color: ${({ theme }) => theme.colors.textMuted};
`;

/* ─── Component ──────────────────────────────────────────────────────────── */

type Props = {
  value?: string;
  onChange: (url: string) => void;
  label?: string;
};

export default function ImageUpload({ value, onChange, label }: Props) {
  const [uploading, setUploading] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [error, setError] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  async function uploadFile(file: File) {
    setUploading(true);
    setError('');
    try {
      const form = new FormData();
      form.append('file', file);
      const res = await fetch('/api/admin/upload', { method: 'POST', body: form });
      const json = await res.json();
      if (json.url) {
        onChange(json.url);
      } else {
        setError(json.error ?? 'Upload failed');
      }
    } catch {
      setError('Upload failed — check your Blob token');
    } finally {
      setUploading(false);
    }
  }

  function handleFiles(files: FileList | null) {
    if (!files || files.length === 0) return;
    uploadFile(files[0]);
  }

  return (
    <Wrapper>
      {label && <StatusText>{label}</StatusText>}
      {error && <StatusText style={{ color: '#e74c3c' }}>{error}</StatusText>}

      {value ? (
        <>
          <PreviewImg>
            <Image src={value} alt="Upload preview" fill style={{ objectFit: 'cover' }} />
          </PreviewImg>
          <RemoveBtn type="button" onClick={() => onChange('')}>
            Remove image
          </RemoveBtn>
        </>
      ) : (
        <DropZone
          $dragging={dragging}
          onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragging(false);
            handleFiles(e.dataTransfer.files);
          }}
        >
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            style={{ display: 'none' }}
            onChange={(e) => handleFiles(e.target.files)}
          />
          <DropText>
            {uploading ? 'Uploading...' : 'Click or drag an image here'}
          </DropText>
        </DropZone>
      )}
    </Wrapper>
  );
}
