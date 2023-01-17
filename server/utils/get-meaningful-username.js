const adjectives = require('../data/adjectives.json')
const nouns = require('../data/nouns.json')

module.exports = function geeaningfulUsername() {
  const adj = adjectives[Math.floor(Math.random() * adjectives.length)]
  const noun = nouns[Math.floor(Math.random() * nouns.length)]
  const rnd = Math.floor(Math.random() * 1000)

  return `${adj}-${noun}-${rnd}`
}