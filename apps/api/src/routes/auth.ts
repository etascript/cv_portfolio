import type { FastifyPluginAsync } from "fastify";
import argon2 from "argon2";
import { loginSchema } from "@etascript/shared";
import { env } from "../env.js";
import { findUserByEmail } from "../services/content.js";

export const authRoutes: FastifyPluginAsync = async (fastify) => {
  fastify.post("/auth/login", { config: { rateLimit: { max: 5, timeWindow: "1 minute" } } }, async (request, reply) => {
    const parsed = loginSchema.safeParse(request.body);
    if (!parsed.success) return reply.code(400).send({ message: "Invalid login" });

    const user = await findUserByEmail(parsed.data.email);
    if (!user) return reply.code(401).send({ message: "Invalid credentials" });

    const valid = await argon2.verify(user.passwordHash, parsed.data.password);
    if (!valid) return reply.code(401).send({ message: "Invalid credentials" });

    const token = fastify.jwt.sign({ sub: user.id, role: user.role });
    reply.setCookie("sebastian_cortes_admin", token, {
      path: "/",
      httpOnly: true,
      sameSite: "lax",
      secure: env.cookieSecure,
      maxAge: 60 * 60 * 8
    });

    return { ok: true };
  });

  fastify.post("/auth/logout", async (_request, reply) => {
    reply.clearCookie("sebastian_cortes_admin", { path: "/" });
    return { ok: true };
  });
};
