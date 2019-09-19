const unitValue = {
  s: 1000,
  m: 60 * 1000,
  // I hope not :)
  h: 60 * 60 * 1000
}

/**
 * Convert strings 0m1.232s to milliseconds
 */
const parseTime = str => {
  const reg = /([\d.]+)(m|s)/g

  let ms = 0
  let match

  while ((match = reg.exec(str))) {
    const [_, value, unit] = match

    ms += parseFloat(value) * unitValue[unit]
  }

  return ms
}

module.exports = str => {
  const out = {}

  for (const line of str.split(/\r?\n/)) {
    if (!line) {
      continue
    }
    const [name, value] = line.trim().split('\t')

    out[name.trim()] = parseTime(value.trim())
  }

  return out
}
