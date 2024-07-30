import { component$ } from "@builder.io/qwik";
import { mergeTo } from "~/utils/client-utils";

const TextArea = component$(
  (props: {
    name: string;
    label?: string;
    placeholder: string;
    validator?: string;
    height?: string;
    display?: string;
    value?: string;
  }) => {
    return (
      <div class="form-group">
        <label
          for={props.name}
          class="form-label font-24-800 font-manropeextrabold"
        >
          {props.display}
        </label>
        <textarea
          class="form-control form-control-lg"
          id={props.name}
          name={props.name}
          placeholder={props.placeholder || ""}
          value={props.value || null}
          {...(props.validator ? { "data-validator": props.validator } : {})}
          style={{
            ...mergeTo(props.height, {
              height: props.height,
            }),
          }}
        />
      </div>
    );
  }
);

export default TextArea;
