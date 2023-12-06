import h from "./createElement";

export function createRegenerateButton() {
  const regenerateButton = h("button", { class: "regenerate-btn" });
  regenerateButton.innerHTML = `
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <title>Regenerate</title>
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="m.427 1.927 1.215 1.215a8.002 8.002 0 1 1-1.6 5.685.75.75 0 1 1 1.493-.154 6.5 6.5 0 1 0 1.18-4.458l1.358 1.358A.25.25 0 0 1 3.896 6H.25A.25.25 0 0 1 0 5.75V2.104a.25.25 0 0 1 .427-.177Z"
        fill="currentColor"></path>
    </svg>`;
  return regenerateButton;
}
