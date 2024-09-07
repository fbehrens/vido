import * as fs from "fs";
export function load({ params, cookies }) {
  let path, filme;
  path = "static/mediathek/filme";
  filme = fs.readFileSync(path, "utf8");
  filme = filme.slice(1, -1);
  filme = filme.split(`,"X":`);
  console.log(filme[0]);
  filme.shift();

  filme = filme.map((e) => JSON.parse(e));
  //   filme = filme.map([]);
  //   filme = filme.filter((e) => e[2].includes("Markus Lanz vom"));
  // const [
  //   line_channel, // 0
  //   line_topic, // 1
  //   title, // 2
  //   // 3
  //   // 4
  //   ,
  //   ,
  //   hr_duration, // 5
  //   size, // 6
  //   description, // 7
  //   url_video, // 8
  //   url_website, // 9
  //   url_subtitle, // 10
  //   // 11
  //   ,
  //   url_video_low, // 12
  //   // 13
  //   ,
  //   url_video_hd, // 14
  //   // 15
  //   ,
  //   timestamp, // 16
  // ] = JSON.parse(line);

  return { filme };
}
