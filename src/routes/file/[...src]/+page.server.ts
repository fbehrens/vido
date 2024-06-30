function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export const actions = {
  foo: async ({ cookies, request }) => {
    const data = await request.formData();
    console.log(data);
    await sleep(1000);
  },
};
