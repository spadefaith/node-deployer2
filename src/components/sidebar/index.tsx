import {
  $,
  component$,
  useSignal,
  useStyles$,
  useTask$,
} from "@builder.io/qwik";
import styles from "./sidebar.scss?inline";
import { Link, useLocation, useNavigate } from "@builder.io/qwik-city";
export const Sidebar = component$((props: { items: any[] }) => {
  useStyles$(styles);
  const containerRef = useSignal(null);
  const location = useLocation();
  const items = useSignal([]);
  useTask$(() => {
    items.value = props.items.map((item) => {
      if (location.url.pathname.includes(item.link)) {
        item.is_active = true;
      }

      return item;
    });
  });
  return (
    <div class="sidebar-content">
      <div class="top">
        <p>
          <strong>Deployer</strong>
        </p>
      </div>
      <div class="middle" ref={containerRef}>
        {items.value.map((item) => {
          return (
            <div class="sidebar-item">
              <a
                type="button"
                class={`btn btn-outline-light ${item.is_active ? "is-active" : ""}`}
                data-mdb-ripple-init
                data-mdb-ripple-color="dark"
                href={item.link}
              >
                <i class={`fas ${item.icon}`}></i>&nbsp;
                {item.display}
              </a>
            </div>
          );
        })}
      </div>

      <div class="bottom"></div>
    </div>
  );
});

export default Sidebar;
