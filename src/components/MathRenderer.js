import React from 'react';
import 'katex/dist/katex.min.css';
import katex from 'katex';

const MathRenderer = ({ content }) => {
  if (!content) return null;

  // Function to render LaTeX equations in HTML content
  const renderMathInHTML = (html) => {
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = html;

    // Find all LaTeX patterns: $$...$$ (display mode) and $...$ (inline mode)
    const processNode = (node) => {
      if (node.nodeType === Node.TEXT_NODE) {
        const text = node.textContent;
        
        // Check if text contains LaTeX
        if (text.includes('$') || text.includes('$$')) {
          const fragment = document.createDocumentFragment();
          let lastIndex = 0;
          
          // Process display math ($$...$$)
          const displayMathRegex = /\$\$(.*?)\$\$/gs;
          const replacements = [];
          
          // First, handle display math
          let displayMatch = displayMathRegex.exec(text);
          while (displayMatch !== null) {
            const matchIndex = displayMatch.index;
            const matchLength = displayMatch[0].length;
            const matchLatex = displayMatch[1];
            replacements.push({
              start: matchIndex,
              end: matchIndex + matchLength,
              latex: matchLatex,
              display: true
            });
            displayMatch = displayMathRegex.exec(text);
          }
          
          // Then handle inline math ($...$) but avoid already processed display math
          const inlineMathRegex = /\$([^$]+?)\$/g;
          let inlineMatch = inlineMathRegex.exec(text);
          while (inlineMatch !== null) {
            const matchIndex = inlineMatch.index;
            const matchLength = inlineMatch[0].length;
            const matchLatex = inlineMatch[1];
            
            // Check if this match is not inside a display math block
            const isInsideDisplay = replacements.some(r => 
              matchIndex >= r.start && matchIndex < r.end
            );
            if (!isInsideDisplay) {
              replacements.push({
                start: matchIndex,
                end: matchIndex + matchLength,
                latex: matchLatex,
                display: false
              });
            }
            inlineMatch = inlineMathRegex.exec(text);
          }
          
          // Sort replacements by start position
          replacements.sort((a, b) => a.start - b.start);
          
          // Build the result
          replacements.forEach((replacement) => {
            // Add text before this math
            if (replacement.start > lastIndex) {
              const textNode = document.createTextNode(text.substring(lastIndex, replacement.start));
              fragment.appendChild(textNode);
            }
            
            // Add rendered math
            const span = document.createElement('span');
            try {
              katex.render(replacement.latex, span, {
                displayMode: replacement.display,
                throwOnError: false,
                strict: false
              });
            } catch (e) {
              console.error('KaTeX rendering error:', e);
              span.textContent = replacement.display ? `$$${replacement.latex}$$` : `$${replacement.latex}$`;
            }
            fragment.appendChild(span);
            
            lastIndex = replacement.end;
          });
          
          // Add remaining text
          if (lastIndex < text.length) {
            const textNode = document.createTextNode(text.substring(lastIndex));
            fragment.appendChild(textNode);
          }
          
          if (replacements.length > 0) {
            node.parentNode.replaceChild(fragment, node);
          }
        }
      } else if (node.nodeType === Node.ELEMENT_NODE) {
        // Process child nodes
        Array.from(node.childNodes).forEach(child => processNode(child));
      }
    };

    processNode(tempDiv);
    return tempDiv.innerHTML;
  };

  const renderedHTML = renderMathInHTML(content);

  return (
    <div 
      dangerouslySetInnerHTML={{ __html: renderedHTML }}
      style={{ lineHeight: '1.8' }}
    />
  );
};

export default MathRenderer;
