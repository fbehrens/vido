export function GET() {
  let timer: ReturnType<typeof setInterval> | undefined;

  function message(data: string) {
    const current_time = new Date().toLocaleString();
    return `event: message\ndata:${current_time}-${data}\n\n`;
  }

  const stream = new ReadableStream({
    start(controller) {
      timer = setInterval(() => {
        controller.enqueue(message("foo"));
      }, 1000);
    },
    cancel() {
      clearInterval(timer);
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
    },
  });
}
