import ProgressBar from "progress";
import https from "https";
import { templates } from "./constants.js";

const getList = (data = []) => {
  const publicRepos = data.filter((repo) => !repo.private && !repo.archived);
  const publicAndNotForkRepos = publicRepos.filter((repo) => !repo.fork);

  const repoGroups = {
    Templates: filterRepos(publicAndNotForkRepos, "template"),
    "Vite Ecosystem": filterRepos(publicAndNotForkRepos, "vite"),

    UnoCSS: filterRepos(publicRepos, "unocss"),

    All: publicAndNotForkRepos,
  };

  return repoGroups;
};

export const getDataHandler = async () => {
  const options = {
    hostname: "api.github.com",
    path: "/users/iceywu/repos?per_page=100&type=owner&sort=updated",
    method: "GET",
    headers: {
      "User-Agent": "node.js",
    },
  };

  return new Promise((resolve, reject) => {
    const req = https.request(options, (res) => {
      let data = "";

      const totalLength = parseInt(res.headers["content-length"], 10);
      const bar = new ProgressBar("数据获取中 [:bar] :percent :etas", {
        complete: "=",
        incomplete: " ",
        width: 20,
        total: totalLength,
      });
      bar.tick(0);

      res.on("data", (chunk) => {
        data += chunk;
        // console.log('🌵-----chunk.length-----', chunk.length);
        bar.tick(chunk.length);
      });

      res.on("end", () => {
        try {
          const parsedData = JSON.parse(data);
          console.log("\n数据获取完成");
          resolve(parsedData);
        } catch (error) {
          console.log("\n数据获取完成");
          reject(error);
        }
      });
    });

    req.on("error", (error) => {
      reject(error);
    });

    req.end();
  })
    .then((data) => {
      return getList(data);
    })
    .catch((err) => {
      return getList(templates);
    });
};

export function filterRepos(repos, key) {
  return repos.filter((repo) => repo.topics && repo.topics.includes(key));
}
