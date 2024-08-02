import { $, component$, useContext, useStyles$ } from "@builder.io/qwik";
import styles from "./toolbar.scss?inline";
import { TabContext } from "~/root";
export const Toolbar = component$((props: { items: any[] }) => {
  useStyles$(styles);

  const tabContext = useContext(TabContext);

  const clickHandler = $((e) => {
    tabContext.active = "add";

    setTimeout(() => {
      tabContext.active = null;
    }, 1000);
  });

  return (
    <div class="toolbar-content">
      <div class="action-container">
        {props.items.map((item) => {
          return (
            <>
              <button
                type="button"
                class="btn btn-dark"
                data-mdb-ripple-init
                data-mdb-ripple-color="dark"
                onClick$={clickHandler}
                data-action={item.ref_name}
              >
                {item.display}
              </button>
              &nbsp;
            </>
          );
        })}
      </div>
    </div>
  );
});
