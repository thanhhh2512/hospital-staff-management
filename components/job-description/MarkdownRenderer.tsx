import React from "react";

interface MarkdownRendererProps {
  content: string;
}

export function MarkdownRenderer({ content }: MarkdownRendererProps) {
  return (
    <div className="prose prose-sm dark:prose-invert max-w-none">
      {content.split("\n").map((line, index) => {
        if (line.startsWith("# ")) {
          return (
            <h1 key={index} className="text-2xl font-bold mt-4">
              {line.substring(2)}
            </h1>
          );
        } else if (line.startsWith("## ")) {
          return (
            <h2 key={index} className="text-xl font-bold mt-3">
              {line.substring(3)}
            </h2>
          );
        } else if (line.startsWith("### ")) {
          return (
            <h3 key={index} className="text-lg font-bold mt-2">
              {line.substring(4)}
            </h3>
          );
        } else if (line.startsWith("- ")) {
          return (
            <li key={index} className="ml-4">
              {line.substring(2)}
            </li>
          );
        } else if (line.match(/^\d+\. /)) {
          return (
            <li key={index} className="ml-4">
              {line.substring(line.indexOf(" ") + 1)}
            </li>
          );
        } else if (line.startsWith("   - ")) {
          return (
            <li key={index} className="ml-8">
              {line.substring(5)}
            </li>
          );
        } else if (line === "") {
          return <br key={index} />;
        } else {
          return <p key={index}>{line}</p>;
        }
      })}
    </div>
  );
} 