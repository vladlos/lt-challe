import { LoaderFunction } from '@remix-run/node';
import { prisma } from '~/.server/db';
import eventEmitter from '~/.server/eventEmitter';

export let loader: LoaderFunction = async ({ request, params }) => {
  let lottieId = params.lottieId;

  const headers = new Headers();
  headers.set('Content-Type', 'text/event-stream');
  headers.set('Cache-Control', 'no-cache');
  headers.set('Connection', 'keep-alive');

  return new Response(
    new ReadableStream({
      async start(controller) {
        const encoder = new TextEncoder();

        const sendLottie = async () => {
          console.log('SENDING LOTTIE');
          try {
            const lottie = await prisma.lottie.findUnique({
              where: { id: params.lottieId },
              select: { id: true, name: true, data: true, createdAt: true },
            });

            controller.enqueue(
              encoder.encode(`data: ${JSON.stringify(lottie)}\n\n`)
            );
          } catch (error) {
            console.error('Error fetching lottie:', error);
            controller.error(error);
          }
        };

        const onLottieUpdate = async () => {
          await sendLottie();
        };

        eventEmitter.on(`updateLottie:${lottieId}`, onLottieUpdate);

        request.signal.addEventListener('abort', () => {
          console.log('SSE connection closed');
          eventEmitter.off(`updateLottie:${lottieId}`, onLottieUpdate);
          controller.close();
        });
      },
    }),
    { headers }
  );
};
