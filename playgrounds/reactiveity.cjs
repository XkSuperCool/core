/* eslint-disable */
const {
  ref,
  effect,
  reactive,
  computed,
  effectScope
} = require('../packages/reactivity/dist/reactivity.cjs.js')

/**
 * Ref 存储依赖(Dep) 的结构:
 *
 * Ref.dep = new Set() // 存储 effect
 * Effect.deps = [] // 存储 dep
 *
 * 过程简述:
 * 		访问 .value 触发依赖收集，判断是否为新追踪项，如果是新追踪项则将 effect 添加到 Ref.dep 中, 同时也会将 Ref.dep 添加到 Effect.deps 中,
 * 当发生 Set 动作时，将会在 Ref.dep 中取出获取 Effect，遍历执行 Effect.fn
 */

/**
 * Reactive 存储依赖(Dep) 的结构:
 *
 * reactiveMap: new WeakMap<Target, any>() // 存储普通对象到代理对象的映射关系
 * {
 * 		[普通对象]: Proxy 对象
 * }
 *
 * targetMap: new WeakMap<any, KeyToDepMap>() // 存储普通对象的每个属性的 Dep
 *
 * {
 * 		[普通对象]: new Map() -> {
 * 																[字段1]: new Set() // 储存 effect
 * 																[字段2]: new Set() // 储存 effect
 * 														}
 * }
 *
 * Effect.deps = [] // 存储 dep
 *
 * 过程简述:
 * 		访问对象属性时触发(track), 创建字段对应的 Dep(Set 结构), 之后于 Ref 的依赖收集过程相同，当发生 Set 动作时, 触发
 * (trigger) 将会取出字段对应的 Effect，遍历执行 Effect.fn
 */

/**
 * computed 的大概逻辑:
 * 	创建 ComputedRefImpl 实例和 effect, 当访问 .value 时触发 ComputedRefImpl 的 get value 函数,
 * 在函数中执行 trackRefValue 将 computed 的 Dep 添加到当前活跃的 effect 中，然后执行 computed.effecf,
 * 在执行期间就会收集 computed 函数中使用到的依赖，最后返回 computed(fn) 的返回值, 并将 dirty 设置为 false,
 * 后续再次访问时(判断 dirty 为 false)则直接返回缓存值。
 * 	当 computed 收集的依赖发生改变时，则会执行 computed.effect 的自定义调度器(effect.scheduler), 自定义调度器会将
 * dirty 设置为 true 并触发 trigger 通知依赖 computed 的 effect，执行他 effect.run, 在这过程中将会重新访问 computed.value,
 * 后续逻辑于上面的相同
 */

// effect(() => {
// 	const count = ref(10)
// 	const doubleCount = computed(() => count.value * 2)

// 	effect(() => {
// 		console.log(count.value)
// 		console.log(doubleCount.value)
// 	}, { name: 'view' })
// }, {
// 	name: 'setup'
// })
const arr = reactive([1])
effect(() => {
  console.log(arr.join(''))
})
effect(() => {
	arr.push(2)
})
