import ProgressBar from "progress";
import https from "https";
import { templates } from "./constants.js";
import { to } from "@iceywu/utils";
import ora from "ora";

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

export const getDataHandler = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const options = {
        hostname: "api.github.com",
        path: "/users/iceywu/repos?per_page=100&type=owner&sort=updated",
        method: "GET",
        headers: {
          "User-Agent": "node.js",
        },
      };
      const tempFunc = () => {
        return new Promise((resolve, reject) => {
          const req = https.request(options, (res) => {
            let data = "";

            const totalLength = parseInt(res.headers["content-length"], 10);
            const spinner = ora("正在获取模板列表......").start();
            // const bar = new ProgressBar("数据获取中 [:bar] :percent :etas", {
            //   complete: "=",
            //   incomplete: " ",
            //   width: 20,
            //   total: totalLength,
            // });
            // bar.tick(0);

            res.on("data", (chunk) => {
              data += chunk;
              // console.log('🌵-----chunk.length-----', chunk.length);
              // bar.tick(chunk.length);
            });

            res.on("end", () => {
              spinner.succeed()
              try {
                const parsedData = JSON.parse(data);
                resolve(parsedData);
              } catch (error) {
                reject(error);
              }
            });
          });

          req.on("error", (error) => {
            reject(error);
          });

          req.end();
        });
      };
      const [err, data] = await to(tempFunc());
      if (err) {
        resolve(getList(templates));
      } else if (data) {
        resolve(getList(data));
      } else {
        resolve(getList(templates));
      }
    } catch (error) {
      resolve(getList(templates));
    }
  });
};

export function filterRepos(repos, key) {
  return repos.filter((repo) => repo.topics && repo.topics.includes(key));
}
