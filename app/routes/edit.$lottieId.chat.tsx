import { useEffect, useState } from "react";
import {
  ActionFunction,
  LoaderFunction,
  json,
  redirect,
} from "@remix-run/node";
import { Form, useLoaderData, useParams } from "@remix-run/react";
import { prisma } from "~/.server/db";
import eventEmitter from "~/.server/eventEmitter";
import { authenticator } from "~/.server/auth";

import Button from "~/components/Button";
import Input from "~/components/Input";
import { Message } from "@prisma/client";
import { format } from "date-fns";

type LoaderData = {
  messages: Message[];
};

export const loader: LoaderFunction = async ({ request, params }) => {
  console.log("PARAMS:", params);
  const user = await authenticator.isAuthenticated(request, {
    failureRedirect: "/login",
  });

  let chat = await prisma.chat.findUnique({
    where: { lottieId: params.lottieId },
    include: {
      messages: {
        include: { user: true },
        orderBy: { createdAt: "asc" },
      },
    },
  });

  if (!chat) {
    chat = await prisma.chat.create({
      data: {
        lottieId: params.lottieId,
        createdAt: new Date(),
      },
      include: {
        messages: {
          include: { user: true },
          orderBy: { createdAt: "asc" },
        },
      },
    });
  }

  return json({ messages: chat?.messages });
};

export const action: ActionFunction = async ({ request, params }) => {
  const user = await authenticator.isAuthenticated(request, {
    failureRedirect: "/login",
  });

  const lottieId = params.lottieId;
  let chat = await prisma.chat.findUnique({
    where: { lottieId },
  });

  const formData = await request.formData();
  const content = formData.get("message");

  if (typeof content !== "string") {
    return json({ error: "Invalid form data" }, { status: 400 });
  }

  const newMessage = await prisma.message.create({
    data: {
      content,
      chatId: chat.id,
      userId: user.id,
    },
    include: {
      user: true,
    },
  });

  // Emit the new message event
  eventEmitter.emit(`newMessage:${lottieId}`);

  return redirect(`/edit/${lottieId}/chat`);
};

export default function Chat() {
  const { messages: initialMessages } = useLoaderData<LoaderData>();
  const [messages, setMessages] = useState(initialMessages);
  const lottieId = useParams().lottieId;

  useEffect(() => {
    console.log("effect ran");
    const eventSource = new EventSource(`/edit/${lottieId}/chat/sse`);

    eventSource.onopen = () => {
      console.log("SSE connection opened");
    };

    eventSource.onerror = (error) => {
      console.error("SSE error:", error);
    };

    eventSource.onmessage = (event) => {
      console.log("MESSAGE:", event.data);
      const newMessages = JSON.parse(event.data);
      setMessages(newMessages);
    };

    return () => {
      eventSource.close();
      console.log("SSE connection closed");
    };
  }, [lottieId]);
  return (
    <div className="flex flex-col h-full">
      <h1 className="text-2xl font-bold mb-4">Chat</h1>
      <div className="flex-1 overflow-y-auto">
        {messages.map((message) => (
          <div className="bg-gray-100 rounded-md mb-2 p-2" key={message.id}>
            <div className="text-gray-500 text-sm">
              {message.user.email} at{" "}
              {format(new Date(message.createdAt), "MM/dd/yyyy hh:mm")}
            </div>
            {message.content}
          </div>
        ))}
      </div>

      <Form method="post">
        <Input type="text" name="message" placeholder="comment.." />
        <Button type="submit">Send</Button>
      </Form>
    </div>
  );
}
