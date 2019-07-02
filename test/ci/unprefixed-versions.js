/* eslint-disable @typescript-eslint/no-var-requires,no-console */
const path = require('path')
const packageJson = require(path.join(__dirname, '../../package.json'))
const props = ['dependencies', 'devDependencies', 'optionalDependencies', 'peerDependencies,']

const UNPREFIXED_RE = /^\^|~/
const found = []

props.forEach(prop => {
  const obj = packageJson[prop]

  if (obj) {
    Object.keys(obj).forEach(name => {
      const version = obj[name]

      if (version.match(UNPREFIXED_RE)) {
        found.push({
          name,
          prop,
          version,
        })
      }
    })
  }
})

if (found.length) {
  console.log(`FOUND ${found.length} UNPREFIXED VERSION${found.length === 1 ? '' : 'S'}!`)

  found.forEach(({
    name,
    prop,
    version
  }) => console.log(`  ${name} -> ${version} (in ${prop})`))

  console.log()

  process.exit(1)
} else {
  console.log('No prefixed versions found!')
}
