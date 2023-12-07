export function createCodeCopyButton(bubble) {
  if (!bubble || !bubble.querySelectorAll) {
    console.error("Invalid bubble element passed to createCodeCopyButton");
    return;
  }
  
  const codeBlocks = bubble.querySelectorAll("pre > .hljs");
  codeBlocks.forEach((codeBlock) => {
    const copyButton = document.createElement("button");
    copyButton.setAttribute("aria-label", "Copy code");
    copyButton.innerHTML = `
      <svg
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <title>Copy</title> 
        <path
          fill-rule="evenodd"
          clip-rule="evenodd"
          d="M0 6.75C0 5.784.784 5 1.75 5h1.5a.75.75 0 0 1 0 1.5h-1.5a.25.25 0 0 0-.25.25v7.5c0 .138.112.25.25.25h7.5a.25.25 0 0 0 .25-.25v-1.5a.75.75 0 0 1 1.5 0v1.5A1.75 1.75 0 0 1 9.25 16h-7.5A1.75 1.75 0 0 1 0 14.25Z"
          fill="currentColor"
        ></path>
        <path
          fill-rule="evenodd"
          clip-rule="evenodd"
          d="M5 1.75C5 .784 5.784 0 6.75 0h7.5C15.216 0 16 .784 16 1.75v7.5A1.75 1.75 0 0 1 14.25 11h-7.5A1.75 1.75 0 0 1 5 9.25Zm1.75-.25a.25.25 0 0 0-.25.25v7.5c0 .138.112.25.25.25h7.5a.25.25 0 0 0 .25-.25v-7.5a.25.25 0 0 0-.25-.25Z"
          fill="currentColor"
        ></path>
      </svg>`;
    const preElement = codeBlock.parentNode;
    if (preElement.style.position !== "relative") {
      preElement.style.position = "relative";
    }
    copyButton.style.position = "absolute";
    copyButton.style.top = "0px";
    copyButton.style.right = "12px";
    copyButton.onclick = function () {
      navigator.clipboard
        .writeText(codeBlock.innerText)
        .then(() => {
          copyButton.setAttribute("aria-label", "Copy copied");
          copyButton.innerHTML = `
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <title>Copied</title>
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M13.78 4.22a.75.75 0 0 1 0 1.06l-7.25 7.25a.75.75 0 0 1-1.06 0L2.22 9.28a.751.751 0 0 1 .018-1.042.751.751 0 0 1 1.042-.018L6 10.94l6.72-6.72a.75.75 0 0 1 1.06 0Z"
                fill="currentColor"
              ></path>
            </svg>`;
          setTimeout(() => {
            copyButton.innerHTML = `
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <title>Copy</title>
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M0 6.75C0 5.784.784 5 1.75 5h1.5a.75.75 0 0 1 0 1.5h-1.5a.25.25 0 0 0-.25.25v7.5c0 .138.112.25.25.25h7.5a.25.25 0 0 0 .25-.25v-1.5a.75.75 0 0 1 1.5 0v1.5A1.75 1.75 0 0 1 9.25 16h-7.5A1.75 1.75 0 0 1 0 14.25Z"
                fill="currentColor"
              ></path>
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M5 1.75C5 .784 5.784 0 6.75 0h7.5C15.216 0 16 .784 16 1.75v7.5A1.75 1.75 0 0 1 14.25 11h-7.5A1.75 1.75 0 0 1 5 9.25Zm1.75-.25a.25.25 0 0 0-.25.25v7.5c0 .138.112.25.25.25h7.5a.25.25 0 0 0 .25-.25v-7.5a.25.25 0 0 0-.25-.25Z"
                fill="currentColor"
              ></path>
            </svg>`;
            copyButton.setAttribute("aria-label", "Copy code");
          }, 1250);
        })
        .catch(() => {
          copyButton.setAttribute("aria-label", "Code copy failed");
          copyButton.innerHTML = `
          <svg
            width="30"
            height="30"
            viewBox="0 0 28 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <title>Copy failed</title>
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M6.457 1.047c.659-1.234 2.427-1.234 3.086 0l6.082 11.378A1.75 1.75 0 0 1 14.082 15H1.918a1.75 1.75 0 0 1-1.543-2.575Zm1.763.707a.25.25 0 0 0-.44 0L1.698 13.132a.25.25 0 0 0 .22.368h12.164a.25.25 0 0 0 .22-.368Zm.53 3.996v2.5a.75.75 0 0 1-1.5 0v-2.5a.75.75 0 0 1 1.5 0ZM9 11a1 1 0 1 1-2 0 1 1 0 0 1 2 0Z"
              fill="currentColor"></path>
          </svg>`;
          setTimeout(() => {
            copyButton.innerHTML = `
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <title>Copy</title>
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M0 6.75C0 5.784.784 5 1.75 5h1.5a.75.75 0 0 1 0 1.5h-1.5a.25.25 0 0 0-.25.25v7.5c0 .138.112.25.25.25h7.5a.25.25 0 0 0 .25-.25v-1.5a.75.75 0 0 1 1.5 0v1.5A1.75 1.75 0 0 1 9.25 16h-7.5A1.75 1.75 0 0 1 0 14.25Z"
                fill="currentColor"
              ></path>
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M5 1.75C5 .784 5.784 0 6.75 0h7.5C15.216 0 16 .784 16 1.75v7.5A1.75 1.75 0 0 1 14.25 11h-7.5A1.75 1.75 0 0 1 5 9.25Zm1.75-.25a.25.25 0 0 0-.25.25v7.5c0 .138.112.25.25.25h7.5a.25.25 0 0 0 .25-.25v-7.5a.25.25 0 0 0-.25-.25Z"
                fill="currentColor"
              ></path>
            </svg>`;
            copyButton.setAttribute("aria-label", "Copy code");
          }, 1500);
        });
    };
    preElement.appendChild(copyButton);
  });
}
