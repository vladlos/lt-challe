import { ActionFunction, LoaderFunction, redirect } from '@remix-run/node';
import { authenticator } from '~/.server/auth';

export const action: ActionFunction = async ({ request }) => {
  return await authenticator.logout(request, { redirectTo: '/' });
};

export const loader: LoaderFunction = () => {
  return redirect('/');
};
