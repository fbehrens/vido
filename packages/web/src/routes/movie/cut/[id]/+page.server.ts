import { db } from "$lib/server/db/index.js";
import { movies } from "$lib/server/db/schema/vido.js";
import type { Segment } from "$lib/types";
import { getClips } from "$lib/util/transcribe";
import { redirect } from "@sveltejs/kit";
import { eq } from "drizzle-orm";

export async function load({ params }) {
  const { id } = params;
  const movie = await db
    .select()
    .from(movies)
    .where(eq(movies.id, parseInt(id)))
    .get();
  if (!movie) throw new Error("Movie not found");
  const clps = await getClips(movie.id);
  return { movie, clps };
}

export const actions = {
  default: async ({ cookies, request }) => {
    const fd = await request.formData();
    const cut = fd.getAll("cut") as unknown as number[];
    const movie_id = fd.get("movie_id") as unknown as number;
    await db
      .update(movies)
      .set({ cut: JSON.stringify(cut) })
      .where(eq(movies.id, movie_id));
    const segments = await joinClips(movie_id);
    console.log({ s0: segments[0], length: segments.length });
    await db
      .update(movies)
      .set({ segments: JSON.stringify(segments) })
      .where(eq(movies.id, movie_id));
    redirect(303, `/movie/${movie_id}`);
  },
};

async function joinClips(id: number) {
  const movie = await db.query.movies.findFirst({
    where: eq(movies.id, id),
    columns: {
      cut: true,
    },
    with: {
      clips: {
        columns: {
          id: true,
          segments: true,
        },
      },
    },
  });

  const cut: number[] = JSON.parse(movie!.cut!);
  const clipsSegments = movie!.clips.map((c) => JSON.parse(c.segments!) as Segment[]);
  const filterSeg = (wordFn: (w: { start: number }) => boolean) => {
    return (seg) => {
      if (seg.words.every(wordFn)) {
        return seg;
      } else if (seg.words.some(wordFn)) {
        const words = seg.words.filter(wordFn);
        return {
          text: seg.text,
          words,
          start: Math.min(...words.map((w) => w.start)),
          end: Math.max(...words.map((w) => w.end)),
        };
      } else {
        return undefined;
      }
    };
  };

  cut.forEach((time, index) => {
    clipsSegments[index] = clipsSegments[index]
      .map(filterSeg((word: any) => word.start <= time))
      .filter((s) => s);
    clipsSegments[index + 1] = clipsSegments[index + 1]
      .map(filterSeg((word: any) => word.start > time))
      .filter((s) => s);
  });
  const segments = clipsSegments.flatMap((c) => c);
  return segments;
}
