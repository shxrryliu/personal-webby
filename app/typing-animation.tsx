"use client";

import { useState, useEffect } from "react";

export function TypingAnimation({
  prefix,
  text,
  typingSpeed = 160,
  erasingSpeed = 90,
  pauseDuration = 3000,
}: {
  prefix: string;
  text: string;
  typingSpeed?: number;
  erasingSpeed?: number;
  pauseDuration?: number;
}) {
  const [displayedText, setDisplayedText] = useState("");
  const [isTyping, setIsTyping] = useState(true);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    let timeout: NodeJS.Timeout;

    if (isPaused) {
      // Wait for pause duration before starting to erase
      timeout = setTimeout(() => {
        setIsPaused(false);
        setIsTyping(false);
      }, pauseDuration);
    } else if (isTyping) {
      // Typing phase
      if (displayedText.length < text.length) {
        timeout = setTimeout(() => {
          setDisplayedText(text.slice(0, displayedText.length + 1));
        }, typingSpeed);
      } else {
        // Finished typing, start pause
        setIsPaused(true);
      }
    } else {
      // Erasing phase
      if (displayedText.length > 0) {
        timeout = setTimeout(() => {
          setDisplayedText(text.slice(0, displayedText.length - 1));
        }, erasingSpeed);
      } else {
        // Finished erasing, start typing again
        setIsTyping(true);
      }
    }

    return () => clearTimeout(timeout);
  }, [displayedText, isTyping, isPaused, text, typingSpeed, erasingSpeed, pauseDuration]);

  return (
    <span>
      {prefix}
      <span className="inline-block min-w-[1ch]">
        {displayedText}
        <span className="animate-blink text-xl text-blue-800">|</span>
      </span>
    </span>
  );
}
