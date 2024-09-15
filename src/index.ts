import express from "express";
import { AppDataSource } from "./infrastructure/data-source";
import { createMainRouter } from "./presentation/routes";
import pinoHttp from "pino-http";
import logger from "./infrastructure/logger/logger";
import { errorHandler } from "./presentation/middlewares/errorHandler";

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(pinoHttp({ logger }));

AppDataSource.initialize()
    .then(() => {
        const mainRouter = createMainRouter(AppDataSource);
        app.use("/", mainRouter);

        app.use(errorHandler);

        app.listen(port, () => {
            console.log(`Server is running on http://localhost:${port}`);
        });
    })
    .catch((error) => {
        console.error("Error during Data Source initialization", error);
    });


