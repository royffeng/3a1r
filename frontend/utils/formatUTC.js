export function rectifyFormat(s) {
  let b = s.split(/\D/);
  const date =
    b[0] +
    "-" +
    b[1] +
    "-" +
    b[2] +
    "T" +
    b[3] +
    ":" +
    b[4] +
    ":" +
    b[5] +
    "." +
    b[6].substr(0, 3) +
    "+00:00";
  return new Date(date).toLocaleDateString();
}
