import { getPayments } from "./columns";

export async function load() {
  const payments = getPayments();
  console.log(payments[0]!.amount);
  return {
    payments,
  };
}
export const actions = {
  default: async ({ request }) => {
    const data = await request.formData();
    console.log({ data });
    return {
      success: true,
      message: "Operation successful",
    };
  },
};
