export const getRandomColor = () => {
  let n = (Math.random() * 0xfffff * 1000000).toString(16);
  return "#" + n.slice(0, 6);
};
