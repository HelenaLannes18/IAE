"use client";

import React, { useCallback, useRef, useState } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import ImageExtension from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';

interface RichTextEditorProps {
    content: string;
    onChange: (html: string) => void;
    placeholder?: string;
}

function ToolbarButton({
    onClick,
    isActive,
    title,
    children
}: {
    onClick: () => void;
    isActive?: boolean;
    title: string;
    children: React.ReactNode;
}) {
    return (
        <button
            type="button"
            onClick={onClick}
            title={title}
            className={`p-1.5 rounded-lg transition-colors ${isActive ? 'bg-[var(--a-accent)] text-[var(--a-accent-contrast)]' : 'hover:bg-[var(--a-text)]/10 text-[var(--a-muted)]'}`}
        >
            {children}
        </button>
    );
}

export default function RichTextEditor({ content, onChange, placeholder }: RichTextEditorProps) {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isUploadingImage, setIsUploadingImage] = useState(false);

    const editor = useEditor({
        extensions: [
            StarterKit,
            Underline,
            ImageExtension.configure({
                HTMLAttributes: { class: 'rounded-lg max-w-full' }
            }),
            Link.configure({
                openOnClick: false,
                HTMLAttributes: { class: 'text-[var(--a-accent)] underline' }
            }),
            Placeholder.configure({
                placeholder: placeholder || 'Escreva o seu artigo aqui...'
            })
        ],
        content,
        immediatelyRender: false,
        editorProps: {
            attributes: {
                class: 'richtext-content min-h-[280px] px-4 py-3 focus:outline-none'
            }
        },
        onUpdate: ({ editor }) => {
            onChange(editor.getHTML());
        }
    });

    const addImageFromUrl = useCallback(() => {
        const url = window.prompt('Cole a URL da imagem:');
        if (url && editor) {
            editor.chain().focus().setImage({ src: url }).run();
        }
    }, [editor]);

    const addImageFromComputer = useCallback(() => {
        fileInputRef.current?.click();
    }, []);

    const handleImageFileChange = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        e.target.value = '';
        if (!file || !editor) return;

        setIsUploadingImage(true);
        try {
            const body = new FormData();
            body.append('file', file);
            const res = await fetch('/api/upload', { method: 'POST', body });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Falha ao enviar imagem.');
            editor.chain().focus().setImage({ src: data.url }).run();
        } catch (error) {
            alert(error instanceof Error ? error.message : 'Erro ao enviar imagem.');
        } finally {
            setIsUploadingImage(false);
        }
    }, [editor]);

    const setLink = useCallback(() => {
        if (!editor) return;
        const previousUrl = editor.getAttributes('link').href;
        const url = window.prompt('URL do link:', previousUrl || '');

        if (url === null) return;

        if (url === '') {
            editor.chain().focus().extendMarkRange('link').unsetLink().run();
            return;
        }

        editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
    }, [editor]);

    if (!editor) return null;

    return (
        <div className="rounded-2xl overflow-hidden bg-[var(--a-input-bg)] focus-within:ring-2 focus-within:ring-[var(--a-accent)]/30 transition-all">
            <div className="flex flex-wrap gap-1 p-2 bg-black/20">
                <ToolbarButton onClick={() => editor.chain().focus().toggleBold().run()} isActive={editor.isActive('bold')} title="Negrito">
                    <b className="font-serif text-sm px-1">B</b>
                </ToolbarButton>
                <ToolbarButton onClick={() => editor.chain().focus().toggleItalic().run()} isActive={editor.isActive('italic')} title="Itálico">
                    <i className="font-serif text-sm px-1">I</i>
                </ToolbarButton>
                <ToolbarButton onClick={() => editor.chain().focus().toggleUnderline().run()} isActive={editor.isActive('underline')} title="Sublinhado">
                    <span className="underline text-sm px-1">U</span>
                </ToolbarButton>
                <ToolbarButton onClick={() => editor.chain().focus().toggleStrike().run()} isActive={editor.isActive('strike')} title="Riscado">
                    <span className="line-through text-sm px-1">S</span>
                </ToolbarButton>

                <div className="w-px bg-[var(--a-text)]/10 mx-1" />

                <ToolbarButton onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} isActive={editor.isActive('heading', { level: 2 })} title="Título">
                    <span className="text-sm font-bold px-1">H2</span>
                </ToolbarButton>
                <ToolbarButton onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} isActive={editor.isActive('heading', { level: 3 })} title="Subtítulo">
                    <span className="text-sm font-bold px-1">H3</span>
                </ToolbarButton>

                <div className="w-px bg-[var(--a-text)]/10 mx-1" />

                <ToolbarButton onClick={() => editor.chain().focus().toggleBulletList().run()} isActive={editor.isActive('bulletList')} title="Lista">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
                </ToolbarButton>
                <ToolbarButton onClick={() => editor.chain().focus().toggleOrderedList().run()} isActive={editor.isActive('orderedList')} title="Lista numerada">
                    <span className="text-sm px-1">1.</span>
                </ToolbarButton>
                <ToolbarButton onClick={() => editor.chain().focus().toggleBlockquote().run()} isActive={editor.isActive('blockquote')} title="Citação">
                    <span className="text-sm px-1">&ldquo;&rdquo;</span>
                </ToolbarButton>

                <div className="w-px bg-[var(--a-text)]/10 mx-1" />

                <ToolbarButton onClick={setLink} isActive={editor.isActive('link')} title="Link">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 010 5.656l-3 3a4 4 0 01-5.656-5.656l1.5-1.5M10.172 13.828a4 4 0 010-5.656l3-3a4 4 0 015.656 5.656l-1.5 1.5" /></svg>
                </ToolbarButton>
                <ToolbarButton onClick={addImageFromUrl} title="Inserir imagem (URL)">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14M14 8h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                </ToolbarButton>
                <ToolbarButton onClick={addImageFromComputer} title={isUploadingImage ? 'Enviando imagem...' : 'Inserir imagem do computador'}>
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v10a2 2 0 002 2h12a2 2 0 002-2V8l-5-4H6a2 2 0 00-2 2z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 11v6m0-6l-2.5 2.5M12 11l2.5 2.5" /></svg>
                </ToolbarButton>
                <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/png,image/jpeg,image/webp,image/gif,image/svg+xml"
                    className="hidden"
                    onChange={handleImageFileChange}
                />

                <div className="w-px bg-[var(--a-text)]/10 mx-1" />

                <ToolbarButton onClick={() => editor.chain().focus().undo().run()} title="Desfazer">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 14l-4-4m0 0l4-4m-4 4h11a4 4 0 010 8h-1" /></svg>
                </ToolbarButton>
                <ToolbarButton onClick={() => editor.chain().focus().redo().run()} title="Refazer">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 14l4-4m0 0l-4-4m4 4H8a4 4 0 000 8h1" /></svg>
                </ToolbarButton>
            </div>

            <EditorContent editor={editor} className="text-[var(--a-text)]" />

            <style jsx global>{`
                .richtext-content h2 { font-size: 1.5rem; font-weight: 700; margin: 1rem 0 0.5rem; color: var(--a-text); }
                .richtext-content h3 { font-size: 1.25rem; font-weight: 700; margin: 0.75rem 0 0.5rem; color: var(--a-text); }
                .richtext-content p { margin: 0.5rem 0; line-height: 1.6; }
                .richtext-content strong { font-weight: 700; }
                .richtext-content em { font-style: italic; }
                .richtext-content u { text-decoration: underline; }
                .richtext-content s { text-decoration: line-through; }
                .richtext-content ul { list-style: disc; padding-left: 1.5rem; margin: 0.5rem 0; }
                .richtext-content ol { list-style: decimal; padding-left: 1.5rem; margin: 0.5rem 0; }
                .richtext-content blockquote { border-left: 3px solid var(--a-accent); padding-left: 1rem; margin: 0.75rem 0; color: var(--a-muted); font-style: italic; }
                .richtext-content a { color: var(--a-accent); text-decoration: underline; }
                .richtext-content img { max-width: 100%; border-radius: 0.75rem; margin: 0.75rem 0; }
                .richtext-content p.is-editor-empty:first-child::before {
                    content: attr(data-placeholder);
                    float: left;
                    color: var(--a-faint);
                    pointer-events: none;
                    height: 0;
                }
            `}</style>
        </div>
    );
}