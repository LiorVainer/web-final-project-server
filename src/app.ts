import { initApp } from "./server";

const port = process.env.PORT;

try {
  const app = await initApp();
  app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
  });
} catch (error) {
  console.error("Failed to initialize the app:", error);
}
