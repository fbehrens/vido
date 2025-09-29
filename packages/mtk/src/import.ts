import { csv2duck, updateFilmliste } from "./mediathek";
const [_node, _viteNode, ...args] = process.argv;
console.log("loads filmliste (-f)orce) (-c)svOnly");
const has = (arg: string) => args.includes(arg);

if (has("-c")) {
  await csv2duck();
} else {
  await updateFilmliste({ force: has("-f") });
}
