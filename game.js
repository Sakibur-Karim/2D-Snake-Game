kaboom()

loadRoot('Images/')
loadSprite('bg', 'bg.jpg')

const block_size = 40

layers(['bg', 'game', 'ui'], 'game')

add([sprite('bg'), layer('bg'), scale(2)])

ui = add([layer('ui')])
let score = 0

ui.on('draw', () => {
  drawText({
    text: 'Score: ' + score,
    size: 24,
    font: 'sink',
    pos: vec2(8, 24),
  })
})

const directions = {
  UP: 'up',
  DOWN: 'down',
  LEFT: 'left',
  RIGHT: 'right',
}

let current_direction = directions.RIGHT
let run_action = false
let snake_length = 3
let snake_body = []

function respawn_snake() {
  destroyAll('snake')

  snake_body = []
  snake_length = 3
  for (let i = 1; i <= snake_length; i++) {
    let segment = add([
      rect(block_size, block_size),
      pos(width() / 2, height() / 2),
      color(0, 0, 255),
      area(),
      'snake',
    ])
    snake_body.push(segment)
  }
  current_direction = directions.RIGHT
}

function respawn_all() {
  run_action = false
  wait(0.5, function () {
    respawn_snake()
    respawn_food()
    run_action = true
  })
}

respawn_all()

onKeyPress('up', () => {
  if (current_direction != directions.DOWN) {
    current_direction = directions.UP
  }
})

onKeyPress('down', () => {
  if (current_direction != directions.UP) {
    current_direction = directions.DOWN
  }
})

onKeyPress('left', () => {
  if (current_direction != directions.RIGHT) {
    current_direction = directions.LEFT
  }
})

onKeyPress('right', () => {
  if (current_direction != directions.LEFT) {
    current_direction = directions.RIGHT
  }
})

let move_delay = 0.08
let timer = 0
onUpdate(() => {
  if (!run_action) return
  timer += dt()
  if (timer < move_delay) return
  timer = 0

  let move_x = 0
  let move_y = 0

  switch (current_direction) {
    case directions.DOWN:
      move_x = 0
      move_y = block_size
      break
    case directions.UP:
      move_x = 0
      move_y = -1 * block_size
      break
    case directions.LEFT:
      move_x = -1 * block_size
      move_y = 0
      break
    case directions.RIGHT:
      move_x = block_size
      move_y = 0
      break
  }

  // Get the last element (the snake head)
  let snake_head = snake_body[snake_body.length - 1]

  snake_body.push(
    add([
      rect(block_size, block_size),
      pos(snake_head.pos.x + move_x, snake_head.pos.y + move_y),
      color(0, 0, 255),
      area(),
      'snake',
      'wraps',
    ])
  )

  if (snake_body.length > snake_length) {
    let tail = snake_body.shift() // Remove the last of the tail
    destroy(tail)
  }
})

onUpdate('wraps', (e) => {
  if (e.pos.x > width()) {
    e.pos.x = 0
  }
  if (e.pos.x < 0) {
    e.pos.x = width()
  }
  if (e.pos.y > height()) {
    e.pos.y = 0
  }
  if (e.pos.y < 0) {
    e.pos.y = height()
  }
})

let food = null

function respawn_food() {
  let new_pos = rand(vec2(width(), height()))

  if (food) {
    destroy(food)
  }
  food = add([
    rect(block_size, block_size),
    color(0, 255, 0),
    pos(new_pos),
    area(),
    'food',
  ])
}

onCollide('snake', 'food', (s, f) => {
  snake_length++
  respawn_food()
  score++
})
