import { argv } from 'node:process'


function log(thing) {
  const filepath = argv[1].split('/')
  const filename = filepath[filepath.length-1]
  if (filename !== 'index.js') console.log(thing)
  return thing
}

export { log }
