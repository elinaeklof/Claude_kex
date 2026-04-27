/**
 * 3D Software ocean effect with Canvas2D
 * Customized with ID24 color palette
 */

// Init Context
let c = document.getElementById('ocean-canvas').getContext('2d')
let postctx = document.createElement('canvas').getContext('2d')
let canvas = c.canvas
let vertices = []

// Add post-processing canvas to the hero section
document.querySelector('.hero').appendChild(postctx.canvas)
postctx.canvas.classList.add('hero__canvas')
postctx.canvas.style.position = 'absolute'
postctx.canvas.style.top = '0'
postctx.canvas.style.left = '0'
postctx.canvas.style.width = '100%'
postctx.canvas.style.height = '100%'
postctx.canvas.style.zIndex = '1'

// Color palette from CSS variables
const colors = {
  coral: '#ff9276',
  coralDark: '#e06a50',
  navy: '#1a1a2e',
  bgLight: '#eeeeee',
  textDark: '#000000'
}

// Effect Properties
let vertexCount = 7000
let vertexSize = 5
let oceanWidth = 204
let oceanHeight = -80
let gridSize = 32
let waveSize = 16
let perspective = 100

// Common variables
let depth = (vertexCount / oceanWidth * gridSize)
let frame = 0
let { sin, cos, tan, PI } = Math

// Render loop
let oldTimeStamp = performance.now()
let loop = (timeStamp) => {
  let rad = sin(frame / 100) * PI / 20
  let rad2 = sin(frame / 50) * PI / 10
  const dt = (timeStamp - oldTimeStamp) / 1000
  oldTimeStamp = timeStamp

  frame += dt * 50

  // Resize canvas to match container
  if (postctx.canvas.width !== postctx.canvas.offsetWidth || postctx.canvas.height !== postctx.canvas.offsetHeight) {
    postctx.canvas.width = canvas.width = postctx.canvas.offsetWidth
    postctx.canvas.height = canvas.height = postctx.canvas.offsetHeight
  }

  // Create linear gradient background
  const linearGrad = c.createLinearGradient(0, 0, canvas.width, 0)
  linearGrad.addColorStop(0, '#f7f2ef')
  linearGrad.addColorStop(0.48, '#fbdfd1')
  linearGrad.addColorStop(1, '#f7f2ef')
  
  c.fillStyle = linearGrad
  c.fillRect(0, 0, canvas.width, canvas.height)

  // Create and apply radial gradient overlay
  const radialGrad = c.createRadialGradient(
    canvas.width * 0.78,
    canvas.height * 0.72,
    0,
    canvas.width * 0.78,
    canvas.height * 0.72,
    Math.max(canvas.width, canvas.height) * 0.34
  )
  radialGrad.addColorStop(0, 'rgba(255, 146, 118, 0.28)')
  radialGrad.addColorStop(1, 'rgba(255, 146, 118, 0)')

  c.globalCompositeOperation = 'multiply'
  c.fillStyle = radialGrad
  c.fillRect(0, 0, canvas.width, canvas.height)
  c.globalCompositeOperation = 'source-over'

  c.save()
  c.translate(canvas.width / 2, canvas.height / 2)

  c.beginPath()
  vertices.forEach((vertex, i) => {
    let ni = i + oceanWidth
    let x = vertex[0] - frame % (gridSize * 2)
    let z = vertex[2] - frame * 2 % gridSize + (i % 2 === 0 ? gridSize / 2 : 0)
    let wave = (cos(frame / 45 + x / 50) - sin(frame / 20 + z / 50) + sin(frame / 30 + z * x / 10000))
    let y = vertex[1] + wave * waveSize
    let a = Math.max(0, 1 - (Math.sqrt(x ** 2 + z ** 2)) / depth)

    y -= oceanHeight

    // Transformation variables
    let tx, ty, tz
    tx = x
    ty = y
    tz = z

    // Rotation Y
    tx = x * cos(rad) + z * sin(rad)
    tz = -x * sin(rad) + z * cos(rad)

    x = tx
    y = ty
    z = tz

    // Rotation Z
    tx = x * cos(rad) - y * sin(rad)
    ty = x * sin(rad) + y * cos(rad)

    x = tx
    y = ty
    z = tz

    // Rotation X
    ty = y * cos(rad2) - z * sin(rad2)
    tz = y * sin(rad2) + z * cos(rad2)

    x = tx
    y = ty
    z = tz

    x /= z / perspective
    y /= z / perspective

    if (a < 0.01) return
    if (z < 0) return

    c.globalAlpha = a * 0.9
    // Use coral color from palette with wave variation - lighter and more visible
    let hue = 10 + wave * 15 // orange/coral hues
    c.fillStyle = `hsl(${hue}deg, 95%, 50%)`
    c.fillRect(x - a * vertexSize / 2, y - a * vertexSize / 2, a * vertexSize, a * vertexSize)
    c.globalAlpha = 1
  })
  c.restore()

  // Post-processing
  postctx.drawImage(canvas, 0, 0)

  postctx.globalCompositeOperation = "screen"
  postctx.filter = 'blur(16px)'
  postctx.drawImage(canvas, 0, 0)
  postctx.filter = 'blur(0)'
  postctx.globalCompositeOperation = "source-over"

  requestAnimationFrame(loop)
}

// Generating dots
for (let i = 0; i < vertexCount; i++) {
  let x = i % oceanWidth
  let y = 0
  let z = i / oceanWidth >> 0
  let offset = oceanWidth / 2
  vertices.push([(-offset + x) * gridSize, y * gridSize, z * gridSize])
}

loop(performance.now())
