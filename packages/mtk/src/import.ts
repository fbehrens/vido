import { updateFilmliste } from "./mediathek";
const [_node, _viteNode, ...args] = process.argv;
console.log("loads mediatheklist (-f)force)");
const has = (arg: string) => args.includes(arg);
await updateFilmliste({ force: has("-f") });
