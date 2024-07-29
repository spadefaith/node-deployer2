import { $, component$, useContext, useStyles$ } from "@builder.io/qwik";
import styles from "./toolbar.scss?inline";
import { TabContext } from "~/root";
export const Toolbar = component$((props) => {
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
        <button
          type="button"
          class="btn btn-dark"
          data-mdb-ripple-init
          data-mdb-ripple-color="dark"
          onClick$={clickHandler}
        >
          Add
        </button>
        &nbsp;
        <button
          type="button"
          class="btn btn-dark"
          data-mdb-ripple-init
          data-mdb-ripple-color="dark"
        >
          Download
        </button>
      </div>
    </div>
  );
});
