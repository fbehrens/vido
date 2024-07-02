export function load({ params }) {
  console.log({ serverload: params });
  return { movie: { filename: "/" + params.src } };
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export const actions = {
  foo: async ({ request }) => {
    const formData = await request.formData();
    const entries = Object.fromEntries(formData);
    console.log(entries);
    return {
      success: true,
      data: { description: `${entries.description}_foo` },
    };
  },
  foo1: async ({ request }) => {
    const formData = await request.formData();
    const entries = Object.fromEntries(formData);
    console.log(entries);
    return {
      success: true,
      data: { description: `${entries.description}_foo1` },
    };
  },
};
