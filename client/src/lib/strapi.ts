import { strapi } from "@strapi/client";

const strapiClient = strapi({
  baseURL: process.env.NEXT_PUBLIC_STRAPI_URL + "/api",
});

export { strapiClient };
