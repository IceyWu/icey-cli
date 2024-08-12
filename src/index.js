#! /usr/bin/env node
import fs from "fs-extra";
import chalk from "chalk";
import { table } from "table";
import { program } from "commander";
import create from "./create.js";
import { templates } from "./constants.js";
import { baseInfo } from "./info.js";
import { getDataHandler } from "./repo.js";
import { to } from "@iceywu/utils";

// 读取package.json配置信息
const pkg = fs.readJsonSync(new URL("../package.json", import.meta.url));

// 查看版本号
program.version(pkg.version, "-v, --version");

// 创建项目命令
program
  .command("create <app-name>")
  .description("创建一个新的项目")
  .option("-t --template [template]", "输入模板名称快速创建项目")
  .option("-f --force", "强制覆盖本地同名项目")
  .option("-i --ignore", "忽略项目相关描述,快速创建项目")
  .action(create);

// 查看模板列表
program
  .command("ls")
  .description("查看所有可用的模板")
  .action(async () => {
    const [_, dataRe] = await to(getDataHandler());
    const tempData = dataRe?.Templates || [];
    const data = tempData.map((item) => [
      chalk.greenBright(item.name),
      chalk.white(item.svn_url),
      chalk.white(item.description),
    ]);
    data.unshift([
      chalk.white("模板名称"),
      chalk.white("模板地址"),
      chalk.white("模板描述"),
    ]);
    console.log(table(data));
  });

// 配置脚手架基本信息
program
  .name(pkg.name)
  .description(pkg.description)
  .usage("<command> [options]")
  // 用在内置的帮助信息之后输出自定义的额外信息
  .on("--help", () => {
    baseInfo();
    console.log(
      `\r\n Run ${chalk.cyanBright(
        `${pkg.name} <command> --help`
      )} for detailed usage of given command.`
    );
  });

program.parse(process.argv);
