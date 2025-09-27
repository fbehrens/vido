import { describe, expect, it } from "vitest";
import { con, firstRowObject, getThemaId } from "./duck";

const thema = ["zdf", "lanz"] as [string, string];
describe("duck", () => {
  it("firstrowObject", async () => {
    expect(await firstRowObject(`select 2 as "v"`)).toStrictEqual({ v: 2 });
  });

  it("get", async () => {
    const row = await con.runAndReadAll(
      `insert into thema (sender, thema) values (?, ?) returning id`,
      thema
    );
    const id = row.getRowObjects()[0]!.id;
    expect(id).toBe(1);
  });

  it("getThemaId", async () => {
    expect(await getThemaId(...thema)).toBe(1);
  });
  it("getThemaId", async () => {
    expect(await getThemaId("ARD", "weltspiegel")).toBe(2);
  });
});

const lines = [
  `"3Sat","...von oben","Südafrikas Westen von oben","19.09.2025","17:31:00","00:43:12","880","Südafrikas Westen bietet eine beeindruckende Mischung aus Natur und Geschichte. Kapstadt mit Tafelberg und Garden Route zählt zu den bekanntesten Reisezielen der Welt. Doch auch abseits der Metropolen gibt es viel zu entdecken: edle Weine im Landesinneren, Robben, Pinguine und Wale an den Küsten, weite Wüstenlandschaften und seltene Pflanzenarten. Die Region ist geprägt von kolonialer Vergangenhei\n.....","https://nrodlzdf-a.akamaihd.net/dach/3sat/25/09/250912_suedafrikas_westen_von_oben_sbreise/1/250912_suedafrikas_westen_von_oben_sbreise_3360k_p36v17.mp4","https://www.3sat.de/dokumentation/von-oben/suedafrikas-westen-von-oben-102.html","","","8|rodlzdf-a.akamaihd.net/dach/3sat/25/09/250912_suedafrikas_westen_von_oben_sbreise/1/250912_suedafrikas_westen_von_oben_sbreise_808k_p11v17.mp4","","136|6660k_p37v17.mp4","","1758295860","","DE-AT-CH","false"`,
  `"","","Südspanien von oben (S01/E17)","26.12.2022","07:35:00","00:43:20","870","Spaniens Süden ist reich an schönen Städten mit einer multikulturellen Architektur, Küche und Geschichte. Ihre Vielfalt macht die Region zu einem der beliebtesten Reiseziele Europas.","https://nrodlzdf-a.akamaihd.net/dach/3sat/22/12/221201_suedspanien_von_oben_dokreise/1/221201_suedspanien_von_oben_dokreise_3360k_p36v15.mp4","https://www.3sat.de/dokumentation/von-oben/suedspanien-von-oben-102.html","","","8|rodlzdf-a.akamaihd.net/dach/3sat/22/12/221201_suedspanien_von_oben_dokreise/1/221201_suedspanien_von_oben_dokreise_808k_p11v15.mp4","","","","1672036500","","DE-AT-CH","false"`,
  `"","","Nordfrankreich von oben","16.10.2024","14:49:00","00:43:39","892","In Nordfrankreich finden sich wildromantische Küstengebiete, einige der bekanntesten Weinbauregionen der Erde, Schlösser und Kathedralen sowie eine der schönsten Städte der Welt: Paris.","https://nrodlzdf-a.akamaihd.net/dach/3sat/24/10/241016_nordfrankreich_von_oben_sbreise/1/241016_nordfrankreich_von_oben_sbreise_3360k_p36v17.mp4","https://www.3sat.de/dokumentation/von-oben/nordfrankreich-von-oben-102.html","","","8|rodlzdf-a.akamaihd.net/dach/3sat/24/10/241016_nordfrankreich_von_oben_sbreise/1/241016_nordfrankreich_von_oben_sbreise_808k_p11v17.mp4","","128|6660k_p37v17.mp4","","1729082940","","DE-AT-CH","false"`,
  `"","","Portugal von oben","16.10.2024","16:18:00","00:42:52","881","Ganz im Südwesten Europas warten endlos lange Sandstrände, eine wilde Natur und malerische Dörfer und Städte: Besonders aus der Luft zeigt sich die ganze Schönheit Portugals.","https://nrodlzdf-a.akamaihd.net/dach/3sat/24/10/241016_portugal_von_oben_sbreise/1/241016_portugal_von_oben_sbreise_3360k_p36v17.mp4","https://www.3sat.de/dokumentation/von-oben/portugal-von-oben-102.html","","","8|rodlzdf-a.akamaihd.net/dach/3sat/24/10/241016_portugal_von_oben_sbreise/1/241016_portugal_von_oben_sbreise_808k_p11v17.mp4","","116|6660k_p37v17.mp4","","1729088280","","DE-AT-CH","false"`,
];
