'use strict'
const libnpm = require('libnpm')
const readPkg = require('read-pkg')
const fs = require('fs')

module.exports = async ({ depSpecs, key }) => {
  const pkg = await readPkg({ normalize: false })
  const depPkgs = await Promise.all(depSpecs.map(libnpm.manifest))
  const deps = depPkgs.reduce(
    (acc, { name, version }) => ({ ...acc, [name]: version }),
    {},
  )
  pkg[key] = {
    ...pkg[key],
    ...deps,
  }
  fs.writeFileSync('package.json', libnpm.stringifyPackage(pkg), 'utf8')
}
