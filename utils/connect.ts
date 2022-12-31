import mongoose from "mongoose";
import config from "config";
import log from "./logger";

const connection = () => {
  const dbURI = config.get<string>("dbURI");

  mongoose.set("strictQuery", false);

  return mongoose
    .connect(dbURI)
    .then(() => {
      log.info("Connected to DB");
    })
    .catch((err) => {
      log.error("Could not connect to DB");
      log.error(err);
      process.exit(1);
    });
};

export default connection;
