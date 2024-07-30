import {
  $,
  component$,
  useContext,
  useSignal,
  useTask$,
  useVisibleTask$,
} from "@builder.io/qwik";
import {
  routeAction$,
  server$,
  useLocation,
  z,
  zod$,
} from "@builder.io/qwik-city";
import Breadcrumb from "~/components/breadcrumb";
import { Drawer } from "~/components/drawer";
import FormControls from "~/components/form/FormControls";
import Table from "~/components/table";
import { TabContext } from "~/root";
import { getMany } from "~/server/modules/admin/env/controller";
import {
  create,
  getMeta,
  paginate,
} from "~/server/modules/admin/env/controller";
import Lifecycle from "~/server/modules/admin/env/lifecycle";
import { getFormData } from "~/utils/client-utils";

const getPagination = server$(async function (params) {
  try {
    const datas = await paginate(params);

    return {
      status: 1,
      data: JSON.parse(JSON.stringify(datas)),
    };
  } catch (err) {
    console.log(15, err);
    return { status: 0 };
  }
});

export const createRecord = server$(async function (
  data: {
    prop_key: string;
    prop_value: string;
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

export const useQueryAllEnv = server$(async function () {
  try {
    const query = {};

    for (const entries of this.url.searchParams.entries()) {
      const key = entries[0];
      const value = entries[1];
      query[key] = value;
    }

    return getMany({
      app_id: query["app-id"],
    });
  } catch (err) {
    return [];
  }
});

export const getAppMeta = server$(async function () {
  try {
    const query = {};

    for (const entries of this.url.searchParams.entries()) {
      const key = entries[0];
      const value = entries[1];
      query[key] = value;
    }

    return getMeta(query["app-id"]);
  } catch (err) {
    return [];
  }
});

export default component$((props) => {
  const columns = useSignal([]);
  const location = useLocation();
  const tabContext = useContext(TabContext);
  const meta = useSignal([] as any);
  const showDrawer = useSignal(false);

  useTask$(async () => {
    meta.value = await getAppMeta();

    columns.value = meta.value?.components?.table?.column || [];
  });

  useVisibleTask$(({ track }) => {
    track(() => tabContext.active);

    if (tabContext.active == "add") {
      showDrawer.value = true;
    }
  });

  const paginateHandler = $((e) => {
    const appId = location.url.searchParams.get("app-id");
    e.app_id = appId;
    console.log(e);
    return getPagination(e);
  });

  const drawerHandler = $((e) => {
    if (e.state == "hide") {
      showDrawer.value = false;
    }
  });

  const submitHandler = $(async (e) => {
    const data: any = getFormData(e.target);

    const envs: {
      prop_key: string;
      prop_value: string;
    }[] = Object.keys(data).reduce((accu, key) => {
      if (key.includes("key_")) {
        const [name, k] = key.split(":");
        const [_k, i] = k.split("_");

        const value = data[`${name}:value_${i}`];

        accu.push({
          prop_key: data[key],
          prop_value: value,
          app_id: location.url.searchParams.get("app-id"),
        });
      }

      return accu;
    }, []);

    const resp = (await createRecord(envs)) || {};

    console.log(109, resp);
  });

  return (
    <div>
      <Breadcrumb
        items={[
          { display: "App", link: "/app" },
          { display: "Environment Variable" },
        ]}
      />
      <Table paginateHandler={paginateHandler} columns={columns} />

      {showDrawer.value ? (
        <Drawer handler={drawerHandler}>
          <div
            style={{
              backgroundColor: "white",
              height: "100%",
              padding: "14px",
            }}
          >
            <h3>Add Env</h3>
            <br />
            <form onSubmit$={submitHandler} preventdefault:submit>
              <FormControls
                controls={meta.value?.components?.form?.add || []}
              />
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
        </Drawer>
      ) : (
        <></>
      )}
    </div>
  );
});
