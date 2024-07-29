import {
  $,
  Slot,
  component$,
  useOnWindow,
  useSignal,
  useStyles$,
  useVisibleTask$,
} from "@builder.io/qwik";
import styles from "./FormControlGroup.scss?inline";
import { getWindowWidth } from "~/utils/client-utils";
const FormControlGroup = component$(
  (props: {
    col?: number;
    classes?: string;
    display?: string;
    name: string;
    responsive?: number;
  }) => {
    useStyles$(styles);
    const containerRef = useSignal(null);

    const resp = $(() => {
      if (props.responsive) {
        const windowWidth = getWindowWidth();
        if (props.responsive >= windowWidth && containerRef.value) {
          if (!containerRef.value.classList.contains("responsive")) {
            containerRef.value.classList.add("responsive");
          }
        } else {
          if (containerRef.value.classList.contains("responsive")) {
            containerRef.value.classList.remove("responsive");
          }
        }
      }
    });

    useOnWindow(
      "resize",
      $(() => {
        resp();
      })
    );

    useVisibleTask$(() => {
      resp();
    });

    return (
      <div
        class={`form-control-item form-col-${props.col || 1} ${props.classes} `}
      >
        {props.display ? (
          <p class="roboto-bold fs-14">{props.display}</p>
        ) : (
          <></>
        )}
        <div class="form-group-controls" ref={containerRef}>
          <Slot />
        </div>
      </div>
    );
  }
);

export default FormControlGroup;
