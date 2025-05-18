"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SendHorizonal } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

interface NaturalLanguageSearchProps {
  id?: string;
  minHeight?: number;
  maxHeight?: number;
  onSearch: (query: string) => void;
  initialQuery?: string;
  className?: string;
}

function useAutoResizeTextarea({
  minHeight,
  maxHeight,
}: {
  minHeight: number;
  maxHeight?: number;
}) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const adjustHeight = useCallback(
    (reset?: boolean) => {
      const textarea = textareaRef.current;
      if (!textarea) return;

      if (reset) {
        textarea.style.height = `${minHeight}px`;
        return;
      }
      textarea.style.height = `${minHeight}px`;
      const newHeight = Math.max(
        minHeight,
        Math.min(
          textarea.scrollHeight,
          maxHeight ?? Number.POSITIVE_INFINITY
        )
      );
      textarea.style.height = `${newHeight}px`;
    },
    [minHeight, maxHeight]
  );

  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = `${minHeight}px`;
    }
  }, [minHeight]);

  useEffect(() => {
    const handleResize = () => adjustHeight();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [adjustHeight]);

  return { textareaRef, adjustHeight };
}

export function NaturalLanguageSearch({
  id = "natural-language-search",
  minHeight = 48,
  maxHeight = 164,
  onSearch,
  initialQuery = '',
  className,
}: NaturalLanguageSearchProps) {
  const { textareaRef, adjustHeight } = useAutoResizeTextarea({
    minHeight,
    maxHeight,
  });
  
  const placeholders = [
    "Search jobs by title, skill, company...",
    "e.g., remote software engineer, $150k+",
    "marketing manager in New York City",
  ];
  const [currentPlaceholder, setCurrentPlaceholder] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  
  const startAnimation = useCallback(() => {
    intervalRef.current = setInterval(() => {
      setCurrentPlaceholder((prev) => (prev + 1) % placeholders.length);
    }, 3000);
  }, [placeholders.length]);
  
  const handleVisibilityChange = useCallback(() => {
    if (document.visibilityState !== "visible" && intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    } else if (document.visibilityState === "visible") {
      startAnimation();
    }
  }, [startAnimation]);

  useEffect(() => {
    startAnimation();
    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [startAnimation, handleVisibilityChange]);

  const [value, setValue] = useState(initialQuery);

  const handleSubmit = () => {
    if (value.trim()) {
      onSearch(value.trim());
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleSubmit();
    }
  };

  const buttonWidthAndSpacing = "w-8";
  const buttonRightOffset = "right-3";
  const textAreaRightPadding = "pr-12";

  return (
    <div className={cn("w-full relative", className)}>
      <Textarea
        id={id}
        value={value}
        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
          setValue(e.target.value);
        }}
        onKeyDown={handleKeyDown}
        className={cn(
          "w-full rounded-xl bg-black/5 dark:bg-white/5 dark:text-white",
          "resize-none focus-visible:ring-0 focus-visible:ring-offset-0 leading-[1.2] text-sm",
          "p-3",
          textAreaRightPadding
        )}
        style={{ minHeight: `${minHeight}px` }}
        ref={textareaRef}
      />
      {!value && (
        <div className={cn(
          "absolute inset-0 flex items-center pointer-events-none",
          "p-3",
          textAreaRightPadding
        )}>
          <AnimatePresence mode="wait">
            <motion.p
              initial={{ y: 5, opacity: 0 }}
              key={`current-placeholder-${currentPlaceholder}`}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -15, opacity: 0 }}
              transition={{ duration: 0.3, ease: "linear" }}
              className="text-neutral-500 dark:text-zinc-500 text-sm font-normal text-left truncate leading-[1.2] w-full"
            >
              {placeholders[currentPlaceholder]}
            </motion.p>
          </AnimatePresence>
        </div>
      )}
      <button
        type="button"
        onClick={handleSubmit}
        className={cn(
          "absolute top-1/2 -translate-y-1/2",
          buttonRightOffset,
          "h-8 w-8 p-0 flex items-center justify-center rounded-md",
          "bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600",
          "disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        )}
        aria-label="Search"
      >
        <SendHorizonal size={20} className="text-gray-600 dark:text-gray-300" />
      </button>
    </div>
  );
} 