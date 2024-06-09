import React, { useEffect, useState } from "react";
import { ActionFunction, LoaderFunction, json } from "@remix-run/node";
import { useLoaderData, Outlet } from "@remix-run/react";

import { prisma } from "~/.server/db";
import { authenticator } from "~/.server/auth";
import { Lottie } from "@prisma/client";
import Card from "~/components/Card";
import LottiePlayerWithControls from "~/components/LottiePlayerWithControls";
import LottieEditor from "~/components/LottieEditor";
import { useDebounceFetcher } from "remix-utils/use-debounce-fetcher";
import eventEmitter from "~/.server/eventEmitter";
import _ from "lodash";

type LoaderData = {
  lottie: Lottie;
};

export let loader: LoaderFunction = async ({ request, params }) => {
  let user = await authenticator.isAuthenticated(request, {
    failureRedirect: "/login",
  });

  const lottie = await prisma.lottie.findUnique({
    where: { id: params.lottieId },
    select: { id: true, name: true, data: true, createdAt: true },
  });

  if (!lottie) {
    throw new Response("Lottie not found", { status: 404 });
  }

  return json({ lottie });
};

export let action: ActionFunction = async ({ request, params }) => {
  console.log("ACTION");
  let user = await authenticator.isAuthenticated(request, {
    failureRedirect: "/login",
  });

  let formData = await request.formData();
  let data = formData.get("data");

  if (typeof data !== "string") {
    return json({ error: "Invalid form data" }, { status: 400 });
  }

  try {
    await prisma.lottie.update({
      where: { id: params.lottieId },
      data: { data },
    });
    eventEmitter.emit(`updateLottie:${params.lottieId}`);
  } catch (error) {
    console.log(error);
    return json({ error: "Error updating" }, { status: 400 });
  }

  return json({ ok: true });
};

export default function SingleLottie() {
  let { lottie } = useLoaderData<LoaderData>();
  const [data, setData] = useState(JSON.parse(lottie.data));
  const fetcher = useDebounceFetcher();

  useEffect(() => {
    const eventSource = new EventSource(`/edit/${lottie.id}/sse`);

    eventSource.onmessage = (event) => {
      try {
        const newLottie = JSON.parse(event.data);
        const newData = JSON.parse(newLottie.data);
        if (!_.isEqual(data, newData)) {
          setData(newData);
        }
      } catch (e) {
        console.log(e);
      }
    };

    return () => {
      eventSource.close();
    };
  }, [lottie.id]);

  const handleUpdate = (newData: any) => {
    if (!_.isEqual(data, newData)) {
      setData(newData);
      try {
        fetcher.submit(
          { data: JSON.stringify(newData) },
          {
            method: "post",
            action: `/edit/${lottie.id}`,
            debounceTimeout: 1000,
          }
        );
      } catch (e) {
        console.log(e);
      }
    }
  };

  return (
    <div className="flex gap-4 py-4 min-h-[calc(100vh-100px)]">
      <Card className="w-1/4">
        <Outlet />
      </Card>

      <Card className="w-1/2">
        <h1 className="text-2xl font-bold mb-4">{lottie.name}</h1>
        <LottiePlayerWithControls data={data} />
      </Card>
      <Card className="w-1/4 overflow-y-auto">
        <h2 className="text-xl font-semibold mb-4">Adjust Animation</h2>
        <LottieEditor data={data} onUpdate={handleUpdate} />
      </Card>
    </div>
  );
}
