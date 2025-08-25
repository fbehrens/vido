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

export function formatSize(bytes: number): string {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
}
