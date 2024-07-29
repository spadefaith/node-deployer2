import {
  component$,
  useSignal,
  useStyles$,
  useVisibleTask$,
} from "@builder.io/qwik";
import styles from "./input.scss?inline";
const Input = component$(
  (props: {
    name: string;
    type: "number" | "text" | "email" | "hidden" | "date" | "file";
    label?: string;
    placeholder: string;
    display: string;
    value?: string | number;
    validator?: string;
    width?: string;
    readonly?: boolean;
  }) => {
    useStyles$(styles);

    return (
      <div
        class="mb-3 form-group"
        data-mdb-input-init
        style={{ width: props.width }}
      >
        {props.display ? (
          <label class="form-label fs-12 roboto-regular" for={props.name}>
            {props.display}
          </label>
        ) : (
          <></>
        )}
        <input
          class="form-control"
          type={props.type}
          id={props.name}
          name={props.name}
          placeholder={props.placeholder || ""}
          value={props.value || null}
          {...(props.validator ? { "data-validator": props.validator } : {})}
          {...(props.readonly ? { readonly: true } : {})}
        />
      </div>
    );
  }
);

export default Input;
