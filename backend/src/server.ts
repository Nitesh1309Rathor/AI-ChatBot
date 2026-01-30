import app from "./app";
import logger from "./utils/logger.js";

const PORT = process.env.PORT;

app.listen(PORT, () => {
  logger.info(`Server is listening on Port ${PORT}`);
});
