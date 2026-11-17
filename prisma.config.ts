import { defineConfig } from "prisma";

export default defineConfig({
  schema: "./prisma/schema.prisma",
  datasource: {
    url: "file:./dev.db",
  },
});