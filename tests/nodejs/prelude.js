global.readline = () => {
  return global[Symbol.for('user_input')].shift()
}

global.print = (...args) => {
  console.log(...args)
}
