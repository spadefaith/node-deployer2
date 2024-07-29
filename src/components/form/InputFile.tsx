import { $, component$, useSignal, useVisibleTask$ } from "@builder.io/qwik";

const InputFile = component$(
  (props: { name: string; label: string; display: string }) => {
    const fileRef = useSignal(null);
    const buttonRef = useSignal(null);
    const nameRef = useSignal(null);
    const clickHandler = $(() => {
      fileRef.value.click();
    });

    useVisibleTask$(() => {
      fileRef.value.addEventListener("change", (e) => {
        buttonRef.value.classList.remove("active");
        buttonRef.value.classList.add("active");
        nameRef.value.textContent = e.target.files[0].name;
      });
    });

    return (
      <div class="form-group">
        <label
          for={props.name}
          class="form-label font-24-800 font-manropeextrabold"
        >
          {props.label}
        </label>
        <input
          ref={fileRef}
          type="file"
          class="form-control form-control-lg"
          id={props.name}
          name={props.name}
        />
        <button ref={buttonRef} onClick$={clickHandler} type="button">
          <p>{props.display}</p>
          <span class="name" ref={nameRef}></span>
        </button>
      </div>
    );
  },
);

export default InputFile;
