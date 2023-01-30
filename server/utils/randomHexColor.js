
const randomHexColor = (prefex = '#') => {
  return `${prefex}${Math.floor(Math.random()*16777215).toString(16)}`
}

const multipleRandomHexColors = (number = 2, prefex) => {
  let colors = []
  for (let i = 0; i < number; i++) {
    colors.push(randomHexColor(prefex))
  }
  return colors
}

module.exports.randomHexColor = randomHexColor
module.exports.multipleRandomHexColors = multipleRandomHexColors