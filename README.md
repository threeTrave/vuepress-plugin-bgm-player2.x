# vuepress-plugin-bgm-player2

![demo.png](./images/demo.png)

## 如何开始

```
npm i vuepress-plugin-bgm-player2x
```



## Details

> Bgm player plugin for vuepress-theme-reco or other vuepress theme2.x.  
> 
> 基于@vuepress-reco/vuepress-plugin-bgm-player对reco2.x的适配版本。
> 
> 原仓库地址：[vuepress-reco/vuepress-plugin-bgm-player: Bgm player plugin for vuepress-theme-reco or other vuepress theme (github.com)](https://github.com/vuepress-reco/vuepress-plugin-bgm-player)
> Vuepress 音乐播放器插件

| 使用位置           | 值                                                      |
| -------------- | ------------------------------------------------------ |
| plugin name    | vuepress-plugin-bgm-player2x                           |
| component name | BgMusic（自动出现在页面中，无需添加额外代码） |

## Options

> 以下为插件注入时的参数。

### Attributes

| 参数            | 说明            | 类型      | 默认值                                                  | 可选值            |
| ------------- | ------------- | ------- | ---------------------------------------------------- | -------------- |
| rootComponent | (新增)是否注册为区根组件 | Boolean | true                                                 | true/false     |
| audios        | 播放列表          | Array   | 无                                                    | -              |
| position      | 播放器位置         | Object  | { left: '10px', bottom: '10px', 'z-index': '999999'} | -              |
| autoplay      | 是否自动播放        | Boolean | false                                                | true/false     |
| autoShrink    | 是否自动缩小        | Boolean | false                                                | true/false     |
| shrinkMode    | 指定PC端缩小为哪种模式  | String  | 'float'                                              | 'mini'/'float' |
| floatPosition | 指定浮窗模式浮动在哪一侧  | String  | 'left'                                               | 'left'/'right' |
| floatStyle    | 浮窗的样式         | Object  | { bottom: '200px', 'z-index': '999999' }             | -              |

### rootComponent说明



我们默认为你将播放器放在全局根节点下，作为全局组件。（这是符合通常情况下你希望播放器所在位置的）然而我们还帮你将播放器注册名为"BgMusic"的全局组件，你可以在任何地方使用它。这些配置可以在

目录下的文件中查看![77dc382d-e79a-4b6b-be3c-00c12bdf65f5](file:///C:/Users/%E5%93%86%E5%95%A6A%E6%A2%A6/Pictures/Saved%20Pictures/77dc382d-e79a-4b6b-be3c-00c12bdf65f5.png)

### audios示例

- audios为播放列表的对象数组

- 无默认值必须配置

- 示例
  
  ```
  audios: [
    // 本地文件示例
    {
      name: '장가갈 수 있을까',
      artist: '咖啡少年',
      url: '/bgm/1.mp3',
      cover: '/bgm/1.jpg'
    },
    // 网络文件示例
    {
      name: '강남역 4번 출구',
      artist: 'Plastic / Fallin` Dild',
      url: 'https://assets.smallsunnyfox.com/music/2.mp3',
      cover: 'https://assets.smallsunnyfox.com/music/2.jpg'
    },
    {
      name: '用胳膊当枕头',
      artist: '최낙타',
      url: 'https://assets.smallsunnyfox.com/music/3.mp3',
      cover: 'https://assets.smallsunnyfox.com/music/3.jpg'
    }
  ]  
  ```
  
  ### shrinkMode说明

- PC端可以通过shrinkMode来指定正常模式缩小时缩小为哪种模式

- 移动端默认缩小为浮窗模式

## About

- **兼容性**：vuepress-plugin-bgm-player是使用HTML5的Audio开发，故兼容性与Audio的兼容性相关
- 对于 `vuepress-theme-reco` 的 `dark` 模式的适配  
  ![dark.png](./images/dark.png)
- **开发计划**
  - 移动端适配问题修复
