import { ReactiveEffect, trackOpBit } from './effect'

export type Dep = Set<ReactiveEffect> & TrackedMarkers

/**
 * wasTracked and newTracked maintain the status for several levels of effect
 * tracking recursion. One bit per level is used to define whether the dependency
 * was/is tracked.
 *
 * wasTracked 和 newTracked 维护了几个级别的效果跟踪递归状态。每个级别使用一个比特位来定义依赖项是否被跟踪。
 */
type TrackedMarkers = {
  /**
   * wasTracked
   */
  w: number
  /**
   * newTracked
   */
  n: number
}

export const createDep = (effects?: ReactiveEffect[]): Dep => {
  const dep = new Set<ReactiveEffect>(effects) as Dep
  dep.w = 0
  dep.n = 0
  return dep
}

export const wasTracked = (dep: Dep): boolean => (dep.w & trackOpBit) > 0

/**
 * 当 effect 为第二层级时:
 * n = 2 = 00000000000000000000000000000010
 * t = 4 = 00000000000000000000000000000100
 * r = 0 = 00000000000000000000000000000000
 *
 * 三层: n = 6, t = 8, n = 0
 * 四层: n = 14, t = 16, n = 0
 * 即确保了在每层 Effect 都可以将此 Dep 收集
 *
 * 感觉这里只有 dep.n = 0 的时候才会返回 fasle, 也就是表示新的追踪项
 */
export const newTracked = (dep: Dep): boolean => (dep.n & trackOpBit) > 0

export const initDepMarkers = ({ deps }: ReactiveEffect) => {
  if (deps.length) {
    for (let i = 0; i < deps.length; i++) {
      deps[i].w |= trackOpBit // set was tracked
    }
  }
}

export const finalizeDepMarkers = (effect: ReactiveEffect) => {
  const { deps } = effect
  if (deps.length) {
    let ptr = 0
    for (let i = 0; i < deps.length; i++) {
      const dep = deps[i]
      /**
       * wasTracked 返回 true 表示已经被收集过
       * newTracked 返回 false 表示是一个新依赖
       * 如果返回的是 true && !fasle 则表示是一个过时的依赖，需要清除
       */
      if (wasTracked(dep) && !newTracked(dep)) {
        // 清除旧依赖
        dep.delete(effect)
      } else {
        deps[ptr++] = dep
      }
      // clear bits
      // 按位非(~), 将 0 变 1, 1 变 0
      // 4 = 0100 -> 1011
      dep.w &= ~trackOpBit
      dep.n &= ~trackOpBit
    }
    deps.length = ptr
  }
}
