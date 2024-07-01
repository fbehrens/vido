export function load({ params }) {
  console.log({ server: params });
  return { src: "/" + params.src };
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export const actions = {
  foo: async ({ cookies, request }) => {
    const data = await request.formData();
    console.log(data);
    await sleep(100);
  },
};
