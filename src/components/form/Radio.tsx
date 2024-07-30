import {
  $,
  component$,
  useSignal,
  useStore,
  useStyles$,
  useVisibleTask$,
} from "@builder.io/qwik";
import styles from "./radio.scss?inline";
import { getControlValue, restructureControls } from "~/utils";
import FormControls from "./FormControls";
const Radio = component$(
  (props: {
    name: string;
    display: string;
    value?: string | number;
    options: any;
    placeholder: any;
    variants: any;
    validator?: string;
    orientation?: string;
    width?: string;
  }) => {
    useStyles$(styles);
    const currentId = useSignal(null);
    const variants = useStore({});
    const orientation = useSignal(props.orientation || "vertical");

    const changeHandler = $((e) => {
      const value = getControlValue(e.target);

      const id = String(e.target.value).toLowerCase().replaceAll(" ", "-");

      const variantConfig: any = props.variants.find((item) => {
        return item.ref_name == `${e.target.name} - ${value}`;
      });

      if (currentId.value != null && currentId.value != id) {
        return;
      }

      if (!variantConfig) {
        return;
      }
      variants[currentId.value] = [];

      currentId.value = id;

      variants[id] = restructureControls(variantConfig?.controls || []);
    });
    return (
      <div
        class="radio-container form-group mb-3"
        style={{ width: props.width }}
      >
        <label class="fs-12 roboto-regular">{props.display}</label>
        <div class={`radio-item-container ${orientation.value}`}>
          {props.options.map((item) => {
            const id = String(item.value).toLowerCase().replaceAll(" ", "-");

            return (
              <div class="radio-item form-group">
                <div>
                  <input
                    type="radio"
                    value={item.value}
                    id={id}
                    name={props.name}
                    onChange$={changeHandler}
                  />
                  <label for={id}>{item.label}</label>
                </div>
                {(variants[id] || []).length ? (
                  <FormControls controls={variants[id]} />
                ) : (
                  <></>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  }
);

export default Radio;
