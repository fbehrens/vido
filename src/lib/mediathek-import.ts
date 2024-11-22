import { updateFilmliste } from "./mediathek";
const [_node, _viteNode, ...args] = process.argv;
console.log("loads mediatheklist (-f)force (-t)est (-s)kipDownload");
function has(arg: string) {
  return args.includes(arg);
}
await updateFilmliste({
  force: has("-f"),
  test: has("-t"),
  skipDownload: has("-s"),
});
