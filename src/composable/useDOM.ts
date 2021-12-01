export default () => {
  const slideDown = (domName: string) => {
    const container = document.getElementById(domName);
    container.scrollIntoView({ behavior: "smooth" });
  };
  return { slideDown };
};
