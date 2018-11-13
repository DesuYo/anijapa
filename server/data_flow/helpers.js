exports.splitObject = map => {
  return Object
    .keys(map)
    .map(key => ({ [key]: map[key] }))
}

exports.resolveArguments = (data, ...args) => {
  let output = []
  for (let arg of args) 
    output.push(typeof arg === 'function' ? arg(data) : arg)
  return output
}