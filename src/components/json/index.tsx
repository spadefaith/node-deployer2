import {
  component$,
  useSignal,
  useStyles$,
  useVisibleTask$,
} from "@builder.io/qwik";
import { JSONEditor } from "vanilla-jsoneditor";
import styles from "~/components/json/index.scss?inline";
const JsonEditor = component$((props: { content?: any; name: string }) => {
  useStyles$(styles);
  const containerRef = useSignal(null);
  const inputRef = useSignal(null);
  const contentValue = useSignal(
    props.content ? JSON.stringify(props.content, null, 4) : ""
  );
  useVisibleTask$(() => {
    console.log(17, { content: props.content, name: props.name });
    const editor = new JSONEditor({
      target: containerRef.value,
      props: {
        //@ts-ignore
        mode: "text",
        onChange: (
          updatedContent,
          previousContent,
          { contentErrors, patchResult }
        ) => {
          //@ts-ignore
          contentValue.value = updatedContent.text;
        },
        content: {
          text: JSON.stringify(props.content || {}, null, 4),
        },
      },
    });

    // console.log(editor);
  });

  return (
    <div class="json-container">
      <div class="json-content" ref={containerRef}></div>
      <input bind:value={contentValue} name={props.name} type="hidden" />
    </div>
  );
});

export default JsonEditor;
