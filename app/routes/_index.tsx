import { useState } from "react";
import { LoaderFunction, json } from "@remix-run/node";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";

import { Link, useLoaderData } from "@remix-run/react";
import { prisma } from "~/.server/db";

import Carousel from "~/components/Carousel";
import { Lottie } from "@prisma/client";
import LottieCard from "~/components/LottieCard";
import FeaturedCarousel from "~/components/FeaturedCarousel";
import Button from "~/components/Button";
import { AdjustmentsVerticalIcon } from "@heroicons/react/24/outline";

type LoaderData = {
  initialLotties: Lottie[];
};

export let loader: LoaderFunction = async () => {
  let lotties = await prisma.lottie.findMany({
    orderBy: { createdAt: "desc" },
    take: 5,
    include: {
      user: true,
    },
  });

  return json({ initialLotties: lotties });
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
          <LottieCard
            name={lottie.name}
            createdAt={lottie.createdAt}
            owner={lottie.user?.email}
            action={
              <Link to={`/edit/${lottie.id}/chat`}>
                <Button small>
                  Edit
                  <AdjustmentsVerticalIcon className="size-5 ml-1" />
                </Button>
              </Link>
            }
          >
            <DotLottieReact data={lottie.data} autoplay loop={true} />
          </LottieCard>
        ))}
        loadMore={loadMore}
      />
      <FeaturedCarousel />
    </div>
  );
}
