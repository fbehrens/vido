import { duck } from "$lib/server/db/duck";
export type FilmAll = {
  beschreibung: string;
  captions: string;
  datumL: number;
  datumzeit: Date;
  dauer: string;
  geo: string | undefined;
  id: number;
  mb: number;
  sender: string;
  thema: string;
  titel: string;
  url: string;
  urlHD: string;
  urlHistory: string;
  urlLD: string;
  urlRtmp: string | undefined;
  website: string;
};
export async function load({ params }) {
  const id = params.id;

  const reader = await duck.runAndReadAll(`
      from filme_v
      select
        *
      where id=${id}`);
  const [film] = reader.getRowObjectsJS() as FilmAll[];

  const res = await fetch(film.captions);
  const captions = await res.text();
  return { film, captions };
}
