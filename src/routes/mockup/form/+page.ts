import type { PageLoad } from "./$types";

export const load: PageLoad = ({ data }) => {
  console.log("+page.ts(load)");
  return {
    ...data,
    page_load: new Date().toISOString(),
  };
};
