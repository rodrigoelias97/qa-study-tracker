const app = require("./app");
const connectDatabase = require("./config/db");
const env = require("./config/env");

const bootstrap = async () => {
  await connectDatabase();

  app.listen(env.PORT, () => {
    console.log(`API running on ${env.BASE_URL}`);
  });
};

bootstrap();
