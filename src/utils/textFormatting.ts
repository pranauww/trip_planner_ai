import React from 'react';

export const formatText = (text: string): React.ReactNode[] => {
  if (!text) return [];
  
  // Split text by ** markers
  const parts = text.split(/(\*\*.*?\*\*)/g);
  
  return parts.map((part, index) => {
    // Check if this part is wrapped in **
    if (part.startsWith('**') && part.endsWith('**')) {
      // Remove the ** markers and return bold text
      const boldText = part.slice(2, -2);
      return React.createElement('strong', { 
        key: index, 
        className: 'font-semibold' 
      }, boldText);
    }
    
    // Return regular text
    return React.createElement('span', { key: index }, part);
  });
};

export const formatTextWithLineBreaks = (text: string): React.ReactNode[] => {
  if (!text) return [];
  
  // First split by line breaks
  const lines = text.split(/\n/g);
  
  return lines.map((line, lineIndex) => {
    if (line.trim() === '') {
      return React.createElement('br', { key: lineIndex });
    }
    
    // Format each line for bold text
    const formattedLine = formatText(line);
    
    return React.createElement(React.Fragment, { key: lineIndex }, [
      ...formattedLine,
      lineIndex < lines.length - 1 && React.createElement('br', { key: `br-${lineIndex}` })
    ].filter(Boolean));
  });
}; 