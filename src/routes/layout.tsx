import {
  component$,
  Slot,
  useSignal,
  useStyles$,
  useTask$,
  useVisibleTask$,
} from "@builder.io/qwik";
import type { RequestHandler } from "@builder.io/qwik-city";
import styles from "./layout.scss?inline";
import Sidebar from "~/components/sidebar";
import { Toolbar } from "~/components/toolbar";
import {
  getSidebar,
  getToolbar,
} from "~/server/modules/admin/role-permission/controller";
export const onGet: RequestHandler = async ({ cacheControl }) => {
  // Control caching for this request for best performance and to reduce hosting costs:
  // https://qwik.dev/docs/caching/
  cacheControl({
    // Always serve a cached response by default, up to a week stale
    staleWhileRevalidate: 60 * 60 * 24 * 7,
    // Max once every 5 seconds, revalidate on the server to get a fresh version of this page
    maxAge: 5,
  });
};

export default component$(() => {
  useStyles$(styles);
  const sidebar = useSignal([]);
  const toolbar = useSignal([]);
  useTask$(async () => {
    toolbar.value = await getToolbar({ role_id: 1 });
    sidebar.value = await getSidebar({ role_id: 1 });
  });

  return (
    <div class="layout-container">
      <div class="layout-content">
        <div class="sidebar">
          <Sidebar items={sidebar.value} />
        </div>
        {toolbar?.value?.length ? (
          <div class="header">
            <Toolbar items={toolbar.value} />
          </div>
        ) : (
          <></>
        )}
        <div class="main">
          <Slot />
        </div>
      </div>
    </div>
  );
});
