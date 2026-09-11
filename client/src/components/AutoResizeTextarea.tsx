'use client';

import React, { useEffect, useLayoutEffect, useRef, TextareaHTMLAttributes } from 'react';

interface AutoResizeTextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  value: string;
}

export default function AutoResizeTextarea({
  value,
  onChange,
  className = '',
  rows = 1,
  placeholder,
  ...props
}: AutoResizeTextareaProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const adjustHeight = () => {
    const el = textareaRef.current;
    if (el) {
      el.style.height = 'auto';
      el.style.height = `${el.scrollHeight}px`;
    }
  };

  useLayoutEffect(() => {
    adjustHeight();
  }, [value]);

  useEffect(() => {
    adjustHeight();
    const handleResize = () => adjustHeight();
    window.addEventListener('resize', handleResize);

    if (typeof document !== 'undefined' && 'fonts' in document) {
      document.fonts.ready.then(adjustHeight).catch(() => {});
    }

    return () => window.removeEventListener('resize', handleResize);
  }, [value]);

  return (
    <textarea
      ref={textareaRef}
      rows={rows}
      value={value}
      placeholder={placeholder}
      onChange={(e) => {
        adjustHeight();
        onChange?.(e);
      }}
      className={`${className} resize-none overflow-hidden block`}
      {...props}
    />
  );
}

