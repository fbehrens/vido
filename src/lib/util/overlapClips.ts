import type { Duration } from "$lib/types";
export function* overlay(clips: Duration[]) {
  for (let i = 0; i < clips.length; i++) {
    const c = clips[i];
    const next = clips[i + 1];
    const prev = clips[i - 1];
    if (next) {
      yield {
        ids: [c.id],
        start: c.start,
        end: next.start,
      };
      yield {
        ids: [c.id, next.id],
        start: next.start,
        end: c.end,
      };
    } else {
      if (prev) {
        yield {
          ids: [c.id],
          start: prev.end,
          end: c.end,
        };
      } else {
        yield {
          ids: [c.id],
          start: c.start,
          end: c.end,
        };
      }
    }
  }
}
