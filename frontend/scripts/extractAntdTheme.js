const path = require('path');
const {darkThemeSingle} = require(path.join(__dirname, '../node_modules/antd/dist/theme.js'));
const { generateTheme } = require('antd-theme-generator');

const themeVariables = [];

for (let key in darkThemeSingle) {
  themeVariables.push('@' + key);
}
console.log(__dirname,'__dirname')
generateTheme({
  antDir: path.join(__dirname, '../node_modules/antd'), //node_modules中antd的路径
  stylesDir: path.join(__dirname, '../public/antd'), //styles对应的目录路径
  varFile: path.join(__dirname, '../node_modules/antd/lib/style/themes/index.less'), //less变量的入口文件
  themeVariables: themeVariables, //您要动态更改的变量列表
  outputFilePath: path.join(__dirname, '../public/antd/theme.less'), //生成的color.less文件的位置
  customColorRegexArray: [/^color\(.*\)$/],
})
  .then(res => {
    console.log('配置主题成功');
  })
  .catch(res => {
    console.log('配置主题失败');
  });
