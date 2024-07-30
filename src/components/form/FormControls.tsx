import {
  component$,
  useSignal,
  useTask$,
  useVisibleTask$,
} from "@builder.io/qwik";
import Input from "./Input";
import InputFile from "./InputFile";
import InputCheck from "./InputCheck";
import TextArea from "./TextArea";
import Select from "./Select";
import FormControlGroup from "./FormControlGroup";
import Datalist from "./Datalist";
import { restructureControls } from "~/utils/client-utils";
import Radio from "./Radio";
import InputKeyValue from "./input-key-value";
import CheckboxGroup from "./checkbox-group";
import Label from "./label";

type OptionItemType = {
  value: string;
  display: string;
  id: number;
};

export type FormControlChildItemType = {
  id: number;
  name?: string;
  tag: string;
  label?: string;
  placeholder?: string;
  value?: string | number;
  validator?: string;
  display?: string;
  options?: OptionItemType[];
  type?: "number" | "text" | "email" | "hidden" | "file" | "check" | "virtual";
};

export type FormControlItemType = {
  id: number;
  tag: string;
  display?: string;
  default?: string;
  option_api?: string;
  properties?: any[];
  variants?: any[];
  options?: any[];
  children?: any[];
  help?: any;

  name: string;
  placeholder: string;
  type: string;
  value: string;
  label: string;
  validator: string;
  height: string;

  width?: string;
  responsive?: string;
  event?: {
    trigger?: string[];
    suscribe?: string[];
  };
  orientation?: string;
};

const FormControls = component$(
  (props: { controls: FormControlItemType[]; data?: any }) => {
    const controls = useSignal([]);
    useTask$(() => {
      controls.value = restructureControls(props.controls, props.data).map(
        (control) => {
          if (control.tag == "group") {
            const controls = restructureControls(
              control.children.map((item) => {
                return item;
              })
            );

            return {
              control,
              child: controls,
            };
          } else if (
            control.tag == "custom" &&
            control.type == "custom_insurance"
          ) {
            const controls = restructureControls(
              control.children.map((item) => {
                return item;
              }),
              props.data
            );

            return {
              control,
              child: controls,
            };
          } else {
            return { control };
          }
        }
      );
    });
    return (
      <>
        {controls.value.map((item) => {
          const { control, child } = item;
          if (control.tag == "group") {
            return (
              <FormControlGroup
                col={child.length}
                key={control.id}
                classes={""}
                display={control.display}
                name={control.name}
                responsive={control.responsive}
              >
                <FormChildControls data={child} key={control.id} />
              </FormControlGroup>
            );
          } else if (control.tag == "custom") {
            return <></>;
          } else {
            return <FormChildControls data={[control]} key={control.id} />;
          }
        })}
      </>
    );
  }
);

const FormChildControls = component$(
  (props: { data: FormControlItemType[] }) => {
    // useVisibleTask$(() => {
    // console.log(75, props.data);
    // });

    // console.log(121, props.data);

    return (
      <>
        {(props.data || []).map((control) => {
          if (["input", "mobile", "input-inline"].includes(control.tag)) {
            if (
              ["text", "date", "email", "file", "hidden"].includes(control.type)
            ) {
              return (
                //@ts-ignore
                <Input
                  key={control.id}
                  {...{
                    name: control.name,
                    type: control.type,
                    display: control.display,
                    placeholder: control.placeholder,
                    value: control.value,
                    validator: control.validator,
                    width: control.width,
                  }}
                />
              );
            } else if (control.type == "file") {
              return (
                <InputFile
                  key={control.id}
                  {...{
                    name: control.name,
                    label: control.label,
                    display: control.display,
                  }}
                />
              );
            } else if (control.type == "check") {
              return (
                <InputCheck
                  key={control.id}
                  {...{
                    name: control.name,
                    label: control.label,
                  }}
                />
              );
            } else {
              <></>;
            }
          } else if (control.tag == "textarea") {
            return (
              <TextArea
                key={control.id}
                name={control.name}
                display={control.display}
                validator={control.validator}
                placeholder={control.placeholder}
                height={control.height}
                value={control.value}
              />
            );
          } else if (control.tag == "label") {
            return <Label display={control.display} />;
          } else if (["select", "select-inline"].includes(control.tag)) {
            return (
              <Select
                key={control.id}
                name={control.name}
                display={control.display}
                value={control.value}
                options={control.options}
                placeholder={control.placeholder}
                variants={control.variants}
                validator={control.validator}
                help={control.help}
                optionApi={control.option_api}
                event={control.event}
                width={control.width}
              />
              // <></>
            );
          } else if (control.tag == "datalist") {
            return (
              <Datalist
                key={control.id}
                name={control.name}
                placeholder={control.placeholder}
                label={control.label}
                value={control.value}
                options={control.options}
              />
            );
          } else if (control.tag == "radio") {
            return (
              <Radio
                key={control.id}
                name={control.name}
                display={control.display}
                value={control.value}
                options={control.options}
                placeholder={control.placeholder}
                variants={control.variants}
                validator={control.validator}
                orientation={control.orientation}
                width={control.width}
              />
            );
          } else if (control.tag == "checkbox-group") {
            console.log(control);
            return (
              <CheckboxGroup
                key={control.id}
                name={control.name}
                display={control.display}
                value={control.value}
                options={control.options}
                placeholder={control.placeholder}
                variants={control.variants}
                validator={control.validator}
              />
            );
          } else if (control.tag == "input-key-value") {
            return (
              <InputKeyValue
                name={control.name}
                key={control.id}
                help={control.help}
                value={control.value}
              />
            );
          } else {
            return <></>;
          }
        })}
      </>
    );
  }
);

export default FormControls;
