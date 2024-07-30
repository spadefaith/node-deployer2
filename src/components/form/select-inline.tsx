import {
  $,
  component$,
  useSignal,
  useStore,
  useStyles$,
  useVisibleTask$,
} from "@builder.io/qwik";
import { Drawer } from "../drawer";
import FormControls from "./FormControls";
import {
  initGlobal,
  mergeTo,
  parseMedia,
  restructureControls,
} from "~/utils/client-utils";
import styles from "./select-inline.scss?inline";
import { isServer } from "@builder.io/qwik/build";

type OptionItemType = {
  value: string;
  display: string;
  id: number;
  selected?: boolean;
};

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
  }) => {
    useStyles$(styles);
    const showOptions = useSignal(false);
    const selectedValue = useSignal(null);
    const variants = useSignal([]);
    const inputRef = useSignal(null);
    const inputValueRef = useSignal(null);
    const drawerState = useStore({
      current: "show",
      origin: "self",
    });

    useVisibleTask$(({ track }) => {
      track(() => selectedValue.value);
      track(() => variants.value);

      console.log(47, props.help);
    });

    const drawerHandler = $((e) => {
      showOptions.value = e.state == "show";
    });

    const optionHandler = $((e) => {
      const target = e.target;
      if (target.value) {
        const { value, textContent } = target;
        selectedValue.value = value;

        inputRef.value.setAttribute("value", textContent);
        inputValueRef.value.setAttribute("value", value);

        inputRef.value.form.dispatchEvent(
          new CustomEvent("x-input", {
            detail: { target: inputValueRef.value },
          })
        );

        drawerState.current = "hide";
        drawerState.origin = "parent";

        const variantConfig = props.variants.find(
          (item) => item.ref_name == value
        );

        variants.value = restructureControls(
          variantConfig?.controls?.data || []
        );

        // console.log(55, variants.value);
      }
    });

    return (
      <div>
        <div
          class={`form-group control-select ${props.help ? "has-help" : ""}`}
          data-mdb-input-init
        >
          <label for={props.name} class="form-label fs-12 roboto-regular">
            {props.display}
          </label>
          <div class={`control-container `}>
            {props.help ? (
              <a
                class="help-target"
                data-tippy-content={props.help.content}
                onClick$={(e: any) => {
                  if (isServer) {
                    return;
                  }
                  const a = e.target.closest("[data-tippy-content]");
                  initGlobal<any>("tippy")(a, {
                    trigger: "click",
                    placement: "bottom",
                    maxWidth: "158px",
                  });
                }}
              >
                <img
                  class="help-icon"
                  src={`${import.meta.env.VITE_API_URL}${parseMedia(props.help.icon).url}`}
                />
              </a>
            ) : (
              <></>
            )}
            <input
              ref={inputRef}
              class="form-control form-control-lg roboto-regular fs-16"
              defaultValue={props.value}
              placeholder={props.placeholder}
              readOnly={true}
              onClick$={() => {
                showOptions.value = true;
                drawerState.current = "show";
                drawerState.origin = "self";
              }}
              {...mergeTo(props.validator, {
                "data-validator": props.validator,
              })}
            ></input>

            <img class="select-arrow" src="/images/icons/arrow-select.svg" />
          </div>
          <input
            type="hidden"
            ref={inputValueRef}
            id={props.name}
            name={props.name}
          />
        </div>
        {showOptions.value ? (
          <Drawer handler={drawerHandler}>
            <div
              onClick$={optionHandler}
              style={{
                display: "grid",
                gridAutoFlow: "row",
                gridGap: "10px",
              }}
            >
              {props.options.map((item) => {
                return (
                  <Option label={item.label} value={item.value} key={item.id} />
                );
              })}
            </div>
          </Drawer>
        ) : (
          <></>
        )}
        {variants.value.length ? (
          <FormControls controls={variants.value} />
        ) : (
          <></>
        )}
      </div>
    );
  }
);

const Option = component$((props: { value: string; label: string }) => {
  return (
    <button
      type="button"
      class="btn btn-light option-btn roboto-600 fs-16"
      value={props.value}
    >
      {props.label}
    </button>
  );
});

export default Select;
