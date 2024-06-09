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
<img width="1337" alt="Screenshot 2024-06-09 at 16 17 52" src="https://github.com/vladlos/lt-challe/assets/12850886/72488cbd-9843-4616-86b2-e18ab938775a">

On main page there is Latest Lotties - the ones that in our db and Featured Animation section fetched from gql lottie api. 
<img width="1323" alt="Screenshot 2024-06-09 at 16 18 57" src="https://github.com/vladlos/lt-challe/assets/12850886/dc80c8b3-a5a1-47c4-8417-5100a49d9988">

User can go directly to collaboration edit for lotties from our db, or can press export and save lottie to his "My Lotties".

### !!! There is some animations in featured that will hard broke lottie player. I don't found solution for that due to time constraints so temp solution will be to delete problematic lottie from my lotties https://lottie-challenge-ovuw7pxynq-ew.a.run.app/my-lotties.
<img width="1436" alt="Screenshot 2024-06-09 at 16 21 34" src="https://github.com/vladlos/lt-challe/assets/12850886/90260536-21e3-4374-a3fd-2913ca8f97b0">

Edit lottie page support realtime collaboration on lottie json, currently user can change speed, inspect elements and change their color. And left comments.
<img width="1470" alt="Screenshot 2024-06-09 at 16 24 08" src="https://github.com/vladlos/lt-challe/assets/12850886/c56ecba3-0e2a-4529-b09c-b0af3e61058d">

Real time functionality done with SSE.

## Next steps

There is a bunch of thing I would like to improve. Next steps in priority order, if it was a real app:

 - hide db user pass via env secret
 - test coverage
 - maybe moving work with db in separate module instead of scattering this code in loader\action.
 - improve mobile layouts
