/* eslint-disable */
const { ref, effect, reactive, computed, effectScope, onScopeDispose } = require('../packages/reactivity/dist/reactivity.cjs.js')

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


// effect(() => {
// 	const state = reactive({
// 		count: 0
// 	})

// 	const doubleCount = computed(() => {
// 		return state.count * 2
// 	})

// 	effect(() => {
// 		console.log(doubleCount.value)
// 		console.log(state.count)
// 	}, { name: 'view' })

// 	state.count = 2
// }, {
// 	name: 'setup'
// })