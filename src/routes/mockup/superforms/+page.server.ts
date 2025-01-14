import { zod } from "sveltekit-superforms/adapters";
import { superValidate } from "sveltekit-superforms";
import { z } from "zod";
import SuperDebug from "sveltekit-superforms";
import { message } from "sveltekit-superforms";
import { fail } from "@sveltejs/kit";

const schema = z.object({
  name: z.string().default("Hello world!"),
  email: z.string().email(),
});

export const load = async () => {
  const form = await superValidate(zod(schema));
  // Always return { form } in load functions
  return { form };
};

export const actions = {
  default: async (e) => {
    const form = await superValidate(e.request, zod(schema));

    console.log(form);
    if (!form.valid) {
      // Again, return { form } and things will just work.
      return fail(400, { form });
    }

    // TODO: Do something with the validated form.data

    // Display a success status message
    return message(form, "Form posted successfully!");
  },
};
