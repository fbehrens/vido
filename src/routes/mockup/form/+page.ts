import type { PageLoad } from "./$types";

export const load: PageLoad = ({ data }) => {
  return {
    ...data,
    page_load: new Date().toISOString(),
  };
};
