import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
} from '@remix-run/react';

import type { LinksFunction, LoaderFunction } from '@remix-run/node';
import stylesheet from '~/tailwind.css?url';
import { authenticator } from './.server/auth';
import Navbar from './components/Navbar';
import { User } from '@prisma/client';

export const links: LinksFunction = () => [
  { rel: 'stylesheet', href: stylesheet },
];

export const loader: LoaderFunction = async ({ request }) => {
  const user = await authenticator.isAuthenticated(request);
  return {
    user,
    ENV: {
      GRAPQL_URL: process.env.GRAPQL_URL,
    },
  };
};

export function Layout({ children }: { children: React.ReactNode }) {
  const { user, ENV } = useLoaderData<{ user: User; ENV: {} }>();
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <div className="bg-gray-100 min-h-screen pb-4">
          <Navbar user={user} />
          <div className="container mx-auto min-h-fit">{children}</div>
        </div>
        <ScrollRestoration />
        <script
          dangerouslySetInnerHTML={{
            __html: `window.ENV = ${JSON.stringify(ENV)}`,
          }}
        />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}
