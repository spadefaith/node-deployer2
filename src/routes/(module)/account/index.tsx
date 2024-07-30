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
  useContent,
  z,
  zod$,
} from "@builder.io/qwik-city";
import { Drawer } from "~/components/drawer";
import FormControls from "~/components/form/FormControls";
import Table from "~/components/table";
import { TabContext } from "~/root";
import {
  create,
  getMeta,
  paginate,
} from "~/server/modules/admin/account/controller";
import Lifecycle from "~/server/modules/admin/account/lifecycle";
import { getFormData } from "~/utils";

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

export const useCreate = routeAction$(
  async (
    data: {
      username: string;
      password: string;
      email: string;
      first_name: string;
      last_name: string;
      role_id: string;
    },
    { cookie, redirect, url }
  ) => {
    try {
      const lifecycle = new Lifecycle({});
      await lifecycle.parseQwikCookies(data, cookie);

      console.log(58, data);

      const created = await create(lifecycle);

      return { success: true };
    } catch (err) {
      console.log(64, err);
      return { success: false, message: err.message };
    }
  },
  zod$({
    username: z.string(),
    email: z.string(),
    password: z.string(),
    first_name: z.string(),
    last_name: z.string(),
    role_id: z.string(),
  })
);

export const AccountPage = component$((props) => {
  const columns = useSignal([]);
  const meta = useSignal([] as any);
  const tabContext = useContext(TabContext);
  const showDrawer = useSignal(false);
  const actionCreate = useCreate();
  useTask$(async () => {
    meta.value = await getMeta();

    columns.value = meta.value?.components?.table?.column || [];
  });

  useVisibleTask$(() => {
    console.log(38, meta.value);
  });

  useVisibleTask$(({ track }) => {
    track(() => tabContext.active);

    if (tabContext.active == "add") {
      showDrawer.value = true;
    }
  });

  const paginateHandler = $((e) => {
    return getPagination(e);
  });

  const drawerHandler = $((e) => {
    if (e.state == "hide") {
      showDrawer.value = false;
    }
  });

  const submitHandler = $(async (e) => {
    const data = getFormData(e.target);
    const {
      value: { success },
    } = (await actionCreate.submit(data)) || {};

    console.log(109, success);
  });

  return (
    <div>
      <Table paginateHandler={paginateHandler} columns={columns.value} />

      {showDrawer.value ? (
        <Drawer handler={drawerHandler}>
          <div
            style={{
              backgroundColor: "white",
              height: "100%",
              padding: "14px",
            }}
          >
            <h3>Add Account</h3>
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

export default AccountPage;
