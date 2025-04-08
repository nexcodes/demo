"use client";

import {
  useState,
  useRef,
  useEffect,
  type KeyboardEvent,
  type ClipboardEvent,
} from "react";
import { cn } from "@/lib/utils";

interface CustomOTPInputProps {
  value: string;
  onChange: (value: string) => void;
  length?: number;
  className?: string;
}

export function CustomOTPInput({
  value = "",
  onChange,
  length = 6,
  className,
}: CustomOTPInputProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Initialize or update the array of input refs
  useEffect(() => {
    inputRefs.current = inputRefs.current.slice(0, length);

    // Focus on the first empty input or the last one
    const indexToFocus = value.length < length ? value.length : length - 1;
    setTimeout(() => {
      inputRefs.current[indexToFocus]?.focus();
      setActiveIndex(indexToFocus);
    }, 0);
  }, [length, value.length]);

  // Handle input change
  const handleChange = (index: number, digit: string) => {
    if (!/^\d*$/.test(digit)) return; // Only allow digits

    const newValue = value.split("");
    newValue[index] = digit;
    const updatedValue = newValue.join("");

    onChange(updatedValue);

    // Move to next input if a digit was entered
    if (digit && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
      setActiveIndex(index + 1);
    }
  };

  // Handle key press
  const handleKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace") {
      if (!value[index] && index > 0) {
        // If current input is empty and backspace is pressed, move to previous input
        inputRefs.current[index - 1]?.focus();
        setActiveIndex(index - 1);

        // Also clear the previous value
        const newValue = value.split("");
        newValue[index - 1] = "";
        onChange(newValue.join(""));
      }
    } else if (e.key === "ArrowLeft" && index > 0) {
      inputRefs.current[index - 1]?.focus();
      setActiveIndex(index - 1);
    } else if (e.key === "ArrowRight" && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
      setActiveIndex(index + 1);
    }
  };

  // Handle paste
  const handlePaste = (e: ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text/plain").trim();

    // Check if pasted content is all digits and not longer than our inputs
    if (!/^\d+$/.test(pastedData)) return;

    const digits = pastedData.slice(0, length).split("");
    const newValue = value.split("");

    digits.forEach((digit, idx) => {
      newValue[idx] = digit;
    });

    onChange(newValue.join(""));

    // Focus on the next empty slot or the last one
    const newActiveIndex = Math.min(digits.length, length - 1);
    inputRefs.current[newActiveIndex]?.focus();
    setActiveIndex(newActiveIndex);
  };

  return (
    <div className={cn("flex gap-3 justify-center", className)}>
      {Array.from({ length }).map((_, index) => (
        <div key={index} className="relative">
          <input
            ref={(el) => {
              inputRefs.current[index] = el;
            }}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={value[index] || ""}
            onChange={(e) => handleChange(index, e.target.value)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            onPaste={handlePaste}
            onFocus={() => setActiveIndex(index)}
            className={cn(
              "h-14 w-12 rounded-lg border text-center text-xl outline-none transition-all",
              "bg-white/10 border-white/20 text-white",
              activeIndex === index
                ? "ring-2 ring-white/50 border-white/40"
                : "hover:border-white/30",
              "focus:ring-2 focus:ring-white/50 focus:border-white/40"
            )}
            aria-label={`Digit ${index + 1}`}
          />
          {/* Animated caret for active input */}
          {activeIndex === index && !value[index] && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="h-6 w-0.5 bg-white/70 animate-pulse"></div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
