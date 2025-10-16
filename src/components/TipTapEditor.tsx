import { useCallback, useEffect, useRef, useState } from "react";
import ReactQuill from "react-quill";
import "./component.css";
// import { uploadFile } from "../api/guru/upload";
import Resizer from "react-image-file-resizer";
import "katex/dist/katex.min.css";
import katex from "katex";
import { cn } from "@/lib/utils";
import { debounce } from "lodash";
import { Loader2, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

// Deklarasi global untuk Katex
declare global {
  interface Window {
    katex: typeof katex;
  }
}



// Mock function untuk upload file - ganti dengan implementasi asli
const uploadFile = async (file: File): Promise<{ data: { url: string } }> => {
  // Simulasi upload
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        data: {
          url: URL.createObjectURL(file) // Mock URL
        }
      });
    }, 1000);
  });
};

interface EditorProps {
  value: string;
  handleChange: (content: string) => void;
  error?: boolean;
  placeholder?: string;
  [key: string]: any;
}

interface UploadResponse {
  data: {
    url: string;
  };
}

export default function TextEditor({ value, handleChange, error, ...props }: EditorProps) {
  const reactQuillRef = useRef<ReactQuill>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isEditorReady, setIsEditorReady] = useState(false);

  // Effect untuk mendeteksi ketika editor siap
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsEditorReady(true);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  // Helper function untuk mendapatkan editor instance dengan safety check
  const getEditorInstance = useCallback(() => {
    if (!reactQuillRef.current || !isEditorReady) {
      return null;
    }
    
    try {
      const quill = reactQuillRef.current;
      const editor = quill.getEditor();
      
      // Additional safety check
      if (!editor || !editor.root) {
        return null;
      }
      
      return editor;
    } catch (error) {
      console.warn("Editor not ready yet:", error);
      return null;
    }
  }, [isEditorReady]);

  const imageHandler = useCallback(() => {
    const input = document.createElement("input");
    input.setAttribute("type", "file");
    input.setAttribute("accept", "image/*");
    input.click();
    
    input.onchange = async () => {
      if (input.files && input.files[0]) {
        setIsLoading(true);
        const file = input.files[0];
        
        try {
          const image = await resizeFile(file);
          const res = await uploadFile(image);
          console.log("url", res.data.url);

          const url = res.data.url;
          const editor = getEditorInstance();
          
          if (editor) {
            const range = editor.getSelection();
            if (range) {
              editor.insertEmbed(range.index, "image", url);
            }
          }
        } catch (error) {
          console.error("Upload failed:", error);
          alert("Upload gagal");
        } finally {
          setIsLoading(false);
        }
      }
    };
  }, [getEditorInstance]);

  const renderMath = useCallback(
    debounce(() => {
      const editor = getEditorInstance();
      if (!editor) return;

      try {
        const editorContent = editor.root.innerHTML;
        const latexRegex = /\$(.*?)\$/g;
        const latexMatches = editorContent.match(latexRegex);

        if (latexMatches) {
          const tempDiv = document.createElement('div');
          tempDiv.innerHTML = editorContent;
          
          latexMatches.forEach((latex) => {
            try {
              const rendered = katex.renderToString(latex.replace(/\$/g, ""), {
                throwOnError: false,
                displayMode: latex.includes('\n') || latex.includes('\\[')
              });

              tempDiv.innerHTML = tempDiv.innerHTML.replace(latex, rendered);
            } catch (error) {
              console.error("KaTeX render error:", error);
            }
          });
          
          // Only update if content actually changed
          if (tempDiv.innerHTML !== editorContent) {
            editor.root.innerHTML = tempDiv.innerHTML;
          }
        }
      } catch (error) {
        console.warn("Error during math rendering:", error);
      }
    }, 500),
    [getEditorInstance]
  );

  useEffect(() => {
    const editor = getEditorInstance();
    if (!editor) return;

    // Listen for content changes in Quill editor
    const handleTextChange = () => {
      renderMath();
    };

    editor.on('text-change', handleTextChange);

    return () => {
      try {
        editor.off('text-change', handleTextChange);
      } catch (error) {
        console.warn("Error removing text-change listener:", error);
      }
    };
  }, [getEditorInstance, renderMath]);

  // Handle paste event for image
  const handlePaste = useCallback((event: ClipboardEvent) => {
    const clipboard = event.clipboardData || (window as any).clipboardData;
    const items = clipboard?.items;

    if (items) {
      for (let i = 0; i < items.length; i++) {
        const item = items[i];
        if (item.type.indexOf("image") !== -1) {
          const file = item.getAsFile();
          if (file) {
            setIsLoading(true);
            resizeFile(file).then(async (resizedImage) => {
              try {
                const res = await uploadFile(resizedImage);
                const url = res.data.url;
                const editor = getEditorInstance();
                
                if (editor) {
                  const range = editor.getSelection();
                  if (range) {
                    editor.insertEmbed(range.index, "image", url);
                  }
                }
              } catch (error) {
                console.error("Upload failed:", error);
                alert("Upload gagal");
              } finally {
                setIsLoading(false);
              }
            }).catch(error => {
              console.error("Resize failed:", error);
              setIsLoading(false);
            });
            event.preventDefault();
          }
        }
      }
    }
  }, [getEditorInstance]);

  useEffect(() => {
    const editor = getEditorInstance();
    if (!editor) return;

    // Listen for paste events
    const handlePasteEvent = (e: Event) => handlePaste(e as ClipboardEvent);
    
    editor.root.addEventListener("paste", handlePasteEvent);

    // Cleanup on component unmount
    return () => {
      editor.root.removeEventListener("paste", handlePasteEvent);
    };
  }, [getEditorInstance, handlePaste]);

  // Handle editor ready state
  const handleEditorChange = useCallback((content: string) => {
    handleChange(content);
  }, [handleChange]);

  return (
    <>
      {isLoading && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 50,
          }}
          className="fixed flex items-center justify-center bg-background/80 backdrop-blur-sm"
        >
          <div className="flex flex-col items-center gap-2">
            <Loader2 className="h-8 w-8 animate-spin" />
            <p className="text-sm">Upload File Image</p>
          </div>
        </div>
      )}
      
      <div className="space-y-2">
        <ReactQuill
          ref={reactQuillRef}
          theme="snow"
          className={cn(
            "quill-editor rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2",
            {
              "border-destructive": error,
            }
          )}
          placeholder="Start writing..."
          modules={{
            toolbar: {
              container: [
                [{ header: "1" }, { header: "2" }, { font: [] }],
                [{ size: [] }],
                ["bold", "italic", "underline", "strike", "blockquote"],
                [
                  { list: "ordered" },
                  { list: "bullet" },
                  { indent: "-1" },
                  { indent: "+1" },
                ],
                ["link", "image", "video", "formula"],
                ["code-block"],
              ],
              handlers: {
                image: imageHandler,
              },
              clipboard: {
                matchVisual: false,
              },
            },
            clipboard: {
              matchVisual: false,
            },
          }}
          formats={[
            "header",
            "font",
            "size",
            "bold",
            "italic",
            "underline",
            "strike",
            "blockquote",
            "list",
            "bullet",
            "indent",
            "link",
            "image",
            "video",
            "formula",
            "color",
            "background",
            "align",
            "code-block",
            "script",
            "",
          ]}
          value={value}
          {...props}
          onChange={handleEditorChange}
        />

        {error && (
          <Alert variant="destructive" className="mt-2">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Wajib isi
            </AlertDescription>
          </Alert>
        )}
      </div>
    </>
  );
}

export const resizeFile = async (file: File, rotate?: number): Promise<File> => {
  return new Promise((resolve, reject) => {
    try {
      Resizer.imageFileResizer(
        file,
        1000,
        1200,
        "JPEG",
        50,
        rotate || 0,
        (uri) => {
          resolve(uri as File);
        },
        "file"
      );
    } catch (error) {
      reject(error);
    }
  });
};