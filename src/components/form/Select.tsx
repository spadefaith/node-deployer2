import {
  $,
  component$,
  useOnDocument,
  useSignal,
  useStore,
  useStyles$,
  useTask$,
  useVisibleTask$,
} from "@builder.io/qwik";
import FormControls from "./FormControls";
import { initGlobal, parseMedia, restructureControls } from "~/utils";
// import styles from "./select.scss?inline";
import { isServer } from "@builder.io/qwik/build";

const Select = component$(
  (props: {
    name: string;
    display: string;
    value?: string | number;
    options: any;
    placeholder: any;
    variants: any;
    validator?: string;
    help?: any;
    optionApi?: string;
    width?: string;
    event?: {
      trigger?: string[];
      subscribe?: string[];
    };
  }) => {
    // useStyles$(styles);
    const selectedValue = useSignal(null);
    const variants = useSignal([]);
    const options = useSignal([]);

    useVisibleTask$(({ track }) => {
      track(() => selectedValue.value);
      track(() => variants.value);
    });

    useTask$(async () => {
      if (props.optionApi) {
        const resp = await fetch(props.optionApi);

        if (resp.ok) {
          const json = await resp.json();

          if (json.status) {
            options.value = [
              { value: null, label: props.placeholder || "Select..." },
              ...json.data,
            ];
          }
        }
      } else {
        options.value = [
          { value: null, label: props.placeholder || "Select..." },
          ...props.options,
        ];
      }
    });

    useVisibleTask$(() => {
      if (isServer) {
        return;
      }
      if (props.event && props.event.subscribe) {
        props.event.subscribe.forEach((event) => {
          const key = `${event}`;
          if (!document[`event-${key}`]) {
            document.addEventListener(key, (e) => {
              //call the api here
              options.value = [
                {
                  id: 1,
                  label: "Alabama",
                  value: "Alabama",
                  selected: null,
                  hint: null,
                },
              ];
            });
            document[`event-${key}`] = true;
          }
        });
      }
    });

    const changeHandler = $((e) => {
      const target = e.target;
      if (props.event && props.event.trigger) {
        props.event.trigger.forEach((event) => {
          const key = `${event}`;
          document.dispatchEvent(
            new CustomEvent(key, {
              detail: { value: target.value, name: props.name },
            })
          );
        });
      }
    });

    return (
      <div
        class={`form-group control-select ${props.help ? "has-help" : ""} mb-3`}
        style={{ width: props.width }}
      >
        <label for={props.name} class="form-label fs-12 roboto-regular">
          {props.display}
        </label>
        <select
          onChange$={changeHandler}
          class="form-select form-control"
          aria-label="Default select example"
          name={props.name}
          id={props.name}
          {...(props.validator ? { "data-validator": props.validator } : {})}
        >
          {options.value.map((item, index) => {
            if (props.value && props.value == item.value) {
              return (
                <option value={item.value} selected>
                  {item.label}
                </option>
              );
            }
            return <option value={item.value}>{item.label}</option>;
          })}
        </select>
        {variants.value.length ? (
          <FormControls controls={variants.value} />
        ) : (
          <></>
        )}
      </div>
    );
  }
);

export default Select;
