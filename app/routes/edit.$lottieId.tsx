import React, { useState } from "react";
import { LoaderFunction, json } from "@remix-run/node";
import { useLoaderData, Outlet } from "@remix-run/react";
import { prisma } from "~/.server/db";
import { authenticator } from "~/.server/auth";
import { Lottie } from "@prisma/client";
import Card from "~/components/Card";
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
  const [data, setData] = useState(lottie.data);

  return (
    <div className="flex gap-4 pt-4 max-h-[calc(100vh-80px)]">
      <Card className="w-1/4">
        <Outlet />
      </Card>

      <Card className="w-1/2">
        <h1 className="text-2xl font-bold mb-4">{lottie.name}</h1>
        <LottiePlayerWithControls data={data} />
      </Card>
      <Card className="w-1/4 overflow-y-auto">
        <h2 className="text-xl font-semibold mb-4">Adjust Animation</h2>
        <LottieEditor
          data={data}
          onUpdate={(newData) => {
            setData(newData);
          }}
        />
      </Card>
    </div>
  );
}
