import { component$ } from "@builder.io/qwik";

const InputCheck = component$(
  (props: {
    name: string;
    label: string;
    content?: string;
    checked?: boolean;
  }) => {
    return (
      <div class="form-group form-check">
        <input
          type="checkbox"
          class="form-control form-control-lg"
          id={props.name}
          name={props.name}
          {...(props["data-type"] ? { "data-type": props["data-type"] } : {})}
          {...(props.checked ? { checked: true } : {})}
        />
        &nbsp; &nbsp;
        <label for={props.name} class="form-label font-16-400 font-openregular">
          {props.label}
        </label>
        {props.content && <span>{props.content}</span>}
      </div>
    );
  },
);

export default InputCheck;
