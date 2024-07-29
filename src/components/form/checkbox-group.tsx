import {
  $,
  component$,
  useSignal,
  useStore,
  useStyles$,
} from "@builder.io/qwik";
import styles from "./checkbox-group.scss?inline";
import { getControlValue, restructureControls } from "~/utils";
import FormControls from "./FormControls";
const CheckboxGroup = component$(
  (props: {
    name: string;
    display: string;
    value?: string | number;
    options: any;
    placeholder: any;
    variants: any;
    validator?: string;
  }) => {
    useStyles$(styles);

    const variants = useStore({});

    const changeHandler = $((e) => {
      const value = getControlValue(e.target);

      let id = String(e.target.value).toLowerCase().replaceAll(" ", "-");

      if (!value) {
        variants[id] = [];
        return;
      }

      const variantConfig: any = props.variants.find(
        (item) => item.ref_name == e.target.name
      );

      variants[id] = restructureControls(variantConfig?.controls?.data || []);
    });
    return (
      <div class="checkboxGroup-container">
        <label class="fs-18 roboto-bold">{props.display}</label>
        {props.options.map((item) => {
          let id = String(item.value).toLowerCase().replaceAll(" ", "-");

          return (
            <div class="checkboxGroup-item form-group">
              <div class="form-check form-switch">
                <input
                  onChange$={changeHandler}
                  type="checkbox"
                  value={item.value}
                  id={id}
                  name={`${props.name} - ${item.value}`}
                  class="form-check-input"
                />
                <label for={id} class="form-check-label">
                  {item.label}
                </label>
              </div>
              {(variants[id] || []).length ? (
                <FormControls data={variants[id]} />
              ) : (
                <></>
              )}
            </div>
          );
        })}
      </div>
    );
  }
);

export default CheckboxGroup;
