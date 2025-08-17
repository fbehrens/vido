import { dbOld } from "$lib/db";
import type { Segment } from "$lib/types.js";
import { mp3Path } from "$lib/utils";

export function load({ params }) {
  const { id, clip_id } = params;
  const clip1 = dbOld
    .prepare("Select * from clips_v where movie_id=? and id=?")
    .get(id, clip_id) as {
    id: number;
    movie_id: number;
    m_filename: string;
    segments: string;
  };
  const clip = {
    ...clip1,
    segments: JSON.parse(clip1.segments) as Segment[],
  };
  return { ...clip, filename: "/" + mp3Path(clip.m_filename, clip.id) };
}
