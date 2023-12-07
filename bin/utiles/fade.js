const sleep = duration => new Promise(resolve => setTimeout(resolve, duration))
let timer
// let preInterval
const limit = (min, max, v) => Math.min(max, Math.max(min, v))

const fade = async (target, to, duraton = 1000, slerp = 30) => {
  //   if (timer != null) {
  //     console.log('clear')
  //     ManagedInterval.stop(timer)
  //     console.log(ManagedInterval.dir)
  //     // clearInterval(timer)
  //     // timer = null
  //     // preInterval = null
  //   }
  //   console.log('clear')

  ManagedInterval.stop(timer)
  //   console.log(ManagedInterval.dir)

  to = limit(0, 1, to)
  const from = target.volume
  //   timer = setInterval(() => {
  //     let newVolume = target.volume + (to - from) / slerp
  //     target.volume = limit(newVolume)
  //     // target += (to - from) / slerp
  //     console.log(target.volume)
  //   }, duraton / slerp)
  timer = ManagedInterval.start(() => {
    let newVolume = target.volume + (to - from) / slerp
    target.volume = parseFloat(limit(Math.min(to, from), Math.max(to, from), newVolume).toFixed(2))
    // target.volume += (to - from) / slerp
    // console.log('volume:' + target.volume)
  }, duraton / slerp)
  let tmpTimer = timer
  //   console.log(interval.toString())
  //   preInterval = interval
  await sleep(duraton)
  //   console.log(`tmp: ${tmpInterval}`)
  //   if (preInterval === null) {
  //     return false
  //   } else {
  //   if (ManagedInterval.active(tmpTimer)) {
  return ManagedInterval.stop(tmpTimer, true)
  //   }
  //   clearInterval(timer)
  //   timer = null
  //   return true
  //   }
  //   console.log(1)
}
// class a {
//   volume = 0
// }
// let b = new a()
// fade(b, 1)
// console.log(b.volume)
// let c = async () => {
//   fade(b, 1)
//   await sleep(500)
//   fade(b, 0)
// }
// c()
export { fade }
export default fade
// interval 管理类
class ManagedInterval {
  //   #fn
  //   #interval
  //   #timer
  static dir = {}

  //   constructor(fn, interval) {
  //     this.#fn = fn
  //     this.#interval = interval
  //   }

  //   get active(id) {
  //     return !!this.#timer
  //   }
  static active(id) {
    if (id in this.dir) {
      return this.dir[id]
    }
  }
  //   static start(timer) {
  //     // timer = setInterval(fn, interval)
  //     this.dir[timer] = true
  //     return timer
  //   }
  static start(fn, interval) {
    timer = setInterval(fn, interval)
    this.dir[timer] = true
    return timer
  }
  //返回值表示当前状态是否被打断
  static stop(id, flag = false) {
    let active = this.active(id)
    if (active) {
      clearInterval(id)
      this.dir[id] = false
    }
    if (flag) {
      this.remove(id)
    }
    return active
  }
  static remove(id) {
    if (id in this.dir) {
      delete this.dir[id]
    }
  }
}
// console.log(parseFloat((1.572318).toFixed(2)))
// ManagedInterval.start(1)
// console.log(ManagedInterval.dir)
// ManagedInterval.stop(1, true)
// console.log(ManagedInterval.dir)
