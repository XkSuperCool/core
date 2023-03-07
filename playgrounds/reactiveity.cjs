/* eslint-disable */
const { ref, effect, reactive } = require('../packages/reactivity/dist/reactivity.cjs.js')
// const count = ref(0)

// effect(() => {
// 	count.value
// 	console.log()
// })

// effect(() => {
// 	count.value
// 	count.value = 1
// 	count.value = 2
// })

const state = reactive({ count: 0 })

effect(() => {
	state.count
})