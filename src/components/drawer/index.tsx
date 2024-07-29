import {
  $,
  component$,
  QRL,
  Slot,
  useSignal,
  useStyles$,
  useVisibleTask$,
} from "@builder.io/qwik";
import { isServer } from "@builder.io/qwik/build";
import styles from "./index.scss?inline";
export const Drawer = component$(
  (props: { handler?: QRL<(e: any) => any> }) => {
    useStyles$(styles);
    const isShowBg = useSignal(false);
    const isVisible = useSignal(false);
    const isActive = useSignal(false);

    const closeDrawer = $(() => {
      setTimeout(() => {
        isShowBg.value = false;
      }, 50);
      setTimeout(() => {
        isVisible.value = false;
      }, 100);

      setTimeout(() => {
        isActive.value = false;

        props.handler &&
          props.handler({
            state: "hide",
          });
      }, 150);
    });
    const clickHandler = $((e) => {
      if (e.target.dataset.container) {
        closeDrawer();
      }
    });

    useVisibleTask$(() => {
      if (isServer) {
        return;
      }

      setTimeout(() => {
        isActive.value = true;
      }, 50);
      setTimeout(() => {
        isShowBg.value = true;
      }, 100);
      setTimeout(() => {
        isVisible.value = true;
        props.handler &&
          props.handler({
            state: "show",
          });
      }, 200);
    });

    return (
      <div
        class={`drawer-container ${isVisible.value ? "show" : ""} ${isShowBg.value ? "show-bg" : ""} ${isActive.value ? "" : ""}`}
        onClick$={clickHandler}
        data-container={1}
      >
        <div class="drawer-content">
          <Slot />
        </div>
      </div>
    );
  }
);
