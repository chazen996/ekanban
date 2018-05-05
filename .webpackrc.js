/* 使用js的写法替代.webpackrc文件 */
export default {
  extraBabelPlugins: [["import", { libraryName: "antd", libraryDirectory: "es", style: "css" }]],
  proxy: {
    "/project": {
      target: "http://39.105.25.18:8000",
      pathRewrite: {"^/project" : "/"}
    },
    "/kanban":{
      target: "http://39.105.25.18:8000",
      pathRewrite: {"^/kanban" : "/"}
    },
    "/editkanban":{
      target: "http://39.105.25.18:8000",
      pathRewrite: {"^/editkanban" : "/"}
    },
  }
}
