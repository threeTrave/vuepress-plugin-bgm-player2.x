import { getDirname, path } from '@vuepress/utils'
const __dirname = getDirname(import.meta.url)
// import * as fetch from 'node-fetch'

export const bgmPlayer = (options, context) => ({
  define() {
    const { rootComponent, position, audios, autoplay, autoShrink, shrinkMode, floatPosition, floatStyle, defaultVolume } = options
    return {
      POSITION: position || {
        left: '10px',
        bottom: '10px',
        'z-index': '999999'
      },
      AUDIOS: audios,
      AUTOPLAY: autoplay || false, // 是否开启自动播放
      AUTO_SHRINK: autoShrink || false, // 是否默认收缩
      SHRINK_MODE: shrinkMode || 'float',
      FLOAT_POSITION: floatPosition || 'left',
      FLOAT_STYLE: floatStyle || {
        bottom: '200px',
        'z-index': '999999'
      },
      ROOT_COMPONENT: rootComponent || true, // 是否注册为根组件
      DEFAULT_VOLUME: defaultVolume || 0.75
    }
  },
  name: 'vuepress-plugin-bgm-player2x',
  // enhanceAppFiles: resolve(__dirname, './bin/enhanceAppFile.js'),
  clientConfigFile: path.resolve(__dirname, './bin/enhanceAppFile.js'),
  globalUIComponents: 'BgMusic',
  async onInitialized() {}
})
export default bgmPlayer
