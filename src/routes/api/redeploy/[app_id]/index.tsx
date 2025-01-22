import { type RequestHandler } from "@builder.io/qwik-city";
import { deployApplication } from "~/server/modules/admin/app/controller";


export const onGet: RequestHandler = async (requestEvent) => {
  try {

    await deployApplication(requestEvent.params.app_id)

    requestEvent.json(200, { status: 1 });
  } catch (err) {
    requestEvent.json(400, { status: 0, message: err.message });
  }
};
