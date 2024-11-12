<script lang="ts">
  import { applyAction, enhance } from "$app/forms";
  import { goto } from "$app/navigation";
  import type { ActionData } from "./$types";

  let { data, form } = $props();
  let { server_load, page_load } = data;
  $effect(() => {
    console.log({ log: "effect", data, form });
  });
</script>

FormExamle <br />
server_load: {server_load}: <br />
page_load: {page_load}
<form
  method="POST"
  action="?/example"
  use:enhance={({ formElement, formData, action, cancel, submitter }) => {
    console.log({
      log: "enhance",
      formElement,
      formData,
      action,
      cancel,
      submitter,
    });
    return async ({ result, update }) => {
      console.log({ log: "inside", result, update });
      // `result` is an `ActionResult` object
      if (result.type === "redirect") {
        goto(result.location);
      } else {
        await applyAction(result);
      }
    };
  }}
>
  <label for="name">Name</label>
  <input type="text" name="name" />
  <button type="submit">Submit</button>
</form>
