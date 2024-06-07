import { ActionFunction, LoaderFunction, redirect } from "@remix-run/node";
import { useActionData, Form } from "@remix-run/react";

import { registerUser } from "~/.server/auth";
import Button from "~/components/Button";
import Card from "~/components/Card";
import Input from "~/components/Input";

export let action: ActionFunction = async ({ request }) => {
  let formData = await request.formData();
  let email = formData.get("email");
  let password = formData.get("password");

  if (typeof email !== "string" || typeof password !== "string") {
    return { error: "Invalid form submission" };
  }

  try {
    await registerUser(email, password);
    return redirect("/login");
  } catch (error) {
    console.error(error);
    return { error: "Error creating user" };
  }
};

export default function SignUp() {
  let actionData = useActionData<{ error?: string }>();
  return (
    <div className="flex items-center justify-center w-full pt-[20vh]">
      <Card className="max-w-md w-full">
        <h1 className="text-2xl font-bold mb-6">Sign Up</h1>
        <Form method="post">
          <Input label="Email" type="email" name="email" />
          <Input label="Password" type="password" name="password" />
          <Button type="submit">Sign Up</Button>
        </Form>

        {actionData?.error && <p>{actionData.error}</p>}
      </Card>
    </div>
  );
}
