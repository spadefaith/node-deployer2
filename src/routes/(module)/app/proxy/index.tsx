import {
  $,
  component$,
  useSignal,
  useStyles$,
  useTask$,
} from "@builder.io/qwik";
import { server$, useLocation } from "@builder.io/qwik-city";
import Breadcrumb from "~/components/breadcrumb";
import JsonEditor from "~/components/json";

import Lifecycle from "~/server/modules/admin/env/lifecycle";
import { getFormData } from "~/utils/client-utils";
import styles from "~/routes/(module)/app/proxy/index.scss?inline";
import { create, getOne } from "~/server/modules/admin/proxy/controller";

export const createRecord = server$(async function (
  data: {
    config: string;
    app_id: string;
  }[]
) {
  try {
    const lifecycle = new Lifecycle({});
    await lifecycle.parseQwikCookies(data, this.cookie);

    console.log(58, data);

    const created = await create(lifecycle);

    return { success: false };
  } catch (err) {
    console.log(64, err);
    return { success: false, message: err.message };
  }
});

export const getRecord = server$(async function () {
  const appId = this.url.searchParams.get("app-id");
  const config = await getOne({ app_id: appId });
  return config || {};
});

export default component$((props) => {
  useStyles$(styles);
  const app = useSignal<any>({});
  const location = useLocation();
  useTask$(async () => {
    app.value = await getRecord();
    console.log(50, app.value);
  });

  const submitHandler = $(async (e) => {
    const data: any = getFormData(e.target);

    console.log(55, data);

    createRecord({ ...data, app_id: location.url.searchParams.get("app-id") });
  });

  return (
    <div class="proxy-container">
      <Breadcrumb
        items={[
          { display: "App", link: "/app" },
          { display: "NGINX Configuration" },
        ]}
      />

      <form onSubmit$={submitHandler} preventdefault:submit>
        <JsonEditor name="config" content={app.value.config} />
        <br />
        <button type="submit" class="btn btn-dark">
          Submit
        </button>
        &nbsp;
        <button type="button" class="btn btn-light">
          Cancel
        </button>
      </form>
    </div>
  );
});
