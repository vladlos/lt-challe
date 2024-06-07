import React, { useState } from "react";
import { LoaderFunction, json } from "@remix-run/node";
import { useLoaderData, Outlet } from "@remix-run/react";
import { prisma } from "~/.server/db";
import { authenticator } from "~/.server/auth";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import { Lottie } from "@prisma/client";
import Card from "~/components/Card";
import Input from "~/components/Input";
import { format } from "date-fns";
import Button from "~/components/Button";
import ColorInput from "~/components/ColorInput";

import CodeBlock from "~/components/CodeBlock";
import LottiePlayerWithControls from "~/components/LottiePlayerWithControls";
import LottieEditor from "~/components/LottieEditor";

type LoaderData = {
  lottie: Lottie;
};

export let loader: LoaderFunction = async ({ request, params }) => {
  let user = await authenticator.isAuthenticated(request, {
    failureRedirect: "/login",
  });

  let lottie = await prisma.lottie.findUnique({
    where: { id: params.lottieId },
    select: { id: true, name: true, data: true, createdAt: true },
  });

  if (!lottie) {
    throw new Response("Lottie not found", { status: 404 });
  }

  return json({ lottie });
};

export default function SingleLottie() {
  let { lottie } = useLoaderData<LoaderData>();

  return (
    <div className="flex gap-4 pt-4 max-h-[calc(100vh-80px)]">
      <Card className="w-1/4">
        <Outlet />
      </Card>

      <Card className="w-1/2">
        <h1 className="text-2xl font-bold mb-4">{lottie.name}</h1>
        <LottiePlayerWithControls data={lottie.data} />
      </Card>
      <Card className="w-1/4">
        <h2 className="text-xl font-semibold mb-4">Adjust Animation</h2>
        <LottieEditor data={lottie.data} />
      </Card>
    </div>
  );
}
