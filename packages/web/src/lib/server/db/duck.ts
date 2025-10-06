import { getDuck } from "mtk/src/getDuck";
import { env } from "$env/dynamic/private";

export const duck = await getDuck({ ui: true, path: env.MEDIATHEK_URL });
