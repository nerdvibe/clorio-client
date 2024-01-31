import express from "express";
import { root, graphqlSchema } from "./graphql/schema";
import { graphqlHTTP } from "express-graphql";
import { logger } from "@modules/log";
import {
  tickerCron,
  feesCron,
  heightCron,
  validatorsCron,
  blacklistedAddressesCron,
} from "@modules/cron";
import { minaAstronaut } from "./lib/minaAstronaut";
import { fetchValidators } from "@modules/validators/fetchValidators";
import { cacheBlacklistedAddresses } from "@modules/blacklistedAddresses/cacheBlacklistedAddresses";
import { initDb } from "./db/initClorioDb";
import { buildValidatorsCacheFromDB } from "@modules/validators/buildValidatorsCacheFromDB";
import cors from "cors";

(async () => {
  await initDb();
  const log = logger("SERVER");
  const port = process.env.SERVER_PORT;
  const app = express();

  app.use(cors());

  app.get("/", (req, res) => {
    res.write(minaAstronaut);
    res.end();
  });

  const setMiddleware = () => {
    app.use(
      "/graphql",
      graphqlHTTP({
        schema: graphqlSchema,
        rootValue: root,
        graphiql: true,
      })
    );
  };
  
  setMiddleware();

  await fetchValidators();
  await buildValidatorsCacheFromDB();
  await cacheBlacklistedAddresses();

  tickerCron.start();
  feesCron.start();
  heightCron.start();
  validatorsCron.start();
  blacklistedAddressesCron.start();

  app.listen(port, async () => {
    log.info(`Running a GraphQL API server at http://localhost:${port}`);
  });
})();
