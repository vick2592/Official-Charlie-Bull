'use client';

interface CopyButtonProps {
  text: string;
  label?: string;
}

export default function CopyButton({ text, label = '📋 Copy' }: CopyButtonProps) {
  const handleCopy = () => {
    navigator.clipboard.writeText(text);
  };

  return (
    <button 
      onClick={handleCopy}
      className="btn btn-sm btn-primary"
    >
      {label}
    </button>
  );
}
