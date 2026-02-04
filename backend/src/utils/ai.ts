const GEMINI_ENDPOINT = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent";

type StreamHandlers = {
  onToken: (token: string) => void;
  onComplete: () => Promise<void>;
};

export async function streamAIResponse(prompt: string, handlers: StreamHandlers) {
  const res = await fetch(`${GEMINI_ENDPOINT}?key=${process.env.GEMINI_API_KEY}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [
        {
          parts: [{ text: prompt }],
        },
      ],
    }),
  });

  if (!res.ok) {
    throw new Error("AI response generation failed");
  }

  const json = await res.json();
  const text = json.candidates?.[0]?.content?.parts?.[0]?.text ?? "";

  // simulated streaming (SSE stays real)
  for (const word of text.split(" ")) {
    handlers.onToken(word + " ");
    await new Promise((r) => setTimeout(r, 20));
  }

  await handlers.onComplete();
}
