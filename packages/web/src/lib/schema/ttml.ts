import { parseStringPromise } from "xml2js";

type Ttml = {
  style: string;
  start: number;
  end: number;
  text: string;
};

export async function ttmlToSegments(xml: string): Promise<Ttml[]> {
  const parsed = await parseStringPromise(xml, {
    explicitChildren: true,
    preserveChildrenOrder: true,
  });
  const body = parsed["tt:tt"]["tt:body"][0]["tt:div"][0]["tt:p"] as any[];
  return body.map((p) => {
    const start = parseTime(p.$.begin);
    const end = parseTime(p.$.end);
    const text =
      p.$$?.map((node: any) => {
        if (node["#name"] === "tt:span") return node._ || "";
        if (node["#name"] === "tt:br") return "\n";
        return "";
      }).join("") || "";
    const firstSpan = p.$$?.find((n: any) => n["#name"] === "tt:span");
    return {
      style: firstSpan?.$.style || "",
      start,
      end,
      text,
    };
  });
}

function parseTime(t: string): number {
  const [h, m, s] = t.split(":").map(parseFloat);
  return h * 3600 + m * 60 + s;
}
