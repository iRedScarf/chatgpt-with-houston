import h from "./createElement";

export function createContinueButton() {
  const continueButton = h("button", { class: "regenerate-btn" });
  continueButton.innerHTML = `
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <title>Continue generting</title>
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="m15.146 12.354-5.792 5.792a.5.5 0 0 1-.854-.353V6.207a.5.5 0 0 1 .854-.353l5.792 5.792a.5.5 0 0 1 0 .708Z"
        fill="currentColor"></path>
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="m22.146 12.354-5.792 5.792a.5.5 0 0 1-.854-.353V6.207a.5.5 0 0 1 .854-.353l5.792 5.792a.5.5 0 0 1 0 .708Z"
        fill="currentColor"></path>
    </svg>`;
  return  continueButton;
}
