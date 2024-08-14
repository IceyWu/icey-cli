import dayjs from "dayjs";
import fs from "fs-extra";
import chalk from "chalk";
import path from "path";
import logSymbols from "log-symbols";

const appDirectory = fs.realpathSync(process.cwd());
const resolveApp = (relativePath) => path.resolve(appDirectory, relativePath);

// 删除文件夹
export async function removeDir(dir, isGit) {
  try {
    await fs.remove(resolveApp(dir));
    if (!isGit) {
      console.log(logSymbols.warning, `已覆盖同名文件夹${dir}`);
    }
  } catch (err) {
    console.log(err);
    return;
  }
}

// 修改package.json配置
export async function changePackageJson(name, info) {
  try {
    const pkg = await fs.readJson(resolveApp(`${name}/package.json`));
    Object.keys(info).forEach((item) => {
      if (info[item] && info[item].trim()) {
        pkg[item] = info[item];
      }
    });
    await fs.writeJson(resolveApp(`${name}/package.json`), pkg, { spaces: 2 });
  } catch (err) {
    console.log(err);
    console.log(
      logSymbols.warning,
      chalk.yellow("更新项目信息失败,请手动修改package.json")
    );
  }
}

// 获取仓库地址
export async function getCloneUrl(data) {
  return `${data.clone_url}`;
}

export const formatTime = (
  time,
  format = "YYYY-MM-DD HH:mm:ss",
  isISO = true
) => {
  if (!time) return "";
  isISO && (time = new Date(time).getTime());
  if (time.toString().length < 13) {
    time = time * 1000;
  }
  return dayjs(time).format(format);
};
