import download from "download-git-repo";
import ora from "ora";
import chalk from "chalk";
/**
 * 克隆模板方法
 * @param {*} repository 远程仓库地址
 * @param {*} appName 项目名称
 * @returns 
 */
export default function clone(repository, appName) {
  const spinner = ora("正在创建项目......").start();
  return new Promise((resolve, reject) => {
    // 第四个参数为一个callback，如果err存在则代表拉取项目失败
    download(repository, appName, {clone: true}, err => {
      if (err) {
        spinner.fail(chalk.red(err));
        reject(err);
        return;
      }
      spinner.succeed(chalk.greenBright("项目创建成功"));
      resolve();
    })
  })
}
