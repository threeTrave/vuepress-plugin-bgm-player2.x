import BgMusic from './BgMusic - 副本.vue'
// export default ({ Vue }) => {
//   Vue.component('BgMusic', BgMusic)
// }
import { defineClientConfig } from '@vuepress/client'

export default defineClientConfig({
  enhance({ app, router, siteData }) {
    app.component('BgMusic', BgMusic)
  },
  setup() {},
  layouts: {},
  rootComponents: ROOT_COMPONENT ? [BgMusic] : []
})
