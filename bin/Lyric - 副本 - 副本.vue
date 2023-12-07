<template>
  <div class="lyric-container">
    <!-- lyricIndex为当前歌曲播放的进度在歌词中的位置，进而改变正在播放的歌词的样式 -->
    <ul class="lyric" v-show="isShowMusicList" ref="lyric">
      <li class="temp" :key="currentLyricItem[0]">
        {{ currentLyricItem[1] }}
        <!-- {{ index }} -->
      </li>
    </ul>
  </div>
</template>

<script>
import { dragUtile } from "./utiles/dragUtile";
import { binary_search } from "./utiles/binary_search";
export default {
  data() {
    return {
      currentMUsicLyric: null,
      lyricIndex: 0,
      isShowMusicList: true,
      currentLyricItem: [0, ""],
      isMobile: false,
    };
  },
  mounted() {
    this.getCurrentMusicLyric();
    this.currentLyricItem = this.currentMUsicLyric[0];
    dragUtile(this.$refs.lyric);
    this.isMobile =
      !!/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
      );
    if (this.isMobile) {
      this.$refs.lyric.style.display = "none";
      // console.log("ok");
    }
  },
  components: {},
  props: {
    value: {
      type: Number,
      default: 0,
    },
    lrc: {
      type: String,
      default: "",
    },
  },
  watch: {
    value(newV) {
      if (this.currentMUsicLyric) {
        if (
          this.lyricIndex + 5 < this.currentMUsicLyric.length &&
          newV > this.currentMUsicLyric[this.lyricIndex + 5][0]
        ) {
          this.lyricIndex = binary_search(
            this.currentMUsicLyric,
            this.lyricIndex + 2,
            this.currentMUsicLyric.length - 1,
            newV
          );
          this.currentLyricItem = this.currentMUsicLyric[this.lyricIndex];

          // this.$refs.lyric.scrollTop = this.lyricIndex * 80;
        } else if (
          this.lyricIndex + 1 < this.currentMUsicLyric.length &&
          newV > this.currentMUsicLyric[this.lyricIndex + 1][0]
        ) {
          this.lyricIndex++;
          this.currentLyricItem = this.currentMUsicLyric[this.lyricIndex];

          // this.$refs.lyric.scrollTop = this.lyricIndex * 80;
        } else if (
          this.lyricIndex - 1 >= 0 &&
          newV < this.currentMUsicLyric[this.lyricIndex - 1][0]
        ) {
          this.lyricIndex = binary_search(
            this.currentMUsicLyric,
            0,
            this.lyricIndex - 1,
            newV
          );
          this.currentLyricItem = this.currentMUsicLyric[this.lyricIndex];
        }
      }
    },
    lrc() {
      // 初始化
      this.lyricIndex = -1;
      this.getCurrentMusicLyric();
    },
  },

  methods: {
    getCurrentMusicLyric() {
      let lyricArr = this.lrc.split("[").slice(1);
      let lrcObj = [];
      lyricArr.forEach((item) => {
        let arr = item.split("]"); // 再分割右括号
        // 时间换算成秒
        let m = parseFloat(arr[0].split(":")[0]);
        let s = parseFloat(arr[0].split(":")[1]);
        arr[0] = m * 60 + s;
        // 去除歌词中的换行符
        if (arr[1] != "\n") {
          lrcObj.push(arr);
        }
      });
      // 存储数据
      this.currentMUsicLyric = lrcObj;
      // console.log(this.currentMUsicLyric);
    },
  },
};
</script>

<style lang="css">
@import "./styles/lyric.css";
</style>
