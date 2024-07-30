import {
  $,
  component$,
  useSignal,
  useTask$,
  useVisibleTask$,
} from "@builder.io/qwik";
import { server$, useLocation } from "@builder.io/qwik-city";
import Breadcrumb from "~/components/breadcrumb";
import Table from "~/components/table";
import {
  getMeta,
  paginate,
} from "~/server/modules/admin/role-permission/controller";

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

export const metaServer = server$(() => getMeta());

export default component$((props) => {
  const columns = useSignal([]);
  const location = useLocation();

  useTask$(async () => {
    const meta = await metaServer();

    columns.value = meta?.components?.table?.column || [];
  });

  const paginateHandler = $((e) => {
    const roleId = location.url.searchParams.get("role-id");
    e.role_id = roleId;
    console.log(e);
    return getPagination(e);
  });

  return (
    <div>
      <Breadcrumb
        items={[
          { display: "Role", link: "/role" },
          { display: "Role Permission" },
        ]}
      />
      <Table paginateHandler={paginateHandler} columns={columns} />
    </div>
  );
});
