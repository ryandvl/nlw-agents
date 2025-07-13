import fastifyCors from "@fastify/cors";
import { fastify } from "fastify";
import {
  serializerCompiler,
  validatorCompiler,
  type ZodTypeProvider,
} from "fastify-type-provider-zod";

import { env } from "./env.ts";
import {
  createQuestionRoute,
  createRoomRoute,
  getRoomQuestionsRoute,
  getRoomsRoute,
} from "./http/routes/index.ts";

const app = fastify().withTypeProvider<ZodTypeProvider>();

app.register(fastifyCors, {
  origin: "http://localhost:5173",
});

app.setSerializerCompiler(serializerCompiler);
app.setValidatorCompiler(validatorCompiler);

app.get("/health", () => {
  return "OK";
});

app.register(createRoomRoute);
app.register(getRoomsRoute);
app.register(getRoomQuestionsRoute);
app.register(createQuestionRoute);

app.listen({
  port: env.PORT,
});
