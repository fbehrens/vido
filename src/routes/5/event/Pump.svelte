<script lang="ts">
  type F = (n: number) => void;
  type PumpProps = {
    inflate: F;
    deflate: F;
  };
  let { inflate, deflate }: PumpProps = $props();
  let power = $state(5);
</script>

<button onclick={() => inflate(power)}>inflate</button>
<button onclick={() => deflate(power)}>deflate</button>
<button onclick={() => power--}>-</button> Pump power: {power}
<button onclick={() => power++}>+</button>
