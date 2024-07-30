import { $, component$, useSignal, useStyles$ } from "@builder.io/qwik";
import Input from "./Input";
import { getFormData, initGlobal } from "~/utils/client-utils";

import styles from "./input-key-value.scss?inline";
import { HelpType } from "~/server/classes/Form";
import { isServer } from "@builder.io/qwik/build";
const InputKeyValue = component$(
  (props: { name: string; key: number; help?: HelpType; value?: any }) => {
    useStyles$(styles);

    const formRef = useSignal(null);
    const datas = useSignal(props.value || []);

    const deleteHandler = $((e) => {
      const target = e.target;
      const key = target.dataset.key;
      const id = target.dataset.id;

      datas.value = datas.value.reduce((accu, item, index) => {
        if (id != index) {
          accu.push(item);
        }

        return accu;
      }, []);
    });

    const addHandler = $((e) => {
      const target = e.target;

      const key = target.dataset.key;
      const data = getFormData(formRef.value);

      datas.value = [...datas.value, data];

      formRef.value.reset();
    });

    return (
      <div class="input-dynamic-one-container">
        <div class="input-dynamic-one-content" data-key={props.name}>
          {datas.value.map((item, index) => {
            return (
              <div class="kv-list">
                <div class="kv-left">
                  <Input
                    name={`${props.name}:key_${index}`}
                    type="text"
                    value={item.key}
                    placeholder=""
                    display=""
                    readonly={true}
                  />
                  <Input
                    name={`${props.name}:value_${index}`}
                    type="text"
                    value={item.value}
                    placeholder=""
                    display=""
                    readonly={true}
                  />
                </div>
                <div class="kv-right">
                  <button
                    class="btn btn-danger btn-sm"
                    data-id={index}
                    type="button"
                    onClick$={deleteHandler}
                    data-key={props.key}
                  >
                    Delete
                  </button>
                </div>
              </div>
            );
          })}
          <div class="kv-form">
            <form
              id="kv-form"
              name="kv-form"
              class="kv-left"
              ref={formRef}
              data-key={props.name}
            >
              {props.help && props.help.is_show ? (
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
                  <img class="help-icon" src={props.help.icon} />
                </a>
              ) : (
                <></>
              )}
              <Input
                name={`key`}
                type="text"
                placeholder="Enter key"
                display=""
              />
              <Input
                name={`value`}
                type="text"
                placeholder="Enter value"
                display=""
              />
            </form>
            <div class="kv-right">
              <button
                class="btn btn-success btn-sm"
                type="button"
                form="kv-form"
                onClick$={addHandler}
              >
                Add
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
);

export default InputKeyValue;
