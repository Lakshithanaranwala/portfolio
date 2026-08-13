'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import { useEffect } from 'react';
import styled from 'styled-components';

/* ─── Styled Components ─────────────────────────────────────────────────── */

const EditorWrapper = styled.div`
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 8px;
  overflow: hidden;
  transition: border-color 0.2s ease;

  &:focus-within {
    border-color: #FF6B35;
  }
`;

const Toolbar = styled.div`
  display: flex;
  gap: 0.25rem;
  padding: 0.5rem 0.75rem;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  background: ${({ theme }) => theme.colors.bg};
  flex-wrap: wrap;
`;

const ToolBtn = styled.button<{ $active?: boolean }>`
  padding: 0.3rem 0.6rem;
  border-radius: 4px;
  border: none;
  background: ${({ $active, theme }) => $active ? '#FF6B35' : theme.colors.border};
  color: ${({ $active, theme }) => $active ? '#fff' : theme.colors.text};
  font-family: var(--font-body);
  font-size: 0.75rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.15s ease;

  &:hover {
    background: ${({ $active }) => $active ? '#e05a26' : '#FF6B35'};
    color: #fff;
  }
`;

const Content = styled.div`
  .ProseMirror {
    padding: 1rem;
    min-height: 8rem;
    outline: none;
    font-family: var(--font-body);
    font-size: 0.9375rem;
    line-height: 1.75;
    color: ${({ theme }) => theme.colors.text};

    p {
      margin-bottom: 0.75rem;

      &:last-child {
        margin-bottom: 0;
      }
    }

    p.is-editor-empty:first-child::before {
      content: attr(data-placeholder);
      color: ${({ theme }) => theme.colors.textMuted};
      float: left;
      pointer-events: none;
      height: 0;
    }

    ul, ol {
      padding-left: 1.5rem;
      margin-bottom: 0.75rem;
    }

    strong { font-weight: 700; }
    em { font-style: italic; }
  }
`;

/* ─── Component ──────────────────────────────────────────────────────────── */

type Props = {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
};

export default function RichTextEditor({ value, onChange, placeholder }: Props) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({ placeholder: placeholder ?? 'Start writing...' }),
    ],
    content: value,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    immediatelyRender: false,
  });

  // Sync external value changes (e.g. when switching tabs)
  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value, { emitUpdate: false });
    }
  }, [value, editor]);

  if (!editor) return null;

  return (
    <EditorWrapper>
      <Toolbar>
        <ToolBtn
          onClick={() => editor.chain().focus().toggleBold().run()}
          $active={editor.isActive('bold')}
          type="button"
        >
          B
        </ToolBtn>
        <ToolBtn
          onClick={() => editor.chain().focus().toggleItalic().run()}
          $active={editor.isActive('italic')}
          type="button"
        >
          I
        </ToolBtn>
        <ToolBtn
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          $active={editor.isActive('bulletList')}
          type="button"
        >
          UL
        </ToolBtn>
        <ToolBtn
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          $active={editor.isActive('orderedList')}
          type="button"
        >
          OL
        </ToolBtn>
        <ToolBtn
          onClick={() => editor.chain().focus().setParagraph().run()}
          $active={editor.isActive('paragraph')}
          type="button"
        >
          P
        </ToolBtn>
      </Toolbar>
      <Content>
        <EditorContent editor={editor} />
      </Content>
    </EditorWrapper>
  );
}
