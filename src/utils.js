export const isPrintable = (keyCode) => (
  /[A-Za-z0-9 _]/i.test(
    String.fromCharCode(keyCode)
  )
);
