import React, { useEffect, useRef, useState, useCallback } from "react";
import {
  useEditor,
  EditorContent,
  NodeViewWrapper,
  ReactNodeViewRenderer,
} from "@tiptap/react";
import Placeholder from "@tiptap/extension-placeholder";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Underline from "@tiptap/extension-underline";
import { Node } from "@tiptap/core";
import katex from "katex";
import "katex/dist/katex.min.css";
import { debounce } from "lodash";

//
// ------------------------- Math Inline Node + View --------------------------
//
const MathInlineComponent = ({ node, updateAttributes }: any) => {
  const content = node.attrs.content || "";
  const renderedRef = useRef<HTMLSpanElement | null>(null);

  useEffect(() => {
    if (!renderedRef.current) return;
    try {
      renderedRef.current.innerHTML = "";
      katex.render(content, renderedRef.current, {
        throwOnError: false,
        displayMode: false,
      });
    } catch {
      renderedRef.current.innerHTML = `<span style="color:red;">Err</span>`;
    }
  }, [content]);

  const handleEdit = useCallback(() => {
    const newContent = prompt("Edit LaTeX:", content);
    if (newContent !== null && newContent.trim() !== content.trim()) {
      updateAttributes({ content: newContent.trim() });
    }
  }, [content, updateAttributes]);

  return (
    <NodeViewWrapper as="span" className="math-inline-wrapper">
      <span
        ref={renderedRef}
        onClick={handleEdit}
        className="math-inline"
        style={{ cursor: "pointer", padding: "0 2px" }}
      />
    </NodeViewWrapper>
  );
};

const MathInlineNode = Node.create({
  name: "mathInline",
  inline: true,
  group: "inline",
  atom: true,

  addAttributes() {
    return { content: { default: "" } };
  },

  parseHTML() {
    return [
      {
        tag: 'span[data-type="math-inline"]',
        getAttrs: (el) => ({
          content: (el as HTMLElement).getAttribute("data-content") || "",
        }),
      },
    ];
  },

  renderHTML({ node }) {
    return [
      "span",
      {
        "data-type": "math-inline",
        "data-content": node.attrs.content,
        class: "math-inline",
      },
    ];
  },

  addNodeView() {
    return ReactNodeViewRenderer(MathInlineComponent);
  },

  addCommands() : any {
    return {
      addMathInline:
        (content: string) =>
        ({ chain }: any) =>
          chain()
            .insertContent({ type: this.name, attrs: { content } })
            .focus()
            .run(),
    };
  },
});

//
// ------------------------------ Editor Component ---------------------------
//
type Props = {
  value: string;
  handleChange: (html: string) => void;
  error?: boolean;
};

const TiptapEditor: React.FC<Props> = ({ value, handleChange, error }) => {
  const [mathModal, setMathModal] = useState(false);
  const [mathContent, setMathContent] = useState("");
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const debouncedUpdate = useRef(
    debounce((html: string) => handleChange(html), 300)
  ).current;

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Image.configure({
        HTMLAttributes: {
          class: "editor-image",
          style: "max-width:100%;height:auto;",
        },
        inline: false,
        allowBase64: true,
      }),
      MathInlineNode,
      Placeholder.configure({
        placeholder: "Tulis sesuatu di sini...",
        emptyEditorClass: "is-editor-empty",
        showOnlyWhenEditable: true,
      }),
    ],
    content: value || "",
    autofocus: false,
    onUpdate: ({ editor }) => {
      // gunakan debounce agar tidak delay saat mengetik
      debouncedUpdate(editor.getHTML());
    },
  });

  // Sinkronisasi saat `value` berubah dari luar
  useEffect(() => {
    if (!editor) return;
    const current = editor.getHTML();
    if (value !== current) editor.commands.setContent(value || "");
  }, [value, editor]);

  // Upload gambar
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !editor) return;

    const reader = new FileReader();
    reader.onload = () => {
      editor.chain().focus().setImage({ src: reader.result as string }).run();
      debouncedUpdate(editor.getHTML());
    };
    reader.readAsDataURL(file);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleAddMath = () => {
    if (!mathContent.trim() || !editor) return;
    (editor.chain() as any).focus().addMathInline(mathContent.trim()).run();
    setMathContent("");
    setMathModal(false);
    debouncedUpdate(editor.getHTML());
  };

  if (!editor) return <div>Memuat editor...</div>;

  return (
    <div
      style={{
        border: error ? "1px solid #dc3545" : "1px solid #ddd",
        borderRadius: 8,
        background: "white",
        width: "100%",
      }}
    >
      {/* Toolbar kecil */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 4,
          flexWrap: "wrap",
          padding: "6px 8px",
          background: "#f9fafb",
          borderBottom: "1px solid #eee",
        }}
      >
        <ToolbarButton
          label="B"
          active={editor.isActive("bold")}
          onClick={() => editor.chain().focus().toggleBold().run()}
        />
        <ToolbarButton
          label="I"
          active={editor.isActive("italic")}
          onClick={() => editor.chain().focus().toggleItalic().run()}
          italic
        />
        <ToolbarButton
          label="U"
          active={editor.isActive("underline")}
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          underline
        />

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          style={{ display: "none" }}
          onChange={handleImageUpload}
        />
        <ToolbarButton
          label="🖼️"
          onClick={() => fileInputRef.current?.click()}
        />
        <ToolbarButton label="∑" onClick={() => setMathModal(true)} />
      </div>

      <EditorContent
        editor={editor}
        className="editor-box"
        style={{
          fontSize : 14,
          padding: 10,
          borderRadius: 6,
          backgroundColor: "white",
          outline: "none",
        }}
      />

      {/* Modal Math */}
      {mathModal && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.45)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 9999,
          }}
        >
          <div
            style={{
              width: "90%",
              maxWidth: 480,
              background: "white",
              borderRadius: 8,
              padding: 18,
              boxShadow: "0 8px 30px rgba(0,0,0,0.15)",
            }}
          >
            <h3 style={{ marginBottom: 8 }}>Tambah Formula (LaTeX)</h3>
            <textarea
              value={mathContent}
              onChange={(e) => setMathContent(e.target.value)}
              placeholder="Contoh: \\frac{a}{b}, E = mc^2"
              rows={3}
              style={{
                width: "100%",
                border: "1px solid #ccc",
                borderRadius: 6,
                padding: 8,
               
                fontFamily: "monospace",
              }}
            />
            {mathContent && (
              <div
                style={{
                  marginTop: 10,
                  padding: 10,
                  borderRadius: 6,
                  background: "#f8f9fa",
                  textAlign: "center",
                }}
                dangerouslySetInnerHTML={{
                  __html: katex.renderToString(mathContent, {
                    throwOnError: false,
                    displayMode: false,
                  }),
                }}
              />
            )}
            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                gap: 8,
                marginTop: 12,
              }}
            >
              <button
                type="button"
                onClick={() => {
                  setMathModal(false);
                  setMathContent("");
                }}
                className="btn-gray"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleAddMath}
                disabled={!mathContent.trim()}
                className="btn-green"
              >
                Tambah
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
      .editor-box:hover {
    border-color: #9ca3af; /* gray-400 */
  }

  .editor-box:focus-within {
    border-color: #9ca3af; /* tetap abu-abu */
    background-color: #ffffff;
  }

  .editor-box *:focus {
    outline: none;
  }
        .toolbar-btn {
          padding: 4px 6px;
          border-radius: 4px;
          border: 1px solid #e5e7eb;
          background: white;
          cursor: pointer;
          font-size: 12px;
          line-height: 1;
          transition: all .15s;
        }
        .toolbar-btn:hover { background:#f3f4f6; }
        .toolbar-btn.active { background:#0ea5e9; color:white; border-color:#0ea5e9; }
        .btn-gray, .btn-green {
          padding: 6px 12px;
          border: none;
          border-radius: 6px;
          color: white;
        }
        .btn-gray { background:#6c757d; }
        .btn-green { background:#28a745; }
        .btn-green:disabled { background:#ccc; }
        .editor-image { max-width:100%; height:auto; border-radius:6px; margin:8px 0; }
      `}</style>
    </div>
  );
};

const ToolbarButton = ({
  label,
  onClick,
  active,
  italic,
  underline,
}: any) => (
  <button
    type="button"
    onClick={onClick}
    className={`toolbar-btn ${active ? "active" : ""}`}
    style={{
      fontStyle: italic ? "italic" : "normal",
      textDecoration: underline ? "underline" : "none",
    }}
  >
    {label}
  </button>
);

export default TiptapEditor;
