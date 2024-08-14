import ora from "ora";
import chalk from "chalk";
import { exec } from "child_process";
import { resolve as nodeResolve } from "node:path";
import { removeDir } from "./utils.js";

/**
 * 克隆模板方法
 * @param {*} repository 远程仓库地址
 * @param {*} appName 项目名称
 * @returns
 */
export default function clone(repository, appName) {
  const spinner = ora("正在创建项目......").start();
  return new Promise((resolve, reject) => {
    exec(`git clone ${repository} ${appName}`, (err) => {
      if (err) {
        spinner.fail(chalk.red(err));
        reject(err);
        return;
      } else {
        removeDir(nodeResolve(appName, ".git"), true)
          .then(() => {
            spinner.succeed(chalk.greenBright("项目创建成功"));
            resolve();
          })
          .catch((err) => {
            spinner.fail(chalk.red(`删除 .git 目录失败: ${err}`));
            reject(err);
          });
      }
    });
  });
}
