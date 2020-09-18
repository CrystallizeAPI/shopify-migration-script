import parse5 from 'parse5'
// import ow from 'ow'

import helpers from './helpers'

function getTextContent (node, opt = {}) {
  function parseText (text = '') {
    let t = text
    if (node.parentNode.nodeName !== 'code') {
      // If line breaks are present, remove all line breaks and first and last whitespace
      if (text.match(/\r?\n|\r/g)) {
        t = text.replace(/\r?\n|\r/g, '')

        if (!opt.keepSpaces) {
          t = t.trim()
        }
      }

      // Replace double white space with a single
      if (!opt.keepSpaces) {
        t = t.replace(/\s{2,}/g, ' ')
      }
    } else {
      // Normalize whitespace
      if (!opt.keepSpaces) {
        t = t.replace(/\s/g, ' ')
      }

      // Remove line breaks
      t = text.replace(/\r?\n|\r/g, '')
    }

    return t
  }

  if (node.nodeName === '#text') {
    return parseText(node.value)
  }

  return (
    node.childNodes &&
    node.childNodes.length === 1 &&
    node.childNodes[0].nodeName === '#text' &&
    parseText(node.childNodes[0].value)
  )
}

function getMetadataFromNode (node) {
  const metadata = {}

  if (node.attrs && node.attrs.length > 0) {
    const validAttrs = helpers.getValidAttributes(node)
    if (validAttrs) {
      validAttrs.forEach(attr => {
        const attrOnNode = node.attrs.find(a => a.name === attr)
        if (attrOnNode) {
          metadata[attr] = attrOnNode.value
        }
      })
    }
  }

  if (Object.keys(metadata).length > 0) {
    return metadata
  }

  return null
}

const nodeTypesThatCannotHaveDirectTextChildren = 'ul ol table thead tbody tfoot tr th td img'.split(
  ' '
)

function nodeHasContent (node) {
  if (node.nodeName === '#text') {
    if (
      nodeTypesThatCannotHaveDirectTextChildren.includes(
        node.parentNode.nodeName
      )
    ) {
      return false
    }
  }
  return true
}

function contentNodeHasContent (contentNode) {
  // Empty, inline contentNodes
  if (
    contentNode &&
    contentNode.kind === 'inline' &&
    contentNode.type === null &&
    !contentNode.textContent
  ) {
    return false
  }

  if (contentNode) {
    return true
  }

  return false
}

function fromHTML (html, opt) {
  const options = opt || {}

  // ow(html, ow.string);
  // ow(options.whitelistTags, ow.any(ow.nullOrUndefined, ow.array));
  // ow(options.blacklistTags, ow.any(ow.nullOrUndefined, ow.array));

  function getcontentNodeDefinition ({ tagName }) {
    const definition = helpers.HTMLElementToTypeMap[tagName]

    if (definition) {
      if (options.blacklistTags) {
        if (options.blacklistTags.includes(tagName)) {
          return {
            ...definition,
            type: 'container'
          }
        }
      } else if (options.whitelistTags) {
        if (!options.whitelistTags.includes(tagName)) {
          return {
            ...definition,
            type: 'container'
          }
        }
      }
    }

    return (
      definition || {
        kind: 'inline',
        type: null
      }
    )
  }

  function parsecontentNode (node) {
    const contentNodeDefinition = getcontentNodeDefinition(node)

    const contentNode = {}
    Object.assign(contentNode, contentNodeDefinition)

    if (['meta', 'style'].includes(node.nodeName)) {
      return null
    }

    const metadata = getMetadataFromNode(node)
    if (metadata) {
      if (!contentNode.metadata) {
        contentNode.metadata = {}
      }
      Object.assign(contentNode.metadata, metadata)
    }

    const textContent = getTextContent(node, opt)
    if (textContent) {
      contentNode.textContent = textContent
    } else if (node.childNodes && node.childNodes.length > 0) {
      contentNode.children = Array.from(node.childNodes)
        .filter(nodeHasContent)
        .map(parsecontentNode)
        .filter(contentNodeHasContent)
    }

    return contentNode
  }

  if (!html) {
    return null
  }

  const fragment = parse5.parseFragment(html)

  if (fragment.childNodes.length === 1) {
    return [parsecontentNode(fragment.childNodes[0])]
  }

  return fragment.childNodes.map(parsecontentNode).filter(contentNodeHasContent)
}

export default fromHTML
