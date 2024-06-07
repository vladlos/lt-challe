import { LoaderFunction, json } from "@remix-run/node";

import { Form, useLoaderData } from "@remix-run/react";
import { prisma } from "~/.server/db";
import { useState } from "react";
import Carousel from "~/components/Carousel";
import { Lottie } from "@prisma/client";
import { useQuery } from "@apollo/client/react/hooks/useQuery";
import { gql } from "@apollo/client/core";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import LottieCard from "~/components/LottieCard";

const GET_FEATURED_ANIMATIONS = gql`
  query FeaturedPublicAnimations($first: Int) {
    featuredPublicAnimations(first: $first) {
      edges {
        cursor
        node {
          id
          name
          videoUrl
          jsonUrl
          createdAt
        }
      }
      pageInfo {
        endCursor
        hasNextPage
        hasPreviousPage
        startCursor
      }
      totalCount
    }
  }
`;

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

export default function Index() {
  let { initialLotties } = useLoaderData<LoaderData>();
  let [lotties, setLotties] = useState(initialLotties);
  let [page, setPage] = useState(1);

  const { loading, error, data } = useQuery(GET_FEATURED_ANIMATIONS, {
    variables: {
      first: 5,
    },
  });

  async function loadMore() {
    let res = await fetch(`/api/load-more?page=${page + 1}`);
    let newLotties = await res.json();
    setLotties([...lotties, ...newLotties]);
    setPage(page + 1);
  }

  const featuredAnimations = data?.featuredPublicAnimations?.edges || [];

  return (
    <div>
      <h1 className="text-2xl font-bold my-6">Latest Lotties</h1>
      <Carousel
        items={lotties.map((lottie) => (
          <LottieCard name={lottie.name} createdAt={lottie.createdAt}>
            <DotLottieReact data={lottie.data} loop={true} />
          </LottieCard>
        ))}
        loadMore={loadMore}
      />
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p>Error: {error.message}</p>
      ) : (
        <div>
          <h1 className="text-2xl font-bold my-6">Featured Animations</h1>
          <Carousel
            items={featuredAnimations.map(
              ({ node: { name, videoUrl, createdAt } }) => (
                <LottieCard
                  name={name}
                  createdAt={createdAt}
                  action={
                    <Form>
                      <input type="hidden" name="name" value={name} />
                      <button type="submit" name="intent" value="LIKE">
                        Add to My Lotties
                      </button>
                    </Form>
                  }
                >
                  <video className="h-40 w-full" autoPlay loop>
                    <source src={videoUrl} type="video/mp4" />
                  </video>
                </LottieCard>
              )
            )}
            loadMore={loadMore}
          />
        </div>
      )}
    </div>
  );
}
