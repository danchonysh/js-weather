const can = document.querySelector('#can')
ctx = can.getContext('2d')

const data = [6, 7, 8, 17, 12, 10, 13, 13, 13, 14, 14, 17, 17, 16, 16, 15, 14, 12, 12, 11, 10, 8, 17, 12]

let scale = 10

can.width = 500
can.height = 280

const step = Math.round((can.width - 20) / 24)

ctx.lineWidth = 2

// Отрисовка осей
ctx.beginPath()

ctx.moveTo(scale, scale)
ctx.lineTo(scale, can.height - scale)
ctx.lineTo(can.width - scale, can.height - scale)

ctx.stroke()

// Отрисовка графика
ctx.beginPath()

ctx.strokeStyle = 'red'
ctx.lineCap = 'round'

ctx.moveTo(scale, can.height - data[0]*scale)
let count = 1
data.forEach(el => ctx.lineTo(step*count++, can.height - el*scale))

ctx.stroke()

can.addEventListener('mouseover', (e) => {
	console.log(`X: ${e.offsetX}, Y: ${e.offsetY}`)
})