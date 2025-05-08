import { assertEquals, assert } from "@std/assert";
import { add, generateOpenai } from "./index.ts";

Deno.test("addTest", () => {
  assertEquals(add(2, 3), 5);
});

Deno.test("generateOpenaiTest", async () => {
  const r = await generateOpenai("hi");
  assert(typeof r.text === "string");
});
