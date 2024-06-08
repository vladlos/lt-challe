import {
  ActionFunction,
  LoaderFunction,
  json,
  redirect,
} from "@remix-run/node";

import { Form, useLoaderData } from "@remix-run/react";
import { prisma } from "~/.server/db";
import { useState } from "react";
import Carousel from "~/components/Carousel";
import { Lottie } from "@prisma/client";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import LottieCard from "~/components/LottieCard";
import { authenticator } from "~/.server/auth";
import FeaturedCarousel from "~/components/FeaturedCarousel";

type LoaderData = {
  initialLotties: Lottie[];
};

export let loader: LoaderFunction = async () => {
  let lotties = await prisma.lottie.findMany({
    orderBy: { createdAt: "desc" },
    take: 5,
  });

  return json({ initialLotties: lotties });
};

export let action: ActionFunction = async ({ request }) => {
  let user = await authenticator.isAuthenticated(request, {
    failureRedirect: "/login",
  });

  const formData = await request.formData();
  const name = formData.get("name");
  const jsonUrl = formData.get("jsonUrl");

  if (typeof name !== "string" || typeof jsonUrl !== "string") {
    return json({ error: "Invalid form data" }, { status: 400 });
  }

  // Fetch the JSON data from the URL
  const response = await fetch(jsonUrl);
  if (!response.ok) {
    return json({ error: "Failed to fetch JSON data" }, { status: 500 });
  }

  const data = await response.json();

  // Save the fetched JSON data to your Prisma database
  const newLottie = await prisma.lottie.create({
    data: {
      name,
      data,
      userId: user.id,
    },
  });

  // Redirect the user to the edit page
  return redirect(`/edit/${newLottie.id}/chat`);
};

export default function Index() {
  let { initialLotties } = useLoaderData<LoaderData>();
  let [lotties, setLotties] = useState(initialLotties);
  let [page, setPage] = useState(1);

  async function loadMore() {
    let res = await fetch(`/api/load-more?page=${page + 1}`);
    let newLotties = await res.json();
    setLotties([...lotties, ...newLotties]);
    setPage(page + 1);
  }

  return (
    <div>
      <h1 className="text-2xl font-bold my-6">Latest Lotties</h1>
      <Carousel
        id={"latest-lotties"}
        items={lotties.map((lottie) => (
          <LottieCard name={lottie.name} createdAt={lottie.createdAt}>
            <DotLottieReact data={lottie.data} loop={true} />
          </LottieCard>
        ))}
        loadMore={loadMore}
      />
      <FeaturedCarousel />
    </div>
  );
}
