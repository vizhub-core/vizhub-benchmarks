import { useState, useEffect, lazy, Suspense } from "react";

interface CodeViewerProps {
  challenge: string;
  model: string;
}

// Lazy load the client-side only CodeViewer component
// This prevents SSR issues with CodeMirror while maintaining clean imports
const ClientCodeViewer = lazy(() => import("./CodeViewer.client"));

/**
 * SSR-safe wrapper for the CodeViewer component
 * Uses lazy loading to ensure CodeMirror only loads client-side
 * Following React Router v7 best practices for client-only components
 */
export function CodeViewer({ challenge, model }: CodeViewerProps) {
  const [isClient, setIsClient] = useState(false);

  // Ensure we only render the CodeMirror component on the client side
  // This prevents "Cannot use import statement outside a module" SSR errors
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Show loading state during SSR and hydration
  if (!isClient) {
    return (
      <div className="code-viewer-loading">
        <div className="loading-text">Loading code editor...</div>
      </div>
    );
  }

  // Render the client-side CodeViewer with suspense boundary
  return (
    <Suspense
      fallback={
        <div className="code-viewer-loading">
          <div className="loading-text">Loading code editor...</div>
        </div>
      }
    >
      <ClientCodeViewer challenge={challenge} model={model} />
    </Suspense>
  );
}