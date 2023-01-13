import adjectives from '../data/adjectives.json'
import nouns from '../data/nouns.json'

export default function generateMeaningfulUniqueName() {
  const adj = adjectives[Math.floor(Math.random() * adjectives.length)]
  const noun = nouns[Math.floor(Math.random() * nouns.length)]
  const rnd = Math.floor(Math.random() * 1000)

  return `${adj}-${noun}-${rnd}`
}