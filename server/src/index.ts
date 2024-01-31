import "module-alias/register";
import dotenv from "dotenv";
dotenv.config();
import "./db";
import { logger } from "@modules/log";
import { minaAstronaut } from "./lib/minaAstronaut";
import "./server";

const log = logger("APP");

const graceful = async () => {
  log.info("\n\nBye!");
  // gracefully exit processes here:
  process.exit(0);
};
process.on("SIGTERM", graceful);
process.on("SIGINT", graceful);

log.info(`

${minaAstronaut}

Mina-Hub-Server-Assistant 


`);
