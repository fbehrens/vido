<script lang="ts">
  import Table from "./Table.svelte";

  let width = $state(1);
  let height = $state(2);
  let area = $derived(width * height);
  $effect(() => {
    console.log(area);
  });
  type Fruit = {
    name: string;
    qty: number;
    price: number;
  };
  const fruits: Fruit[] = [
    { name: "apples", qty: 5, price: 2 },
    { name: "bananas", qty: 10, price: 1 },
    { name: "cherries", qty: 20, price: 0.5 },
  ];
</script>

<div>
  <button class="border-2" onclick={() => width++}>
    width={width}
  </button>
  <button class="border-2" onclick={() => height++}>
    height={height}
  </button>
  area={area}
</div>

<div class="border-2">
  {#snippet figure(a)}
    <p>figure{a}</p>
  {/snippet}
  {@render figure(1)}
  {@render figure(2)}
</div>
<Table data={fruits}>
  <th>fruit</th>
  <th>qty</th>
  <th>price</th>
  <th>total</th>

  {#snippet row(d: Fruit)}
    <td>{d.name}</td>
    <td>{d.qty}</td>
    <td>{d.price}</td>
    <td>{d.qty * d.price}</td>
  {/snippet}
</Table>
