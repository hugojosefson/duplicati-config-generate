import definitionToConfig from './definition-to-config'
import configToWriteSpec from './config-to-write-spec'

export default (templateFileContentsPromise, definitionsFlatfileContentsPromise) => templateFileContentsPromise
  .then(s => JSON.parse(s))
  .then(template => definitionsFlatfileContentsPromise
    .then(definitions => definitions
      .split('\n\n')
      .map(definition => definition.split('\n'))
      .map(lines => lines.filter(line => line[0] !== '#'))
      .map(lines => lines.filter(line => line.length))
      .filter(lines => lines.length)
      .map(([name, source, ...ignores]) => ({name, source, ignores}))
      .map(definitionToConfig(template))
    )
  )
  .then(configs => configs.map(configToWriteSpec))
