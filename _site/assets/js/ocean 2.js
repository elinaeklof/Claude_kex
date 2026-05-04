const canvas = document.getElementById('ocean-canvas')
const c = canvas.getContext('2d')

let vertices = []

// Settings
let vertexCount = 7000
let vertexSize = 5
let oceanWidth = 204
let oceanHeight = -80
let gridSize = 32
let waveSize = 16
let perspective = 100

let depth = (vertexCount / oceanWidth * gridSize)
let frame = 0
let { sin, cos, PI } = Math

// Resize
function resize() {
  if (
    canvas.width !== canvas.offsetWidth ||
    canvas.height !== canvas.offsetHeight
  ) {
    canvas.width = canvas.offsetWidth
    canvas.height = canvas.offsetHeight
  }
}

// Loop
let oldTime = performance.now()

function loop(time) {
  const dt = (time - oldTime) / 1000
  oldTime = time

  frame += dt * 50

  resize()

  // 🔥 VIKTIGT: ingen bakgrund ritas → hero syns
  c.clearRect(0, 0, canvas.width, canvas.height)

  const rad = sin(frame / 100) * PI / 20
  const rad2 = sin(frame / 50) * PI / 10

  c.save()
  c.translate(canvas.width / 2, canvas.height / 2)

  vertices.forEach((vertex, i) => {
    let x = vertex[0] - (frame % (gridSize * 2))
    let z =
      vertex[2] -
      ((frame * 2) % gridSize) +
      (i % 2 === 0 ? gridSize / 2 : 0)

    let wave =
      cos(frame / 45 + x / 50) -
      sin(frame / 20 + z / 50) +
      sin(frame / 30 + (z * x) / 10000)

    let y = vertex[1] + wave * waveSize
    let a = Math.max(0, 1 - Math.sqrt(x ** 2 + z ** 2) / depth)

    y -= oceanHeight

    // Rotate Y
    let tx = x * cos(rad) + z * sin(rad)
    let tz = -x * sin(rad) + z * cos(rad)

    x = tx
    z = tz

    // Rotate Z
    tx = x * cos(rad) - y * sin(rad)
    let ty = x * sin(rad) + y * cos(rad)

    x = tx
    y = ty

    // Rotate X
    ty = y * cos(rad2) - z * sin(rad2)
    tz = y * sin(rad2) + z * cos(rad2)

    y = ty
    z = tz

    // Perspective
    x /= z / perspective
    y /= z / perspective

    if (a < 0.01 || z < 0) return

    c.globalAlpha = a * 0.9

    // Coral color
    let hue = 10 + wave * 15
    c.fillStyle = `hsl(${hue}, 95%, 55%)`

    c.fillRect(
      x - (a * vertexSize) / 2,
      y - (a * vertexSize) / 2,
      a * vertexSize,
      a * vertexSize
    )

    c.globalAlpha = 1
  })

  c.restore()

  requestAnimationFrame(loop)
}

// Generate points
for (let i = 0; i < vertexCount; i++) {
  let x = i % oceanWidth
  let y = 0
  let z = (i / oceanWidth) >> 0
  let offset = oceanWidth / 2

  vertices.push([
    (-offset + x) * gridSize,
    y * gridSize,
    z * gridSize,
  ])
}

// Start
loop(performance.now())