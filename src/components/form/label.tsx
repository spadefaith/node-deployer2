import { component$, useStyles$ } from "@builder.io/qwik";
// import styles from "./input.scss?inline";
const Label = component$((props: { display: string }) => {
  // useStyles$(styles);

  return (
    <>
      <p class="roboto-semibold fs-16 mt-3">{props.display}</p>
    </>
  );
});

export default Label;
