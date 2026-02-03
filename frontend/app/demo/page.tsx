"use client";
import { useEffect, useRef, useState } from "react";

export default function RefClosureDemo() {
  const [count, setCount] = useState(0);
  const ref = useRef<number>(0);

  console.log("I rerendered.");

  return (
    <div className="p-6 space-y-4">
      <p>Count: {ref.current}</p>

      <button
        className="border px-4 py-2"
        onClick={() => {
          ref.current = ref.current + 1;
          console.log(ref.current);
        }}
      >
        Increment
      </button>

      <button className="border px-4 py-2" onClick={() => setCount((c) => c + 1)}>
        Increment Count
      </button>

      <p>Open console and watch logs update correctly</p>
    </div>
  );
}
