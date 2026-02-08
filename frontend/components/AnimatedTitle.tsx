"use client";

import { useEffect, useState } from "react";

type AnimatedChatTitleProps = {
  text: string;
  animate: boolean;
};

export default function AnimatedChatTitle({ text, animate }: AnimatedChatTitleProps) {
  const [visibleText, setVisibleText] = useState(animate ? "" : text);

  useEffect(() => {
    if (!animate) {
      setVisibleText(text);
      return;
    }

    let i = 0;
    const interval = setInterval(() => {
      i++;
      setVisibleText(text.slice(0, i));
      if (i >= text.length) clearInterval(interval);
    }, 100); // speed control

    return () => clearInterval(interval);
  }, [text, animate]);

  return <span>{visibleText}</span>;
}
