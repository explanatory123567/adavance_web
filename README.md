# Next Gear: MongoDB-backed PC Builder

The storefront now uses the Express API for catalog, authentication, verification codes, orders, and users. Product records are seeded into MongoDB; the browser no longer initializes catalog or order records from the old mock seed.

## Local setup

1. Install MongoDB locally or create a MongoDB Atlas database.
2. Copy `.env.example` to `.env` and set `MONGODB_URI` and a long `JWT_SECRET`.
3. Create a Google reCAPTCHA v2 checkbox site/secret key and set both reCAPTCHA variables. Add `REACT_APP_RECAPTCHA_SITE_KEY` to the frontend environment.
4. Set SMTP variables so verification codes can be delivered by email.
5. To enable Discord account linking, create a Discord application and set `DISCORD_CLIENT_ID`, `DISCORD_CLIENT_SECRET`, and `DISCORD_REDIRECT_URI` in the API environment. Set the Discord OAuth redirect URL to `http://localhost:4000/api/discord/callback` for local development; use your deployed API URL in production.
6. Run `npm run seed` once to load the catalog into MongoDB.
7. Run `npm run dev` to start the API on port 4000 and the React app on port 3000.

Without SMTP, the API logs verification codes to the server console for local testing. Do not use that mode in production.

GCash checkout supports manual transfer without a GCash API: set `REACT_APP_GCASH_NUMBER` to the merchant's GCash number, then customers transfer externally and enter the transaction reference. Orders remain pending until the merchant verifies payment; entering a reference does not itself prove that funds were received.

The footer email signup stores newsletter subscriber addresses in MongoDB when the database is connected. Without MongoDB, subscriptions are only retained in server memory for the current session. The signup does not send emails or connect to an email marketing provider.

## Available scripts

- `npm run dev`: start the API and React development server.
- `npm run server`: start only the API.
- `npm run seed`: replace the MongoDB catalog with the included catalog seed.
- `npm run create-admin`: interactively create an administrator account in MongoDB.
- `npm run build`: build the React app for production.

After creating the administrator, restart the app, sign in with that account, and the Admin Dashboard opens automatically. Public registration always creates regular users.

## Create React App reference

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)
