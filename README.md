# LottieFiles challeng

Remix js was chosen as a main tool. Mongo+Prisma orm for database. Tailwind for styling

## Development

First run the Vite dev server:

```shellscript
npx prisma generate & npm run dev
```

After only `npm run dev` needed is there is no changes in `prisma/schema.prisma`

## Deployment

Configured CI to build and deploy app on GCP cloud run.

https://lottie-challenge-ovuw7pxynq-ew.a.run.app/

## Overview

We have basic login\sign up. Authentificated user can collaborate on all user owned animations.

On main page there is Featured Animation section fetched from gql lottie api. 

### !!! There is some animations in featured that will hard broke lottie player. I don't found solution for that due to time constraints so temp solution will be to delete problematic lottie from my lotties https://lottie-challenge-ovuw7pxynq-ew.a.run.app/my-lotties.

Edit lottie page support realtime collaboration on lottie json, currently user can change speed, inspect elements and change their color. And left comments.

Real time functionality done using SSE.

## Next steps

There is a bunch of thing I would like to improve. Next steps in priority order, if it was a real app:

 - hide db user pass via env secret
 - test coverage
 - maybe moving work with db in separate module instead of scattering this code in loader\action.
 - improve mobile layouts