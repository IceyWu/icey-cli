import axios from "axios";
import { templates } from "./constants.js";
export const getDataHandler = async () => {
  const data = await axios
    .get(
      "https://api.github.com/users/iceywu/repos?per_page=100&type=owner&sort=updated"
    )
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      return templates;
    });
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

export function filterRepos(repos, key) {
  return repos.filter((repo) => repo.topics && repo.topics.includes(key));
}
// getDataHandler();
