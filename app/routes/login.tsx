import { ActionFunction, LoaderFunction, redirect } from '@remix-run/node';
import { Form, useActionData } from '@remix-run/react';
import { authenticator } from '~/.server/auth';
import Button from '~/components/Button';
import Card from '~/components/Card';
import Input from '~/components/Input';

export let loader: LoaderFunction = async ({ request }) => {
  await authenticator.isAuthenticated(request, { successRedirect: '/' });
  return {};
};

export let action: ActionFunction = async ({ request }) => {
  return await authenticator.authenticate('user-pass', request, {
    successRedirect: '/',
    failureRedirect: '/login',
  });
};

export default function Login() {
  let actionData = useActionData<{ error?: string }>();
  return (
    <div className="flex items-center justify-center w-full pt-[20vh]">
      <Card className="max-w-md w-full">
        <h1 className="text-2xl font-bold mb-6">Login</h1>
        <Form method="post">
          <Input label="Email" type="email" name="email" />
          <Input label="Password" type="password" name="password" />
          <Button type="submit">Login</Button>
        </Form>
        {actionData?.error && (
          <p className="mt-4 text-red-600">{actionData.error}</p>
        )}
      </Card>
    </div>
  );
}
