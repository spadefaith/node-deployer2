import { component$, useStyles$ } from "@builder.io/qwik";
import styles from "./index.scss?inline";
const Breadcrumb = component$((props: { items: any[] }) => {
  useStyles$(styles);
  return (
    <div class="breadcrumb-container">
      <nav aria-label="breadcrumb">
        <ol class="breadcrumb">
          {props.items.map((item, index) => {
            if (props.items.length - 1 == index) {
              return (
                <li class="breadcrumb-item active" aria-current="page">
                  {item.display}
                </li>
              );
            }

            return (
              <li class="breadcrumb-item">
                <a href={item.link}>{item.display}</a>
              </li>
            );
          })}
        </ol>
      </nav>
    </div>
  );
});

export default Breadcrumb;
