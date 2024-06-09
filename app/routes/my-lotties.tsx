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

export const loader: LoaderFunction = async ({ request }) => {
  const user = await authenticator.isAuthenticated(request, {
    failureRedirect: "/login",
  });
  const lotties = await prisma.lottie.findMany({
    where: { userId: user.id },
    select: { id: true, name: true, createdAt: true },
  });
  return json({ user, lotties });
};

export const action: ActionFunction = async ({ request }) => {
  const user = await authenticator.isAuthenticated(request, {
    failureRedirect: "/login",
  });
  const formData = await request.formData();
  const action = formData.get("action");

  try {
    if (action === "create") {
      const name = formData.get("name");
      const data = formData.get("data");

      if (typeof name !== "string" || typeof data !== "string") {
        return json({ error: "Invalid form submission" }, { status: 400 });
      }
      await prisma.lottie.create({
        data: {
          name,
          data,
          userId: user.id,
        },
      });
    } else if (action === "delete") {
      const lottieId = formData.get("lottieId");
      if (typeof lottieId !== "string") {
        return json({ error: "Invalid form submission" }, { status: 400 });
      }

      await prisma.lottie.delete({
        where: {
          id: lottieId,
        },
      });
    } else {
      return json({ error: "Invalid action" }, { status: 400 });
    }
    return redirect("/my-lotties");
  } catch (error) {
    console.error(error);
    return json(
      { error: "Failed to save/delete Lottie data" },
      { status: 500 }
    );
  }
};

export default function MyLotties() {
  const { lotties } = useLoaderData<LoaderData>();
  const actionData = useActionData<{ error?: string }>();

  return (
    <>
      <h2 className="text-xl font-semibold my-4">Your Lotties</h2>
      <LottieList
        lotties={lotties}
        actions={(id) => (
          <Form method="post">
            <input type="hidden" name="action" value="delete" />
            <input type="hidden" name="lottieId" value={id} />
            <Button type="submit" small>
              delete
            </Button>
          </Form>
        )}
      />
      <h2 className="text-xl font-semibold mb-4">Upload New Lottie</h2>
      <Form method="post" className="bg-white p-4 rounded shadow-md">
        <input type="hidden" name="action" value="create" />
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
