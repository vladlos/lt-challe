import React from "react";
import {
  json,
  LoaderFunction,
  ActionFunction,
  redirect,
} from "@remix-run/node";
import { useLoaderData, Form, useActionData } from "@remix-run/react";
import { prisma } from "~/.server/db";
import { authenticator } from "~/.server/auth";
import LottieList from "~/components/LottieList";
import Button from "~/components/Button";
import Input from "~/components/Input";
import { Lottie } from "@prisma/client";
import Textarea from "~/components/Textarea";

type LoaderData = {
  user: { email: string };
  lotties: Lottie[];
};

export let loader: LoaderFunction = async ({ request }) => {
  let user = await authenticator.isAuthenticated(request, {
    failureRedirect: "/login",
  });
  let lotties = await prisma.lottie.findMany({
    where: { userId: user.id },
    select: { id: true, name: true, createdAt: true },
  });
  return json({ user, lotties });
};

export let action: ActionFunction = async ({ request }) => {
  let user = await authenticator.isAuthenticated(request, {
    failureRedirect: "/login",
  });
  let formData = await request.formData();
  let name = formData.get("name");
  let data = formData.get("data");

  if (typeof name !== "string" || typeof data !== "string") {
    return json({ error: "Invalid form submission" }, { status: 400 });
  }

  try {
    await prisma.lottie.create({
      data: {
        name,
        data,
        userId: user.id,
      },
    });
    return redirect("/my-lotties");
  } catch (error) {
    return json({ error: "Failed to save Lottie data" }, { status: 500 });
  }
};

export default function MyLotties() {
  let { lotties } = useLoaderData<LoaderData>();
  let actionData = useActionData<{ error?: string }>();

  return (
    <>
      <h2 className="text-xl font-semibold my-4">Your Lotties</h2>
      <LottieList lotties={lotties} />
      <h2 className="text-xl font-semibold mb-4">Upload New Lottie</h2>
      <Form method="post" className="bg-white p-4 rounded shadow-md">
        <Input label="Name" type="text" name="name" />
        <Textarea label="Lottie JSON" name="data" rows={10} />
        <Button type="submit">Upload</Button>
        {actionData?.error && (
          <p className="mt-4 text-red-600">{actionData.error}</p>
        )}
      </Form>
    </>
  );
}
