export async function load({ params }) {
  const id = Number(params.id);
  return { id };
}
