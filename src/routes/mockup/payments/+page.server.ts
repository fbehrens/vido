import { getPayments } from "./columns";

export async function load() {
    const payments = getPayments();
    console.log(payments[0]!.amount);
  return {
    payments
  };
}
export const actions = {
  foo: async ({ request }) => {
    const data = await request.formData();
    console.log({ data });
  },
};
