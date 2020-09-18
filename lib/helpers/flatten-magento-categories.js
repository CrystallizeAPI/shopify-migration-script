const flattenCategories = categories => {
  return categories.reduce((acc, cur) => {
    if (cur.children_data && cur.children_data.length > 0) {
      acc = acc.concat(flattenCategories(cur.children_data, cur.name))
      acc.push({ id: cur.id, name: cur.name })
    } else {
      acc.push({ id: cur.id, name: cur.name })
    }
    return acc
  }, [])
}

export default flattenCategories
