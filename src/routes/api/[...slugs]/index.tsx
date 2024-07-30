import { RequestHandler } from "@builder.io/qwik-city";
import server from "~/server";
import { handleRequest } from "~/utils/api-handler";

export const onRequest: RequestHandler = async (requestEvent) => {
  try {
    // const res = await server.fetch(requestEvent.request);

    const loop = (src, target) => {
      for (const entries of src.entries()) {
        const key = entries[0];
        const value = entries[1];
        target[key] = value;
      }
    };

    const headers = {};
    const query = {};

    loop(requestEvent.request.headers, headers);
    loop(requestEvent.url.searchParams, query);

    const res = await handleRequest({
      method: requestEvent.request.method,
      path: requestEvent.pathname,
      headers,
      query,
    });

    requestEvent.json(200, res);
  } catch (err) {
    requestEvent.json(400, { status: 0, message: err.message });
  }
};
