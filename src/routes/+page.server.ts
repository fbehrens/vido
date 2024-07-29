import { readdir, stat } from "fs/promises";
import { Stats, readdirSync, statSync } from "fs";
import { join } from "path";
import { Select } from "flowbite-svelte";
import { db } from "$lib/db";
import type { Movie } from "$lib/types";

export interface MyFile {
  filename: string;
  isVdo: boolean;
  size: number;
}

const dir = process.cwd() + "/static/";

function myFile(name: string, stat: Stats): MyFile {
  const filePattern = /\.(mov|mp4)$/i;
  return {
    filename: name.replace(dir, ""),
    isVdo: filePattern.test(name),
    size: stat.size,
  };
}

function getAllFiles(dirPath: string, arrayOfFiles: MyFile[] = []): MyFile[] {
  const files = readdirSync(dirPath);
  files.forEach((file) => {
    const filePath = join(dirPath, file);
    const stat = statSync(filePath);
    if (stat.isDirectory()) {
      arrayOfFiles = getAllFiles(filePath, arrayOfFiles);
    } else {
      arrayOfFiles.push(myFile(filePath, stat));
    }
  });
  return arrayOfFiles;
}

export async function load({}) {
  const files = getAllFiles(dir).filter((f) => f.isVdo);
  const movies = db
    .prepare("Select filename,id,duration from movies")
    .all() as Movie[];
  const fns = [...movies, ...files].map(({ filename }) => filename);
  const join = [...new Set(fns)].map((fn) => ({
    ...files.find((f) => f.filename === fn),
    ...movies.find((f) => f.filename === fn),
  }));
  return { files: join };
}
