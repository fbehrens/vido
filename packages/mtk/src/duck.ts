import { promises as fs } from "fs";
import { getDuck } from "./getDuck";
// await duck.run(
//   `
//   -- CALL start_ui();
//   create sequence seq_thema_id;
//   create table thema (
//   id INTEGER PRIMARY KEY default nextval('seq_thema_id'),
//   sender VARCHAR,
//   thema VARCHAR);
// `
// );

// optionally creates a record in table thema and returns its id
const duck = await getDuck();
export const getThemaId = async (
  sender: string,
  thema: string
): Promise<number> => {
  let reader = await duck.runAndReadAll(
    `select id from thema where sender = ? and thema = ?`,
    [sender, thema]
  );
  const rows = reader.getRowObjects();
  if (rows.length > 0) {
    return rows[0]!.id as number;
  }
  reader = await duck.runAndReadAll(
    `insert into thema (sender, thema) values (?, ?) returning id`,
    [sender, thema]
  );
  return reader.getRowObjects()[0]!.id as number;
};

export const firstRowObject = async (s: string) => {
  const reader = await duck.runAndReadAll(s);
  return reader.getRowObjects()[0];
};
