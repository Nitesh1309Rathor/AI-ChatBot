import app from "./app.js";
import logger from "./utils/logger.js";

const PORT = process.env.PORT;

app.listen(PORT || 4000, () => {
  logger.info(`Server is listening on Port ${PORT}`);
});
