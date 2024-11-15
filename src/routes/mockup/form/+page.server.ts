import { redirect, type Actions } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";
import { sleep } from "$lib/util/util";

export const load = (async (event) => {
  const data = { server_load: new Date().toISOString(), locals: event.locals };
  console.log(`+page.server.ts(load)`);
  console.log(data);

  return data;
}) satisfies PageServerLoad;

export const actions = {
  a1: async ({ request }) => {
    const formData = await request.formData();
    console.log({ action: "a1", formData });
    // throw redirect(303, `/`);
    return {
      success: true,
      ac: "a1",
    };
  },
  a2: async ({ request }) => {
    const formData = await request.formData();
    console.log({ action: "a2", formData });
    // throw redirect(303, `/`);
    return {
      success: true,
      ac: "a2",
    };
  },
  b1: async ({ request }) => {
    console.log({ action: "b1" });
    await sleep(1000);

    // throw redirect(303, `/`);
    return {
      success: true,
      ac: "b1",
    };
  },
} satisfies Actions;
