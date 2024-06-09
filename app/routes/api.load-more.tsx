import { LoaderFunction, json } from "@remix-run/node";
import { prisma } from "~/.server/db";

const per_page = 5;

export let loader: LoaderFunction = async ({ request }) => {
  let url = new URL(request.url);
  let page = parseInt(url.searchParams.get("page") || "1", 10);
  let lotties = await prisma.lottie.findMany({
    orderBy: { createdAt: "asc" },
    skip: (page - 1) * per_page,
    take: per_page,
    include: {
      user: true,
    },
  });

  return json(lotties);
};
