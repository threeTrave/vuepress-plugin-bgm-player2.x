<template>
  <div class="reco-bgm-panel">
    <!-- 播放器 -->
    <!-- TODO: -->
    <audio id="bgm" :src="audio[curIndex].url" ref="bgm" @ended="bgmEnded" @timeupdate="timeUpdate" @canplay="playReady"></audio>
    <module-transition :position="floatPosition">
      <div v-show="isFloat" @click="changeBgmInfo(false)" class="reco-float-box" :style="floatStyle">
        <img :src="audio[curIndex].cover" />
      </div>
    </module-transition>
    <module-transition>
      <div class="reco-bgm-box" v-show="!isFloat" :style="panelPosition" @mouseenter="isBgmBoxVisible = true" @mouseleave="isBgmBoxVisible = false" @blur="isBgmBoxVisible = false" ref="reco-bgm-box">
        <!-- 封面 -->
        <div class="reco-bgm-cover" @click="changeBgmInfo(false)" :style="`background-image:url(${audio[curIndex].cover})`">
          <!-- mini操作栏 -->
          <div v-show="isMini" class="mini-operation">
            <i v-show="curPlayStatus === 'playing' && isMini" @click.stop="pauseBgm" class="reco-bgm reco-bgm-pause"></i>
            <i v-show="curPlayStatus === 'paused' && isMini" @click.stop="playBgm" class="reco-bgm reco-bgm-play"></i>
          </div>
          <!-- 错误信息显示 -->
          <div v-show="isFault" class="falut-message">播放失败</div>
        </div>
        <module-transition duration=".15">
          <!-- 歌曲信息栏 -->
          <div v-show="!isMini" class="reco-bgm-info">
            <transition name="opacity" mode="out-in">
              <!-- 默认显示的信息 -->
              <div v-if="!isBgmBoxVisible">
                <!-- 歌曲名 -->
                <div class="info-box"><i class="reco-bgm reco-bgm-music music"></i>{{ audio[curIndex].name }}</div>
                <!-- 艺术家名 -->
                <div class="info-box"><i class="reco-bgm reco-bgm-artist"></i>{{ audio[curIndex].artist }}</div>
              </div>
              <!-- hover显示的信息 -->
              <!-- 歌曲操作栏 -->
              <div v-else class="reco-bgm-operation">
                <!-- 用来扩充info box 的长度 -->
                <div class="reco-bgm-cover-mask" @mouseleave="isDurationVisible = false" @mouseenter="isDurationVisible = true">
                  <!-- 时长 -->
                  <transition name="time">
                    <div v-if="!isDurationVisible" class="reco-bgm-time" @click="isDurationVisible = true">
                      {{ `${parseInt(currentTime / 60)}`.padStart(2, '0') + ':' + `${parseInt(currentTime % 60)}`.padStart(2, '0') }}
                    </div>
                    <div v-else class="reco-bgm-time" @click="isDurationVisible = false">
                      {{ `${parseInt(($refs.bgm ? $refs.bgm.duration : 0) / 60)}`.padStart(2, '0') + ':' + `${parseInt(($refs.bgm ? $refs.bgm.duration : 0) % 60)}`.padStart(2, '0') }}
                    </div>
                  </transition>
                </div>

                <!-- 上一首歌 -->
                <i class="reco-bgm reco-bgm-last last" @click="playLast"></i>
                <i v-show="curPlayStatus === 'playing'" @click="pauseBgm" class="reco-bgm reco-bgm-pause pause"></i>
                <i v-show="curPlayStatus === 'paused'" ref="play" @click="playBgm" class="reco-bgm reco-bgm-play play"></i>
                <i class="reco-bgm reco-bgm-next next" @click="playNext"></i>
                <!-- 音乐控件 -->
                <i v-show="!isMute" @click="muteBgm" @mouseenter="isVolumeBarVisible = true" @mouseleave="isVolumeBarVisible = false" class="reco-bgm reco-bgm-volume1 volume">
                  <div class="hoverBar" v-show="isVolumeBarVisible" ref="hoverBar">
                    <!-- <div class="hoverBar" ref="hoverBar"> -->
                    <div class="volume-bar" @click.stop="volumeJump">
                      <div class="bar" ref="vbar"></div>
                    </div></div
                ></i>

                <i v-show="isMute" @click="unMuteBgm" class="reco-bgm reco-bgm-mute mute"></i>

                <i class="reco-bgm-add reco-bgm-add-lyric" @click="isLyricVisible = !isLyricVisible" v-show="!isMobile"> </i>
              </div>
            </transition>

            <!-- 歌曲进度条 -->
            <div class="reco-bgm-progress">
              <div class="progress-bar" @click="progressJump">
                <div class="bar" ref="pbar"></div>
              </div>
            </div>
          </div>
        </module-transition>
        <!-- 缩放按钮 -->
        <module-transition duration=".15">
          <div v-show="!isMini" @click="changeBgmInfo(true)" class="reco-bgm-left-box">
            <i class="reco-bgm reco-bgm-left"></i>
          </div>
        </module-transition>
      </div>
    </module-transition>
  </div>
  <Lyric :value="currentTime" :lrc="audio[curIndex].lyric || '[00:00.000] 暂无歌词，请欣赏'" v-show="isLyricVisible" ref="lyric"></Lyric>
</template>

<script>
let InterVal
// 歌曲封面的旋转角度
let rotateVal = 0
// 歌曲封面的旋转
function rotate() {
  InterVal = setInterval(function () {
    const cover = document.querySelector('.reco-bgm-cover')
    const btn = document.querySelector('.mini-operation')
    const fm = document.querySelector('.falut-message')
    rotateVal += 1
    // 设置旋转属性(顺时针)
    cover.style.transform = 'rotate(' + rotateVal + 'deg)'
    // 设置旋转时的动画  匀速0.1s
    cover.style.transition = '0.1s linear'
    // 设置旋转属性(逆时针)
    btn.style.transform = 'rotate(-' + rotateVal + 'deg)'
    // 设置旋转时的动画  匀速0.1s
    btn.style.transition = '0.1s linear'
    // 设置旋转属性(逆时针)
    fm.style.transform = 'rotate(-' + rotateVal + 'deg)'
    // 设置旋转时的动画  匀速0.1s
    fm.style.transition = '0.1s linear'
  }, 100)
}

import volume from './mixins/volume.js'
import ModuleTransition from './ModuleTransition.vue'
import Lyric from './Lyric - 副本 - 副本.vue'
import { fade } from './utiles/fade'
export default {
  mixins: [volume],
  components: {
    ModuleTransition,
    Lyric
  },
  mounted() {
    // window.onbeforeunload = async e => {
    //   await fade(this.$refs.bgm, 0, 500)
    // }
    if (this.floatPosition === 'left') {
      this.floatStyle = {
        ...this.floatStyle,
        left: '0',
        'border-top-right-radius': '20px',
        'border-bottom-right-radius': '20px'
      }
    } else {
      this.floatStyle = {
        ...this.floatStyle,
        right: '0',
        'border-top-left-radius': '20px',
        'border-bottom-left-radius': '20px'
      }
    }
    // autoShrink为true时隐藏歌曲信息
    if (this.autoShrink) this.changeBgmInfo(true)
    // 获取歌曲信息
    this.audio.forEach(currentAudio => {
      if (!!currentAudio.audioID) {
        // console.log(currentAudio.audioID);
        this.requestSong(currentAudio)
      }
    })
    this.isMobile = !!/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
  },

  data() {
    return {
      panelPosition: POSITION,
      curIndex: 0,
      curPlayStatus: 'paused',
      audio: AUDIOS,
      autoplay: AUTOPLAY,
      isFloat: false,
      isMini: false,
      firstLoad: true,
      isMute: false,
      isFault: false,
      floatPosition: FLOAT_POSITION,
      floatStyle: FLOAT_STYLE,
      autoShrink: AUTO_SHRINK,
      shrinkMode: SHRINK_MODE,
      currentTime: 0,
      isBgmBoxVisible: false,
      isVolumeBarVisible: false,
      isLyricVisible: true,
      isDurationVisible: false,
      isMobile: false,
      defaultVolume: DEFAULT_VOLUME
    }
  },
  watch: {
    curPlayStatus: function (newVal) {
      if (newVal === 'playing') {
        // rotate();
        const cover = document.querySelector('.reco-bgm-cover')
        const btn = document.querySelector('.mini-operation')
        const fm = document.querySelector('.falut-message')
        cover.classList.add('rotate')
        btn.classList.add('rotate')
        fm.classList.add('rotate')
      } else {
        // clearInterval(InterVal);
        const cover = document.querySelector('.reco-bgm-cover')
        const btn = document.querySelector('.mini-operation')
        const fm = document.querySelector('.falut-message')
        cover.classList.remove('rotate')
        btn.classList.remove('rotate')
        fm.classList.remove('rotate')
      }
    },
    isVolumeBarVisible: function (newV) {
      if (!!!this.$refs.hoverBar) return
      if (newV) {
        let percent
        // this.$nextTick()
        // this.$refs.hoverBar.style.isvisible = 'visible'
        if (this.getVolume()) {
          percent = this.getVolume()
        } else {
          // TODO:
          percent = this.defaultVolume
        }
        this.$refs.vbar.style.width = percent * 100 + '%'
      }
    }
  },
  methods: {
    // 显示或隐藏歌曲信息
    changeBgmInfo(bool) {
      const isMobile = this.isMobile
      if (isMobile || this.shrinkMode === 'float') {
        this.isFloat = bool
      } else if (!isMobile && this.shrinkMode === 'mini') {
        this.isMini = bool
        if (bool) {
          this.$refs['reco-bgm-box'].style.width = 0 + 'rem'
        } else {
          this.$refs['reco-bgm-box'].style.width = 18 + 'rem'
        }
      }
    },
    // audio canplay回调事件
    playReady() {
      // 第一次加载时初始化音量条并处理自动播放事件
      if (this.firstLoad) {
        // if (this.getVolume()) {
        //   const percent = this.getVolume()
        //   // this.$refs.vbar.style.width = percent * 100 + "%";
        //   // TODO:
        //   this.$refs.bgm.volume = percent
        //   // } else {
        //   //   const vbar_width = this.$refs.bgm.volume * 100 + "%";
        //   //   this.$refs.vbar.style.width = vbar_width;
        //   // }
        // } else {
        //   this.$refs.bgm.volume = this.defaultVolume

        // }
        this.setVolume(this.defaultVolume)
        this.firstLoad = false
        // 自动播放的处理
        if (this.autoplay) {
          // TODO:
          const playPromise = this.$refs.bgm.play()
          if (playPromise !== undefined) {
            playPromise
              .then(res => {
                console.log('vuepress-plugin-bgm-player: 自动播放成功')
                this.curPlayStatus = 'playing'
              })
              .catch(err => {
                console.log('vuepress-plugin-bgm-player: 自动播放失败')
                // DOMException: play() failed because the user didn‘t interact with the document first
                // 监听用户点击事件实现自动播放
                window.addEventListener('click', this.pageClickHandle)
              })
          }
        }
      }
      // 播放状态下歌曲准备完成立即播放
      if (this.curPlayStatus === 'playing') {
        this.playBgm()
      }
    },
    pageClickHandle() {
      // 自动播放的处理
      if (this.autoplay) {
        this.playBgm()
      }
      window.removeEventListener('click', this.pageClickHandle)
    },
    // 暂停
    pauseBgm() {
      // TODO:
      this.curPlayStatus = 'paused'
      new Promise(resolve => resolve(fade(this.$refs.bgm, 0, 500))).then(res => {
        // console.log(res)
        if (res) {
          this.$refs.bgm.pause()
        }
      })
    },
    // 播放
    playBgm() {
      // TODO:
      fade(this.$refs.bgm, this.getVolume(), 500)
      const playPromise = this.$refs.bgm.play()
      if (playPromise !== undefined) {
        playPromise
          .then(res => {
            if (this.isFault) {
              this.isFault = false
            }
            // eslint-disable-next-line handle-callback-err
          })
          .catch(err => {
            console.log(err)
            // 播放异常时显示播放失败并暂停播放
            this.isFault = true
            this.pauseBgm()
          })
      }
      this.curPlayStatus = 'playing'
      // this.$refs.bgm.play()
    },
    // 播放下一首
    async playNext() {
      await fade(this.$refs.bgm, 0, 300)

      this.$refs.pbar.style.width = 0
      this.isFault = false
      if (this.curIndex >= this.audio.length - 1) {
        this.curIndex = 0
      } else {
        this.curIndex++
      }
    },
    // 播放上一首
    async playLast() {
      await fade(this.$refs.bgm, 0, 300)
      this.$refs.pbar.style.width = 0
      this.isFault = false
      if (this.curIndex <= 0) {
        this.curIndex = this.audio.length - 1
      } else {
        this.curIndex--
      }
    },
    // bgm结束时自动下一首
    bgmEnded() {
      this.$refs.pbar.style.width = 0
      this.playNext()
    },
    // 更新歌曲进度条
    // TODO:
    timeUpdate() {
      const total_time = this.$refs.bgm.duration
      const cur_time = this.$refs.bgm.currentTime
      const bar_width = (cur_time / total_time) * 100 + '%'
      this.$refs.pbar.style.width = bar_width
      this.currentTime = this.$refs.bgm.currentTime
    },
    // 点击进度条跳播
    // TODO:
    progressJump(e) {
      const total_time = this.$refs.bgm.duration
      const percent = e.offsetX / 150
      // 歌曲未加载完成时点击进度条的错误处理
      if (isNaN(total_time)) return
      this.$refs.bgm.currentTime = percent * total_time
    },
    // 点击音量条修改音量
    // TODO:
    volumeJump(e) {
      const percent = e.offsetX / 57
      if (percent >= 0 && percent <= 1) {
        this.isMute = !(percent > 0)
        this.$refs.vbar.style.width = percent * 100 + '%'
        // TODO
        // this.$refs.bgm.volume = percent
        new Promise(resolve => resolve(fade(this.$refs.bgm, percent, 500))).then(res => {
          // console.log(res)
          if (res) {
            this.setVolume(this.$refs.bgm.volume)
            // console.log(percent)
          }
        })
      }
    },
    // 静音
    // TODO:
    muteBgm() {
      if (!this.isMobile) {
        this.isMute = true
        this.setVolume(this.$refs.bgm.volume)
        this.$refs.vbar.style.width = 0
        this.$refs.bgm.volume = 0
      } else {
        this.isVolumeBarVisible = !this.isVolumeBarVisible
      }
    },
    // 取消静音
    // TODO:
    unMuteBgm() {
      this.isMute = false
      if (this.getVolume()) {
        const percent = this.getVolume()
        this.$refs.vbar.style.width = percent * 100 + '%'
        this.$refs.bgm.volume = percent
      } else {
        this.$refs.vbar.style.width = '100%'
        this.$refs.bgm.volume = 1
      }
    },
    requestSong(currentAudio) {
      fetch(`https://api.paugram.com/netease/?id=${currentAudio.audioID}`, {
        method: 'GET'
      }) // *GET, POST, PUT, DELETE, etc.})
        .then(function (response) {
          if (response.ok) {
            return response.json()
          }
        })
        .then(function (data) {
          // console.log(data);
          currentAudio.name = data.title
          currentAudio.artist = data.artist
          currentAudio.cover = data.cover
          currentAudio.url = data.link
          currentAudio.lyric = data.lyric
          // console.log(currentAudio);
        })
        .catch(function (e) {
          console.log('Oops, error')
        })
    }
  }
}
</script>

<style lang="css" scoped>
@import './assets/iconfont/iconfont.css';
@import './styles/output.css';
@import './assets/iconfont/addIconfont/iconfont.css';
/* time控件 */
.time-enter-active,
.time-leave-active {
  transition: all 0.5s ease-out;
}

.time-enter-from,
.time-leave-to {
  opacity: 0;
  transform: translateY(20px);
}
/* 透明度 */
.opacity-enter-active,
.opacity-leave-active {
  transition: opacity 0.3s ease-out;
}

.opacity-enter-from,
.opacity-leave-to {
  opacity: 0;
}
</style>
