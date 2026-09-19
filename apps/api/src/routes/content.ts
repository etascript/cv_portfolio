import type { FastifyPluginAsync } from "fastify";
import { contactMessageSchema } from "@etascript/shared";
import { sqlite } from "../db/client.js";
import { getPortfolioContent } from "../services/content.js";

export const contentRoutes: FastifyPluginAsync = async (fastify) => {
  fastify.get("/content", async () => getPortfolioContent());

  fastify.post("/contact", async (request, reply) => {
    const parsed = contactMessageSchema.safeParse(request.body);
    if (!parsed.success) return reply.code(400).send({ message: "Invalid contact message" });

    sqlite.prepare("INSERT INTO contact_messages (name, email, message, created_at) VALUES (?, ?, ?, ?)").run(
      parsed.data.name.trim(),
      parsed.data.email.trim(),
      parsed.data.message.trim(),
      new Date().toISOString()
    );

    return { ok: true };
  });
};
