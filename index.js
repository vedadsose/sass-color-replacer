const {readFile, writeFile} = require('fs')

const getFile = (file) => {
  return new Promise((resolve, reject) => {
    readFile(file, 'utf-8', (err, data) => {
      if (err) reject(err)
      else resolve(data)
    })
  })
}

async function getColors(file) {
  const data = await getFile(file)
  return data
    .split('\n')
    .filter((line) => line.substr(0, 1) === '$')
    .map((line) => line.replace(/ /g,'').replace(';', ''))
    .reduce((colors, line) => {
      const [variable, color] = line.split(':')
      colors[color.toUpperCase()] = variable
      return colors
    }, {})
}

(async ()=>{
  const fileName = 'example.sass'

  // Fetch our colors and file we need to check
  const colors = await getColors('colors.sass')
  const file = await getFile(fileName)

  // Search for colors and replace them with variables
  let result = file
  let counter = 0
  const re = /#[0-9a-f]{6}|#[0-9a-f]{3}/gi
  while (match = re.exec(file)) {
    const hex = match[0].toUpperCase()
    if (!colors[hex]) return
    result = result.replace(match[0], colors[hex])
    counter++
  }

  // Write the output to file
  writeFile(fileName, result, (err) => {
    if (err) console.log(`There was an error writing to file ${fileName}`)
    else {
      if (counter === 0) console.log('No unreplaced colors found')
      else console.log(`Successfully found and replaced ${counter} colors`)
    }
  })
})()
