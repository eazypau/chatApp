export default () => {
  const slideDown = (domName: string) => {
    const container: any = document.getElementById(domName);
    container.scrollIntoView({ behavior: "smooth" });
  };
  return { slideDown };
};
