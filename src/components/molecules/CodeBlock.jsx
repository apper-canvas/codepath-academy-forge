import React, { useState } from "react";
import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";

const CodeBlock = ({ code, language = "javascript", runnable = false, onRun }) => {
  const [output, setOutput] = useState("");
  const [isRunning, setIsRunning] = useState(false);

  const highlightSyntax = (code, language) => {
    if (!code) return "";
    
    let highlighted = code;
    
    // Keywords
    const keywords = {
      javascript: ['const', 'let', 'var', 'function', 'return', 'if', 'else', 'for', 'while', 'class', 'import', 'export'],
      python: ['def', 'class', 'if', 'else', 'elif', 'for', 'while', 'import', 'from', 'return', 'print'],
      html: ['html', 'head', 'body', 'div', 'span', 'p', 'h1', 'h2', 'h3', 'img', 'a'],
      css: ['color', 'background', 'margin', 'padding', 'border', 'display', 'position', 'width', 'height']
    };

    const langKeywords = keywords[language] || keywords.javascript;
    
    langKeywords.forEach(keyword => {
      const regex = new RegExp(`\\b${keyword}\\b`, 'g');
      highlighted = highlighted.replace(regex, `<span class="syntax-keyword">${keyword}</span>`);
    });

    // Strings
    highlighted = highlighted.replace(/(["'`])(.*?)\1/g, '<span class="syntax-string">$1$2$1</span>');
    
    // Numbers
    highlighted = highlighted.replace(/\b(\d+)\b/g, '<span class="syntax-number">$1</span>');
    
    // Comments
    highlighted = highlighted.replace(/(\/\/.*$|\/\*[\s\S]*?\*\/)/gm, '<span class="syntax-comment">$1</span>');

    return highlighted;
  };

  const handleRun = async () => {
    if (!runnable) return;
    
    setIsRunning(true);
    
    try {
      // Simulate code execution
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (onRun) {
        const result = onRun(code);
        setOutput(result);
      } else {
        // Default output for demo
        setOutput("Code executed successfully!\nOutput: Hello, World!");
      }
    } catch (error) {
      setOutput(`Error: ${error.message}`);
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-surface border border-gray-700 rounded-lg overflow-hidden"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2 bg-gray-800 border-b border-gray-700">
        <div className="flex items-center gap-2">
          <ApperIcon name="Code" size={16} className="text-primary" />
          <span className="text-sm font-medium text-gray-300 capitalize">{language}</span>
        </div>
        {runnable && (
          <Button
            onClick={handleRun}
            disabled={isRunning}
            variant="ghost"
            size="sm"
            className="text-success hover:text-success hover:bg-success/10"
          >
            {isRunning ? (
              <ApperIcon name="Loader2" size={16} className="animate-spin mr-1" />
            ) : (
              <ApperIcon name="Play" size={16} className="mr-1" />
            )}
            {isRunning ? "Running..." : "Run"}
          </Button>
        )}
      </div>

      {/* Code Content */}
      <div className="p-4 font-code text-sm overflow-x-auto">
        <pre className="text-gray-300 leading-relaxed">
          <code
            dangerouslySetInnerHTML={{
              __html: highlightSyntax(code, language)
            }}
          />
        </pre>
      </div>

      {/* Output */}
      {output && (
        <div className="border-t border-gray-700 bg-gray-900">
          <div className="flex items-center gap-2 px-4 py-2 bg-gray-800">
            <ApperIcon name="Terminal" size={16} className="text-success" />
            <span className="text-sm font-medium text-gray-300">Output</span>
          </div>
          <div className="p-4 font-code text-sm">
            <pre className="text-success whitespace-pre-wrap">{output}</pre>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default CodeBlock;