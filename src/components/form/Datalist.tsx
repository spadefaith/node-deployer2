import { component$ } from "@builder.io/qwik";

type DatalistOptionType = {
  value: string;
};

const Datalist = component$(
  (props: {
    name: string;
    label: string;
    placeholder: string;
    validator?: string;
    value?: string | number;
    options: DatalistOptionType[];
  }) => {
    return (
      <div class="form-group">
        <label
          for={props.name}
          class="form-label font-24-800 font-manropeextrabold"
        >
          {props.label}
        </label>
        <input
          class="form-control form-control-lg"
          id={props.name}
          name={props.name}
          placeholder={props.placeholder || ""}
          value={props.value || null}
          //@ts-ignore
          list={`${props.name}s`}
          {...(props.validator ? { "data-validator": props.validator } : {})}
        />
        <datalist id={`${props.name}s`}>
          {(props.options || []).map((item) => (
            <option
              value={item.value}
              key={String(item.value).split(" ").join("")}
            />
          ))}
        </datalist>
      </div>
    );
  },
);

export default Datalist;
