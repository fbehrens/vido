import { updateFilmliste } from "$lib/mediathek";

export const load = async ({ params, cookies }) => {
  await updateFilmliste();
  return {};
};
