import { redirect, type Actions } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";

export const load = (async () => {
  return { server_load: new Date().toISOString() };
}) satisfies PageServerLoad;

export const actions = {
  example: async ({ request }) => {
    const data = await request.formData();
    console.log({ action: "example", data });
    // throw redirect(303, `/`);
    return {
      success: true,
      processed: new Date().toISOString(),
    };
  },
} satisfies Actions;
