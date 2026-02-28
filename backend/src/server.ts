import app from "./app";
import logger from "./utils/logger.js";

const PORT = process.env.PORT;

app.listen(PORT || 4000, () => {
  logger.info(`Server is listening on Port ${PORT}`);
});
