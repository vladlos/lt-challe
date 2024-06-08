import { LoaderFunction } from "@remix-run/node";
import { prisma } from "~/.server/db";
import eventEmitter from "~/.server/eventEmitter";

export let loader: LoaderFunction = async ({ request, params }) => {
  let lottieId = params.lottieId;

  const headers = new Headers();
  headers.set("Content-Type", "text/event-stream");
  headers.set("Cache-Control", "no-cache");
  headers.set("Connection", "keep-alive");

  return new Response(
    new ReadableStream({
      async start(controller) {
        const encoder = new TextEncoder();
        
        const sendMessages = async () => {
          try {
            const messages = await prisma.message.findMany({
              where: { chat: { lottieId } },
              include: { user: true },
              orderBy: { createdAt: "asc" },
            });
            console.log("MESSAGES:", messages.length);
            controller.enqueue(encoder.encode(`data: ${JSON.stringify(messages)}\n\n`));
          } catch (error) {
            console.error("Error fetching messages:", error);
            controller.error(error);
          }
        };

        // Send initial messages
        await sendMessages();

        const onNewMessage = async () => {
          await sendMessages();
        };

        eventEmitter.on(`newMessage:${lottieId}`, onNewMessage);

        request.signal.addEventListener("abort", () => {
          console.log("SSE connection closed");
          eventEmitter.off(`newMessage:${lottieId}`, onNewMessage);
          controller.close();
        });
      },
    }),
    { headers }
  );
};
