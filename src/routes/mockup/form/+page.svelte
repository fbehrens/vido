<script lang="ts">
  import { applyAction, enhance } from "$app/forms";
  import { goto } from "$app/navigation";
  let { data, form } = $props();
  let server_load = data.server_load;
  let page_load = data.page_load;

  $effect(() => {
    // console.log({ log: "effect", ...data, form });
  });
</script>

FormExamle <br />
server_load: {server_load}: <br />
page_load: {page_load}<br />
form: {JSON.stringify(form, null, 2)}
<form
  method="POST"
  use:enhance={({ formElement, formData, action, cancel, submitter }) => {
    // console.log({ log: "enhance 1", formElement, formData, action, cancel, submitter, });
    console.log(submitter!.attributes.getNamedItem("id")!.value);
    formData.append("appended", "3");
    return async ({ result, update }) => {
      update({ reset: true });
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
  <button formaction="?/a1" id="button1">a1</button>
  <button formaction="?/a2" id="button2">a2</button>
</form>
<form
  method="POST"
  use:enhance={() => {
    console.log("process");
    return async ({ result, update }) => {
      console.log("done");
      update({ reset: true });
    };
  }}
>
  <label for="name">Name</label>
  <input type="text" name="name" />
  <button formaction="?/b1">b1</button>
</form>
<form method="POST" action="?/redirect">
  <button>redirect</button>
</form>
