export function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export const NonLetters = "\\?\\.,-";
export const Letters = "A-Za-z";
const AllowedChars = new RegExp(`[${Letters} ${NonLetters}]`);

export const unexpectedChars = ({
  text,
  allowedChars = AllowedChars,
}: {
  text: string;
  allowedChars?: RegExp;
}) => {
  const s = new Set([...text]);
  const chars = [...s].filter((c) => !allowedChars.test(c));
  return new Set(chars);
};
