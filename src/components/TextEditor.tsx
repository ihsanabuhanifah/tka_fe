import React, { useEffect, useRef, useState } from "react";
import { useEditor, EditorContent, NodeViewWrapper, ReactNodeViewRenderer } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import Image from "@tiptap/extension-image";
import Underline from "@tiptap/extension-underline";
import { Node } from "@tiptap/core";
import katex from "katex";
import "katex/dist/katex.min.css";
import { debounce } from "lodash";
import "prosemirror-view/style/prosemirror.css";

// ------------------------- Math Inline Node + View --------------------------
const MathInlineComponent = ({ node, updateAttributes, openMathModal }: any) => {
  const content = node.attrs.content || "";
  const renderedRef = useRef<HTMLSpanElement | null>(null);

  useEffect(() => {
    if (!renderedRef.current) return;
    try {
      renderedRef.current.innerHTML = "";
      katex.render(content, renderedRef.current, { throwOnError: false, displayMode: false });
    } catch {
      renderedRef.current.innerHTML = `<span style="color:red;">Err</span>`;
    }
  }, [content]);

  const handleClick = () => {
    openMathModal(node, updateAttributes, content);
  };

  return (
    <NodeViewWrapper as="span" className="math-inline-wrapper">
      <span ref={renderedRef} onClick={handleClick} style={{ cursor: "pointer", padding: "0 2px" }} />
    </NodeViewWrapper>
  );
};

const MathInlineNode = Node.create({
  name: "mathInline",
  inline: true,
  group: "inline",
  atom: true,
  addAttributes() { return { content: { default: "" } }; },
  parseHTML() { return [{ tag: 'span[data-type="math-inline"]', getAttrs: (el) => ({ content: (el as HTMLElement).getAttribute("data-content") || "" }) }]; },
  renderHTML({ node }) { return ["span", { "data-type": "math-inline", "data-content": node.attrs.content, class: "math-inline" }]; },
  addNodeView() {
    return ReactNodeViewRenderer((props) => <MathInlineComponent {...props} openMathModal={(props.editor as any)?.options?.openMathModal} />);
  },
  addCommands(): any { return { addMathInline: (content: string) => ({ chain }: any) => chain().insertContent({ type: this.name, attrs: { content } }).focus().run() }; },
});

// ------------------------------ Editor Component ---------------------------
type Props = { value: string; handleChange: (html: string) => void; error?: boolean };

const TiptapEditor: React.FC<Props> = ({ value, handleChange, error }) => {
  const [mathModal, setMathModal] = useState(false);
  const [mathContent, setMathContent] = useState("");
  const [editingNode, setEditingNode] = useState<any>(null);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const debouncedUpdate = useRef(debounce((html: string) => handleChange(html), 300)).current;

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Image.configure({ HTMLAttributes: { className: "editor-image", style: "max-width:100%;height:auto;" }, inline: false, allowBase64: true }),
      MathInlineNode,
      Placeholder.configure({ placeholder: "Tulis sesuatu di sini...", emptyEditorClass: "is-editor-empty", showOnlyWhenEditable: true }),
    ],
    content: value || "",
    onUpdate: ({ editor }) => debouncedUpdate(editor.getHTML()),
  });

  useEffect(() => {
    if (!editor) return;
    (editor as any).options.openMathModal = (node: any, updateAttributes: any, content: string) => {
      setEditingNode({ node, updateAttributes });
      setMathContent(content);
      setMathModal(true);
    };
  }, [editor]);

  useEffect(() => { if (!editor) return; const current = editor.getHTML(); if (value !== current) editor.commands.setContent(value || ""); }, [value, editor]);

  // Shortcut Ctrl/Cmd + F hanya ketika editor fokus
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "f") {
        if (!editor || !editor.isFocused) return;
        e.preventDefault();
        setEditingNode(null);
        setMathContent("");
        setMathModal(true);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [editor]);

  // Auto focus textarea modal
  useEffect(() => {
    if (mathModal && textareaRef.current) {
      textareaRef.current.focus();
      textareaRef.current.setSelectionRange(textareaRef.current.value.length, textareaRef.current.value.length);
    }
  }, [mathModal]);

  const handleAddMath = () => {
    if (!mathContent.trim() || !editor) return;
    if (editingNode) {
      editingNode.updateAttributes({ content: mathContent.trim() });
      setEditingNode(null);
    } else {
      (editor.chain() as any).focus().addMathInline(mathContent.trim()).run();
    }
    setMathContent("");
    setMathModal(false);
    debouncedUpdate(editor.getHTML());
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; if (!file || !editor) return;
    const reader = new FileReader();
    reader.onload = () => { editor.chain().focus().setImage({ src: reader.result as string }).run(); debouncedUpdate(editor.getHTML()); };
    reader.readAsDataURL(file);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  if (!editor) return <div>Memuat editor...</div>;

  return (
    <div style={{ border: error ? "1px solid #dc3545" : "1px solid #ddd", borderRadius: 8, background: "white", width: "100%" }}>
      {/* Toolbar */}
      <div style={{ display: "flex", alignItems: "center", gap: 4, flexWrap: "wrap", padding: "6px 8px", background: "#f9fafb", borderBottom: "1px solid #eee" }}>
        <ToolbarButton label="B" active={editor.isActive("bold")} onClick={() => editor.chain().focus().toggleBold().run()} />
        <ToolbarButton label="I" active={editor.isActive("italic")} onClick={() => editor.chain().focus().toggleItalic().run()} italic />
        <ToolbarButton label="U" active={editor.isActive("underline")} onClick={() => editor.chain().focus().toggleUnderline().run()} underline />
        <input ref={fileInputRef} type="file" accept="image/*" style={{ display: "none" }} onChange={handleImageUpload} />
        <ToolbarButton label="🖼️" onClick={() => fileInputRef.current?.click()} />
        <ToolbarButton label="∑" onClick={() => { setEditingNode(null); setMathContent(""); setMathModal(true); }} />
      </div>

      <EditorContent editor={editor} className="editor-box" style={{ fontSize: 14, padding: 10, borderRadius: 6, backgroundColor: "white", outline: "none", whiteSpace: "pre-wrap" }} />

      {/* Modal Math */}
      {mathModal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 9999 }}>
          <div style={{ width: "90%", maxWidth: 480, background: "white", borderRadius: 8, padding: 18, boxShadow: "0 8px 30px rgba(0,0,0,0.15)" }}>
            <h3 style={{ marginBottom: 8 }}>Tambah/Ubah Formula (LaTeX)</h3>
            <textarea
              ref={textareaRef}
              value={mathContent}
              onChange={(e) => setMathContent(e.target.value)}
              placeholder="Contoh: \\frac{a}{b}, E = mc^2"
              rows={3}
              style={{ width: "100%", border: "1px solid #ccc", borderRadius: 6, padding: 8, fontFamily: "monospace" }}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleAddMath(); }
                if (e.key === "Escape") { setMathModal(false); setEditingNode(null); setMathContent(""); }
              }}
            />
            {mathContent && (
              <div style={{ marginTop: 10, padding: 10, borderRadius: 6, background: "#f8f9fa", textAlign: "center" }}
                   dangerouslySetInnerHTML={{ __html: katex.renderToString(mathContent, { throwOnError: false, displayMode: false }) }} />
            )}
            <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, marginTop: 12 }}>
              <button type="button" onClick={() => { setMathModal(false); setEditingNode(null); setMathContent(""); }} className="btn-gray">Batal</button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .editor-box:hover { border-color: #9ca3af; }
        .editor-box:focus-within { border-color: #9ca3af; background-color: #ffffff; }
        .editor-box *:focus { outline: none; }
        .toolbar-btn { padding: 4px 6px; border-radius: 4px; border: 1px solid #e5e7eb; background: white; cursor: pointer; font-size: 12px; line-height: 1; transition: all .15s; }
        .toolbar-btn:hover { background:#f3f4f6; }
        .toolbar-btn.active { background:#0ea5e9; color:white; border-color:#0ea5e9; }
        .btn-gray { padding: 6px 12px; border: none; border-radius: 6px; color: white; background:#6c757d; }
        .editor-image { max-width:100%; height:auto; border-radius:6px; margin:8px 0; }
      `}</style>
    </div>
  );
};

const ToolbarButton = ({ label, onClick, active, italic, underline }: any) => (
  <button type="button" onClick={onClick} className={`toolbar-btn ${active ? "active" : ""}`} style={{ fontStyle: italic ? "italic" : "normal", textDecoration: underline ? "underline" : "none" }}>{label}</button>
);

export default TiptapEditor;
