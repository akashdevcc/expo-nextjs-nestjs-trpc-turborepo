import type { CreateFastifyContextOptions } from "@trpc/server/adapters/fastify";
import type { FastifyRequest } from "fastify";
import { Injectable } from "@nestjs/common";

import type { Logger } from "@acme/logging";
import { LoggerFactory } from "@acme/logging";
import { createInnerContext } from "@acme/trpc";

@Injectable()
export class AppContextFactory {
  private readonly logger: Logger =
    LoggerFactory.getLogger("AppContextFactory");

  create() {
    return ({ req }: CreateFastifyContextOptions) => {
      const source = this.getSource(req);

      // Authentication Logic:
      // - Get JWT access token from `req` object, validate and then populate session if valid.

      return createInnerContext({
        session: null,
        source,
      });
    };
  }

  getSource(req: FastifyRequest): string {
    const source = req.headers["x-trpc-source"];

    if (!source) {
      return "unknown";
    } else if (typeof source === "string") {
      return source;
    } else if (source.length > 0) {
      return source[0] ?? "unknown";
    } else {
      return "unknown";
    }
  }
}
