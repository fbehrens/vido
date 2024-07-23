import { updateWordsSegmentId } from "$lib/util/alignArrays";

export function load() {
  return updateWordsSegmentId({ movie_id: 367, clip_id: 2 });
}
