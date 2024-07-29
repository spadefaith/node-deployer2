import { component$, useStyles$ } from "@builder.io/qwik";
import styles from "./input.scss?inline";
const Input = component$(
  (props: {
    name: string;
    type: "number" | "text" | "email" | "hidden" | "date";
    label?: string;
    placeholder: string;
    display: string;
    value?: string | number;
    validator?: string;
  }) => {
    useStyles$(styles);

    return (
      <div class="form-group control-input-inline">
        {props.display ? (
          <label for={props.name} class="form-label fs-12 roboto-regular">
            {props.display}
          </label>
        ) : (
          <></>
        )}
        <input
          type={props.type}
          class="form-control form-control-lg roboto-regular fs-16"
          id={props.name}
          name={props.name}
          placeholder={props.placeholder || ""}
          value={props.value || null}
          {...(props.validator ? { "data-validator": props.validator } : {})}
        />
      </div>
    );
  }
);

export default Input;
