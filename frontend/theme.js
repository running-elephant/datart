const path = require('path');
const theme = require(path.join(__dirname, './src/styles/theme/dark.js'));
const themeVariables = [];
for (let key in theme) {
  themeVariables.push('@' + key);
}
const { generateTheme } = require('antd-theme-generator');
generateTheme({
  antDir: path.join(__dirname, './node_modules/antd'), //node_modules中antd的路径
  stylesDir: path.join(__dirname, './src/assets/styles'), //styles对应的目录路径
  varFile: path.join(__dirname, './src/assets/styles/variables.less'), //less变量的入口文件
  themeVariables: themeVariables, //您要动态更改的变量列表
  outputFilePath: path.join(__dirname, './public/theme.less'), //生成的color.less文件的位置
  customColorRegexArray: [/^color\(.*\)$/],
})
  .then(res => {
    console.log('配置主题成功');
  })
  .catch(res => {
    console.log('配置主题失败');
  });
