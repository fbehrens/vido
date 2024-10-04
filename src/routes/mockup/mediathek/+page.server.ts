import { updateFilmliste } from "$lib/mediathek";

export const load = async ({ params, cookies }) => {
  await updateFilmliste({
    filter: (e) => e[1] == "Markus Lanz",
    refresh: true,
  });
  return {};
};
