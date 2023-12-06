const h = (
  tag: string,
  props: Record<string, any> = {},
  ...children: any[]
) => {
  const node = document.createElement(tag);
  for (const [key, value] of Object.entries(props)) {
    node.setAttribute(key, value);
  }
  for (const child of children) {
    if (child instanceof Node) {
      node.appendChild(child);
    } else if (child || child === 0) {
      node.innerHTML = child;
    }
  }
  return node;
};

export default h;