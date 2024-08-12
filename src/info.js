import gradientString from "gradient-string";
import boxen from "boxen";
// import chalk from "chalk";
import figlet from "figlet";
import fs from "fs-extra";

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
