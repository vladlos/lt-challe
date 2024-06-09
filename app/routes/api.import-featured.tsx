import { ActionFunction, json, redirect } from "@remix-run/node";
import { authenticator } from "~/.server/auth";
import { prisma } from "~/.server/db";

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

  const data = JSON.stringify(await response.json());

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
