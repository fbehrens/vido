import { updateFilmliste } from "./mediathek";
const [_node, _viteNode, ...args] = process.argv;
function has(arg: string) {
  return args.includes(arg);
}
await updateFilmliste({ force: has("-f"), test: has("-t") });
