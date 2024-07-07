import { db } from "$lib/db";
export function updateWordsSegmentId(o: { movie_id: number; clip_id: number }) {
  const segments = db
    .prepare(
      "select text,id from segments where movie_id=@movie_id and clip_id=@clip_id",
    )
    .all(o) as { text: string; id: number }[];
  const words = db
    .prepare(
      "select word,id from words where movie_id=@movie_id and clip_id=@clip_id",
    )
    .all(o) as { word: string; id: number }[];
  console.log({ segments, words });
  // words;
}

export function arraysEqual(arr1: string[], arr2: string[]): boolean {
  if (arr1.length !== arr2.length) return false;
  return arr1.every((word, index) => word === arr2[index]);
}

export function alignArrays(
  arr1: string[],
  arr2: string[],
): [string[], string[]] {
  const lcs = longestCommonSubsequence(arr1, arr2);
  return alignWithLCS(arr1, arr2, lcs);
}

function longestCommonSubsequence(arr1: string[], arr2: string[]): string[] {
  const dp: number[][] = Array(arr1.length + 1)
    .fill(null)
    .map(() => Array(arr2.length + 1).fill(0));
  for (let i = 1; i <= arr1.length; i++) {
    for (let j = 1; j <= arr2.length; j++) {
      if (arr1[i - 1] === arr2[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1] + 1;
      } else {
        dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
      }
    }
  }
  const lcs: string[] = [];
  let i = arr1.length,
    j = arr2.length;
  while (i > 0 && j > 0) {
    if (arr1[i - 1] === arr2[j - 1]) {
      lcs.unshift(arr1[i - 1]);
      i--;
      j--;
    } else if (dp[i - 1][j] > dp[i][j - 1]) {
      i--;
    } else {
      j--;
    }
  }
  return lcs;
}

function alignWithLCS(
  arr1: string[],
  arr2: string[],
  lcs: string[],
): [string[], string[]] {
  const aligned1: string[] = [];
  const aligned2: string[] = [];
  let i = 0,
    j = 0,
    k = 0;
  while (i < arr1.length || j < arr2.length) {
    if (k < lcs.length && arr1[i] === lcs[k] && arr2[j] === lcs[k]) {
      aligned1.push(arr1[i++]);
      aligned2.push(arr2[j++]);
      k++;
    } else if (i < arr1.length && (k === lcs.length || arr1[i] !== lcs[k])) {
      aligned1.push(arr1[i++]);
      aligned2.push("");
    } else {
      aligned1.push("");
      aligned2.push(arr2[j++]);
    }
  }
  return [aligned1, aligned2];
}
