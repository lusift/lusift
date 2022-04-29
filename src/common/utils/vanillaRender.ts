const vanillaRender = (
  elementToRender: string,
  targetPath: string,
  callback?: Function
) => {
  const target = document.querySelector(targetPath);
  target!.innerHTML = elementToRender;
  if (callback) callback();
}

export default vanillaRender;
