const controllers: ReadableStreamDefaultController[] = [];

export function GET() {
  let timer: ReturnType<typeof setInterval> | undefined;

  function message(data: string) {
    const current_time = new Date().toLocaleString();
    return `event: message\ndata:${current_time}-${data}\n\n`;
  }
  let c: ReadableStreamDefaultController;
  const stream = new ReadableStream({
    start(controller) {
      c = controller;
      controllers.push(controller);
      controller.enqueue(message("start"));
      timer = setInterval(() => {
        controller.enqueue(message("foo1"));
      }, 5000);
    },
    cancel() {
      clearInterval(timer);
      const index = controllers.indexOf(c);
      if (index > -1) {
        controllers.splice(index, 1);
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
    },
  });
}

export async function POST({ request }: { request: Request }) {
  console.log("POST /mockup/sse1");
  try {
    const data = await request.text();
    controllers.forEach((controller) => {
      controller.enqueue(`event: message\ndata:${data}\n\n`);
    });
    return new Response("Message sent", { status: 200 });
  } catch (error) {
    return new Response("Error sending message", { status: 500 });
  }
}
// CURL -X POST -d hello http://localhost:5173/mockup/sse1
