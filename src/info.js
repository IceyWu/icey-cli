import gradientString from "gradient-string";
import boxen from "boxen";
import chalk from "chalk";
import figlet from "figlet";
import fs from "fs-extra";
import semver from "semver";
import { to } from "@iceywu/utils";
import ora from "ora";

// 读取package.json配置信息
const pkg = fs.readJsonSync(new URL("../package.json", import.meta.url));
export const pkgName = figlet.textSync(pkg.name, {
  font: "Standard",
  horizontalLayout: "default",
  verticalLayout: "default",
  width: 100,
  whitespaceBreak: true,
});

const welcomeMessage = gradientString("cyan", "magenta").multiline(
  `您好! 欢迎使用 \n${pkgName} \n开源脚手架\n为您提供多个情景下的项目模板,快捷搭建项目🎉`
);

const boxenOptions = {
  padding: 0.5,
  borderColor: "cyan",
  borderStyle: "round",
};

export const baseInfo = () => {
  console.log(boxen(welcomeMessage, boxenOptions));
};

// 获取最新版本号
async function fetchLatestVersion(packageName) {
  const response = await fetch(`https://registry.npmjs.org/${packageName}`);
  const data = await response.json();
  return data["dist-tags"].latest;
}
export const checkVersionInfo = async () => {
  const spinner = ora("正在检查版本更新......").start();
  const pkg = fs.readJsonSync(new URL("../package.json", import.meta.url));
  const [_, latestVersion] = await to(fetchLatestVersion(pkg.name));
  if (latestVersion && semver.gt(latestVersion, pkg.version)) {
    console.log("\n");
    const updateMessage = gradientString("cyan", "magenta").multiline(
      `发现新版本: ${latestVersion} \n当前版本: ${pkg.version} \n请运行以下命令进行更新: npm install -g ${pkg.name}`
    );
    console.log(boxen(updateMessage, boxenOptions));
    console.log("\n");
    spinner.succeed();
  } else {
    console.log(chalk.green(`当前已是最新版本: ${pkg.version}`));
    spinner.succeed();
  }
};
