"use client";

import { useState, useEffect, useRef } from "react";
import { Highlight, themes } from "prism-react-renderer";
import { useTheme } from "next-themes";

interface CodeEditorProps {
  language: string;
  value: string;
  onChange: (value: string) => void;
  height?: string;
}

export function CodeEditor({
  language,
  value,
  onChange,
  height,
}: CodeEditorProps) {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const editorRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Sync scroll between textarea and highlighted code
  const handleScroll = () => {
    if (textareaRef.current && editorRef.current) {
      editorRef.current.scrollTop = textareaRef.current.scrollTop;
      editorRef.current.scrollLeft = textareaRef.current.scrollLeft;
    }
  };

  const getPrismLanguage = (lang: string) => {
    const languageMap: Record<string, string> = {
      javascript: "jsx",
      typescript: "tsx",
      python: "python",
      java: "java",
      csharp: "csharp",
      cpp: "cpp",
      ruby: "ruby",
      html: "html",
      css: "css",
      sql: "sql",
    };

    return languageMap[lang] || "jsx";
  };

  if (!mounted) {
    return (
      <div
        className="border rounded-md p-4 bg-muted/50"
        style={height ? { height } : {}}
      >
        Loading editor...
      </div>
    );
  }

  return (
    <div
      className="border rounded-md"
      style={height ? { height, overflow: "auto" } : {}}
    >
      <div className="relative" style={height ? { height } : {}}>
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onScroll={handleScroll}
          className="absolute top-0 bg-transparent left-0 w-full h-full resize-none font-mono p-4 pl-14 z-10 overflow-auto"
          style={{
            color: "transparent",
            caretColor: theme === "dark" ? "white" : "black",
            tabSize: 2,
          }}
          spellCheck="false"
        />

        <div
          ref={editorRef}
          className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none"
        >
          <Highlight
            theme={theme === "dark" ? themes.nightOwl : themes.github}
            code={value || " "} // Ensure there's always at least one character
            language={getPrismLanguage(language)}
          >
            {({ className, style, tokens, getLineProps, getTokenProps }) => (
              <pre className={`${className} p-4 m-0 w-full`} style={style}>
                {tokens.map((line, i) => {
                  return (
                    <div key={i} {...getLineProps({ line, key: i })}>
                      <span className="inline-block w-8 text-right mr-2 text-gray-400 select-none">
                        {i + 1}
                      </span>
                      {line.map((token, key) => {
                        const { key: _, ...rest } = getTokenProps({
                          token,
                          key,
                        });
                        return <span key={key} {...rest} />;
                      })}
                    </div>
                  );
                })}
              </pre>
            )}
          </Highlight>
        </div>
      </div>
    </div>
  );
}
