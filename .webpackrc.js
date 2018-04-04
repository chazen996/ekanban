/* 使用js的写法替代.webpackrc文件 */
export default {
  extraBabelPlugins: [["import", { libraryName: "antd", libraryDirectory: "es", style: "css" }]],
  proxy: {
    "/project": {
      target: "http://localhost:8000",
      pathRewrite: {"^/project" : "/"}
    }
  }
}
