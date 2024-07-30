import {
  $,
  component$,
  useContext,
  useSignal,
  useTask$,
  useVisibleTask$,
} from "@builder.io/qwik";
import { routeAction$, server$, z, zod$ } from "@builder.io/qwik-city";
import { Drawer } from "~/components/drawer";
import FormControls from "~/components/form/FormControls";
import Table from "~/components/table";
import { TabContext } from "~/root";
import {
  create,
  getLogs,
  getMeta,
  logCache,
  paginate,
  update,
} from "~/server/modules/admin/app/controller";
import Lifecycle from "~/server/modules/admin/app/lifecycle";
import { getFormData } from "~/utils/client-utils";
import { downloadLocalFile } from "~/utils/client-utils";

const getAppLogsCache = server$(async (name) => {
  try {
    const message = await logCache(name);
    console.log(26, message);
    return message;
  } catch (err) {
    console.log(30, err);
  }
});

const getPagination = server$(async (params) => {
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

const getAppLogs = server$((name) => {
  return getLogs(name);
});

export const metaServer = server$(() => getMeta());

export const createRecord = server$(async function (data: {
  name?: string;
  provider?: string;
  branch?: string;
  repo?: string;
  env?: any;
}) {
  try {
    const lifecycle = new Lifecycle({});
    await lifecycle.parseQwikCookies(data, this.cookie);

    console.log(58, data);

    const created = await create(lifecycle);

    return { success: true };
  } catch (err) {
    console.log(64, err);
    return { success: false, message: err.message };
  }
});

export const editRecord = server$(async function (data: {
  name: string;
  provider: string;
  branch: string;
  repo: string;
}) {
  try {
    const lifecycle = new Lifecycle({});
    await lifecycle.parseQwikCookies(data, this.cookie);

    console.log(58, data);

    const created = await update(lifecycle);

    return { success: true };
  } catch (err) {
    console.log(64, err);
    return { success: false, message: err.message };
  }
});

export const AppPage = component$((props) => {
  const columns = useSignal([]);
  const meta = useSignal([] as any);
  const showDrawer = useSignal(false);
  const tabContext = useContext(TabContext);

  const isReload = useSignal(false);
  const formType = useSignal("add");
  const formControls = useSignal([]);
  const editData = useSignal({});

  const currentApp = useSignal("");

  const selectFormControls = $((type) => {
    return (
      (type == "add"
        ? meta.value?.components?.form?.add
        : meta.value?.components?.form?.edit) || []
    );
  });

  useTask$(async () => {
    meta.value = await metaServer();

    columns.value = meta.value?.components?.table?.column || [];

    formControls.value = await selectFormControls(formType.value);
  });

  useVisibleTask$(({ track }) => {
    track(() => tabContext.active);

    console.log(meta.value);

    if (tabContext.active == "add") {
      showDrawer.value = true;
    }
  });

  const paginateHandler = $((e) => {
    return getPagination(e);
  });

  const rowActionHandler = $(async (e) => {
    const { data, action } = e;

    if (action == "add_env") {
      window.location.href = `/app/env?app-id=${data.app_id}`;
    } else if (action == "edit") {
      formType.value = "edit";
      editData.value = data;
      currentApp.value = data.name;
      formControls.value = await selectFormControls(formType.value);
      showDrawer.value = true;
    } else if (action == "logs") {
      const content = await getAppLogs(data.name);

      downloadLocalFile(`${data.name}-logs.txt`, "text/plain", content);
    }
  });

  const drawerHandler = $((e) => {
    if (e.state == "hide") {
      showDrawer.value = false;
      editData.value = {};
      formType.value = "add";
    }
  });
  const submitHandler = $(async (e) => {
    const data = getFormData(e.target);

    const { envs, reg } = Object.keys(data).reduce(
      (accu, key) => {
        if (key.includes("key_")) {
          const [name, k] = key.split(":");
          const [_k, i] = k.split("_");

          const value = data[`${name}:value_${i}`];
          accu.envs[data[key]] = value;
        } else if (!key.includes("value_")) {
          accu.reg[key] = data[key];
        }

        return accu;
      },
      {
        envs: {},
        reg: {},
      }
    );

    const { success } =
      (await createRecord({
        env: envs,
        ...reg,
      })) || {};

    if (success) {
      isReload.value = true;
      showDrawer.value = false;
    }
  });

  const submitEditHandler = $(async (e) => {
    const data: any = getFormData(e.target);
    const { success } = (await editRecord(data)) || {};

    const intervalId = setInterval(async () => {
      const message = await getAppLogsCache(currentApp.value);
      console.log(206, message);
      message && console.log(message);
    }, 1000);

    setTimeout(() => clearInterval(intervalId), 20000);

    if (success) {
      isReload.value = true;
      showDrawer.value = false;
    }
  });

  return (
    <div>
      <Table
        paginateHandler={paginateHandler}
        columns={columns}
        rowActionHandler={rowActionHandler}
        isReload={isReload}
      />

      {showDrawer.value ? (
        <Drawer handler={drawerHandler}>
          <div
            style={{
              backgroundColor: "white",
              height: "100%",
              padding: "14px",
            }}
          >
            <h3>App</h3>
            <br />
            <form
              onSubmit$={
                formType.value == "add" ? submitHandler : submitEditHandler
              }
              preventdefault:submit
            >
              <FormControls
                controls={formControls.value}
                data={editData.value}
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

export default AppPage;
