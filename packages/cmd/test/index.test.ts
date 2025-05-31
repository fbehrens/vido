import { assertEquals } from "@std/assert";
import { add } from "../src/index.ts";

Deno.test("addTest", () => {
  assertEquals(add(2, 3), 5);
});
