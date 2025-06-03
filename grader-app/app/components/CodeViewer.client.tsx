import { useState, useEffect } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { javascript } from "@codemirror/lang-javascript";
import { html } from "@codemirror/lang-html";
import { css } from "@codemirror/lang-css";
import { vscodeDark } from "@uiw/codemirror-theme-vscode";

interface CodeFile {
  filename: string;
  content: string;
}

interface CodeViewerProps {
  challenge: string;
  model: string;
}

/**
 * Client-side only CodeViewer component following vzcode patterns for VizHub compatibility
 * Uses .client.tsx extension to prevent SSR issues with CodeMirror
 * Features file tabs, syntax highlighting, and dark theme matching vzcode aesthetic
 */
export default function CodeViewer({ challenge, model }: CodeViewerProps) {
  const [files, setFiles] = useState<CodeFile[]>([]);
  const [activeFile, setActiveFile] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchFiles();
  }, [challenge, model]);

  /**
   * Fetch code files from the API route for the current challenge and model
   * Handles both viz challenges (index.html, data.csv) and code challenges (index.mjs, functions.mjs)
   */
  const fetchFiles = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`/api/code/${challenge}/${model}`);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch files');
      }
      
      setFiles(data.files || []);
      
      // Set default active file - prefer index files, then first available file
      if (data.files && data.files.length > 0) {
        const defaultFile = data.files.find((f: CodeFile) => 
          f.filename === 'index.mjs' || f.filename === 'index.html'
        ) || data.files[0];
        setActiveFile(defaultFile.filename);
      }
      
    } catch (err) {
      console.error('Failed to fetch code files:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Get CodeMirror language extension based on file extension
   * Following vzcode patterns for language detection and syntax highlighting
   * Supports JavaScript/ES modules, HTML, and CSS with appropriate extensions
   */
  const getLanguageExtension = (filename: string) => {
    const ext = filename.split('.').pop()?.toLowerCase();
    switch (ext) {
      case 'mjs':
      case 'js':
        return [javascript({ jsx: true })];
      case 'html':
        return [html()];
      case 'css':
        return [css()];
      default:
        return [];
    }
  };

  const activeFileData = files.find(f => f.filename === activeFile);

  if (loading) {
    return (
      <div className="code-viewer-loading">
        <div className="loading-text">Loading code files...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="code-viewer-error">
        <div className="error-text">Failed to load code: {error}</div>
      </div>
    );
  }

  if (files.length === 0) {
    return (
      <div className="code-viewer-empty">
        <div className="empty-text">No code files found</div>
      </div>
    );
  }

  return (
    <div className="code-viewer" role="region" aria-label="Code viewer">
      {/* File tabs - vzcode style navigation */}
      <div className="file-tabs" role="tablist" aria-label="Code file tabs">
        {files.map((file) => (
          <button
            key={file.filename}
            className={`file-tab ${activeFile === file.filename ? 'active' : ''}`}
            onClick={() => setActiveFile(file.filename)}
            title={`View ${file.filename}`}
            role="tab"
            aria-selected={activeFile === file.filename}
            aria-controls={`code-panel-${file.filename}`}
            aria-label={`View code for ${file.filename}`}
          >
            {file.filename}
          </button>
        ))}
      </div>

      {/* Code editor - vzcode compatible with dark theme */}
      <div 
        className="code-editor-container"
        role="tabpanel"
        id={`code-panel-${activeFile}`}
        aria-labelledby={`tab-${activeFile}`}
        aria-label={`Code content for ${activeFile}`}
      >
        {activeFileData && (
          <CodeMirror
            value={activeFileData.content}
            theme={vscodeDark}
            extensions={getLanguageExtension(activeFileData.filename)}
            readOnly={true}
            basicSetup={{
              lineNumbers: true,
              foldGutter: true,
              autocompletion: false,
              searchKeymap: false,
            }}
            className="code-editor"
          />
        )}
      </div>
    </div>
  );
}