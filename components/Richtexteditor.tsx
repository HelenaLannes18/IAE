"use client";

import React, { useCallback } from 'react';
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
            className={`p-1.5 rounded transition-colors ${isActive ? 'bg-[#16243A] text-[#F3F1EC]' : 'hover:bg-[#C7BFB3]/40 text-[#3A3733]'}`}
        >
            {children}
        </button>
    );
}

export default function RichTextEditor({ content, onChange, placeholder }: RichTextEditorProps) {
    const editor = useEditor({
        extensions: [
            StarterKit,
            Underline,
            ImageExtension.configure({
                HTMLAttributes: { class: 'rounded-lg max-w-full' }
            }),
            Link.configure({
                openOnClick: false,
                HTMLAttributes: { class: 'text-[#16243A] underline' }
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

    const addImage = useCallback(() => {
        const url = window.prompt('Cole a URL da imagem:');
        if (url && editor) {
            editor.chain().focus().setImage({ src: url }).run();
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
        <div className="border border-[#C7BFB3] rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-[#16243A]/20 focus-within:border-[#16243A] transition-all bg-white">
            <div className="flex flex-wrap gap-1 border-b border-[#C7BFB3]/50 p-2 bg-[#F3F1EC]/50">
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

                <div className="w-px bg-[#C7BFB3]/60 mx-1" />

                <ToolbarButton onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} isActive={editor.isActive('heading', { level: 2 })} title="Título">
                    <span className="text-sm font-bold px-1">H2</span>
                </ToolbarButton>
                <ToolbarButton onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} isActive={editor.isActive('heading', { level: 3 })} title="Subtítulo">
                    <span className="text-sm font-bold px-1">H3</span>
                </ToolbarButton>

                <div className="w-px bg-[#C7BFB3]/60 mx-1" />

                <ToolbarButton onClick={() => editor.chain().focus().toggleBulletList().run()} isActive={editor.isActive('bulletList')} title="Lista">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
                </ToolbarButton>
                <ToolbarButton onClick={() => editor.chain().focus().toggleOrderedList().run()} isActive={editor.isActive('orderedList')} title="Lista numerada">
                    <span className="text-sm px-1">1.</span>
                </ToolbarButton>
                <ToolbarButton onClick={() => editor.chain().focus().toggleBlockquote().run()} isActive={editor.isActive('blockquote')} title="Citação">
                    <span className="text-sm px-1">&ldquo;&rdquo;</span>
                </ToolbarButton>

                <div className="w-px bg-[#C7BFB3]/60 mx-1" />

                <ToolbarButton onClick={setLink} isActive={editor.isActive('link')} title="Link">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 010 5.656l-3 3a4 4 0 01-5.656-5.656l1.5-1.5M10.172 13.828a4 4 0 010-5.656l3-3a4 4 0 015.656 5.656l-1.5 1.5" /></svg>
                </ToolbarButton>
                <ToolbarButton onClick={addImage} title="Inserir imagem">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14M14 8h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                </ToolbarButton>

                <div className="w-px bg-[#C7BFB3]/60 mx-1" />

                <ToolbarButton onClick={() => editor.chain().focus().undo().run()} title="Desfazer">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 14l-4-4m0 0l4-4m-4 4h11a4 4 0 010 8h-1" /></svg>
                </ToolbarButton>
                <ToolbarButton onClick={() => editor.chain().focus().redo().run()} title="Refazer">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 14l4-4m0 0l-4-4m4 4H8a4 4 0 000 8h1" /></svg>
                </ToolbarButton>
            </div>

            <EditorContent editor={editor} className="bg-[#F3F1EC]/30 focus-within:bg-white transition-colors" />

            <style jsx global>{`
                .richtext-content h2 { font-size: 1.5rem; font-weight: 700; margin: 1rem 0 0.5rem; color: #16243A; }
                .richtext-content h3 { font-size: 1.25rem; font-weight: 700; margin: 0.75rem 0 0.5rem; color: #16243A; }
                .richtext-content p { margin: 0.5rem 0; line-height: 1.6; }
                .richtext-content strong { font-weight: 700; }
                .richtext-content em { font-style: italic; }
                .richtext-content u { text-decoration: underline; }
                .richtext-content s { text-decoration: line-through; }
                .richtext-content ul { list-style: disc; padding-left: 1.5rem; margin: 0.5rem 0; }
                .richtext-content ol { list-style: decimal; padding-left: 1.5rem; margin: 0.5rem 0; }
                .richtext-content blockquote { border-left: 3px solid #C7BFB3; padding-left: 1rem; margin: 0.75rem 0; color: #6b6b6b; font-style: italic; }
                .richtext-content a { color: #16243A; text-decoration: underline; }
                .richtext-content img { max-width: 100%; border-radius: 0.5rem; margin: 0.75rem 0; }
                .richtext-content p.is-editor-empty:first-child::before {
                    content: attr(data-placeholder);
                    float: left;
                    color: #9A9186;
                    pointer-events: none;
                    height: 0;
                }
            `}</style>
        </div>
    );
}