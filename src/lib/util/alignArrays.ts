import { db } from "$lib/db";

export interface WordItem {
  word: string;
  id: number;
}

export interface HasWord {
  word: string;
}

interface WordSep {
  word: string;
  sep: string;
}

export function getWordWhitspace(s: string): [WordSep, string] {
  const regex = /^([\w']+)(\W+)?(.*)/;
  const match = s.match(regex);
  if (match) {
    return [{ word: match[1], sep: match[2] || " " }, match[3]];
  } else {
    throw "segment must begin with a word";
  }
}

export function* wordSep(s: string) {
  let ws: WordSep;
  while (s != "") {
    [ws, s] = getWordWhitspace(s);
    yield ws;
  }
}

export function updateWordsSegmentId(o: { movie_id: number; clip_id: number }) {
  const segmentsDb = db
    .prepare(
      "select text as 'word',id from segments where movie_id=@movie_id and clip_id=@clip_id order by start",
    )
    .all(o) as WordItem[];
  const segmentss = segmentsDb.map(({ id, word }) => {
    const words = word.match(/\b[\w']+\b/g) || [];
    return words.map((word) => {
      return {
        word,
        id,
      } as WordItem;
    });
  });
  let segments = segmentss.reduce((acc, val) => acc.concat(val), []);
  let words = db
    .prepare(
      "select word,id from words where movie_id=@movie_id and clip_id=@clip_id order by start",
    )
    .all(o) as WordItem[];
  [segments, words] = alignArrays(segments, words);
  if (wordItemsEqual(segments, words)) {
    console.log({ updateWordsSegmentId: "Words matching segments" });
  }

  words.forEach((w, index) => {
    db.prepare("update words set segment_id=? where id=?").run(
      segments[index].id,
      w.id,
    );
  });
}

export function wordItemsEqual(ss: WordItem[], ws: WordItem[]): boolean {
  if (ss.length !== ws.length) return false;
  return ss.every((s, index) => s.word === ws[index].word);
}

export function alignArrays(
  ss: HasWord[],
  ws: HasWord[],
): [HasWord[], HasWord[]] {
  const lcs = longestCommonSubsequence(ss, ws);
  console.log(lcs);
  return alignWithLCS(ss, ws, lcs);
}

export function mergeWords(o: HasWord, p: HasWord): HasWord {
  return { ...o, ...p };
}

function longestCommonSubsequence(arr1: HasWord[], arr2: HasWord[]): HasWord[] {
  const dp: number[][] = Array(arr1.length + 1)
    .fill(null)
    .map(() => Array(arr2.length + 1).fill(0));
  for (let i = 1; i <= arr1.length; i++) {
    for (let j = 1; j <= arr2.length; j++) {
      if (arr1[i - 1].word === arr2[j - 1].word) {
        dp[i][j] = dp[i - 1][j - 1] + 1;
      } else {
        dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
      }
    }
  }
  const lcs: HasWord[] = [];
  let i = arr1.length,
    j = arr2.length;
  while (i > 0 && j > 0) {
    if (arr1[i - 1].word === arr2[j - 1].word) {
      lcs.unshift({ ...arr1[i - 1], ...arr2[j - 1] });
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
  arr1: HasWord[],
  arr2: HasWord[],
  lcs: HasWord[],
): [HasWord[], HasWord[]] {
  const aligned1: HasWord[] = [];
  const aligned2: HasWord[] = [];
  let i = 0,
    j = 0,
    k = 0;
  while (i < arr1.length || j < arr2.length) {
    if (
      k < lcs.length &&
      arr1[i].word === lcs[k].word &&
      arr2[j].word === lcs[k].word
    ) {
      aligned1.push(arr1[i++]);
      aligned2.push(arr2[j++]);
      k++;
    } else if (
      i < arr1.length &&
      (k === lcs.length || arr1[i].word !== lcs[k].word)
    ) {
      aligned1.push(arr1[i++]);
      aligned2.push({ word: "", id: 0 });
    } else {
      aligned1.push({ word: "", id: 0 });
      aligned2.push(arr2[j++]);
    }
  }
  return [aligned1, aligned2];
}
