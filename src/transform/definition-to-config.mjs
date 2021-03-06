import { URL } from 'url'
import ramda from 'ramda'
import {
  cleanHostname,
  filterExpression,
  prepend,
  removeAnyLeadingSlash
} from '../extractable-modules/string-manipulation.mjs'

const { compose } = ramda

const targetUrl = (templateTargetUrl, name) => {
  const url = new URL(templateTargetUrl)

  url.hostname = compose(
    prepend('duplicati-'),
    removeAnyLeadingSlash,
    cleanHostname
  )(name)

  url.pathname = '/'

  return url.toString()
}

export default ({
  template,
  sourcePathPrefix = '/source',
  namePrefix = '',
  nameSuffix = ' to b2 backblaze'
}) =>
  ({ name, source, ignores }) =>
    ({
      ...template,
      Backup: {
        ...template.Backup,
        Name: `${namePrefix}${name}${nameSuffix}`,
        TargetURL: targetUrl(template.Backup.TargetURL, name),
        DBPath: undefined,
        Metadata: undefined,
        Sources: [
          `${sourcePathPrefix}${source}`
        ],
        Filters: ignores.map((ignore, index) => ({
          Order: index,
          Include: false,
          Expression: filterExpression(sourcePathPrefix)(ignore)
        }))
      },
      DisplayNames: {
        [`${sourcePathPrefix}${source}`]: source
      }
    })
