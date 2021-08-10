function DrawCanvas(ctx, config) {
  const props = {
    panel: [], // 存储棋盘数组
    oldPanel: [],
    col: 4,
    row: 4,
    ctx,
    score: 0,
    color: {
      "2": "#eee4da",
      "4": "#ede0c8", //#776e65
      "8": "#f2b179",
      "16": "#f59563",
      "32": "#f67c5f",
      "64": "#f65e3b",
      "128": "#edcf72",
      "256": "#edcc61",
      "512": "#edc850",
      "1024": "#edc53f",
      "2048": "#edc22e" //f9f6f2
    }
  }
  for (let i in props)
    this[i] =
      Object.prototype.toString.call(config !== "[Object object]") || !config[i]
        ? props[i]
        : config[i]
  this._init(ctx)
}

DrawCanvas.prototype._init = function(ctx) {
  const { col, row, panel } = this

  //生成空面板
  for (let i = 1; i <= row; i++) {
    panel[i - 1] = []
    for (let j = 1; j <= col; j++) {
      panel[i - 1][j - 1] = "0"
    }
  }
  this._random()
  this._updatePanel(ctx)
  //添加监听
  this._addlistener(ctx)
}
DrawCanvas.prototype.restart = function(ctx) {
  this.score = 0
  this.panel = []
  this.oldPanel = []
  this._init(ctx)
}
DrawCanvas.prototype._drawRoundRect = function(
  ctx,
  x,
  y,
  width,
  height,
  radius
) {
  ctx.beginPath()
  ctx.arc(x + radius, y + radius, radius, Math.PI, (Math.PI * 3) / 2)
  ctx.lineTo(width - radius + x, y)
  ctx.arc(
    width - radius + x,
    radius + y,
    radius,
    (Math.PI * 3) / 2,
    Math.PI * 2
  )
  ctx.lineTo(width + x, height + y - radius)
  ctx.arc(width - radius + x, height - radius + y, radius, 0, (Math.PI * 1) / 2)
  ctx.lineTo(radius + x, height + y)
  ctx.arc(radius + x, height - radius + y, radius, (Math.PI * 1) / 2, Math.PI)
  ctx.closePath()
}

DrawCanvas.prototype._random = function() {
  let isAvailable = false
  const { panel, row, col, oldPanel } = this
  if (oldPanel.join() === panel.join()) {
    //较之前无变化
    return false
  }
  outer: for (let i = 0; i < row; i++) {
    for (let j = 0; j < col; j++) {
      if (panel[i][j] === "0") {
        isAvailable = true
        break outer
      }
    }
  }
  if (isAvailable) {
    while (1) {
      var _row = Math.floor(Math.random() * this.row)
      var _col = Math.floor(Math.random() * this.col)
      if (this.panel[_row][_col] === "0") {
        //判断生成的随机数位置为0才随机生成2或4
        this.panel[_row][_col] = Math.random() > 0.9 ? "4" : "2"
        break
      }
    }
  } else {
    alert("游戏结束咯！")
  }
}

DrawCanvas.prototype._updatePanel = function(ctx) {
  const { col, row } = this
  let score = 0
  this._random() //添加随机块
  document.querySelector(".score").innerHTML = this.score

  // 清除画板
  ctx.clearRect(150, 50, 500, 500)

  // 绘制大面板
  ctx.fillStyle = "#FFF"
  ctx.fillRect(0, 0, 500, 500)
  this._drawRoundRect(ctx, 0, 0, 500, 500, 5)
  ctx.fillStyle = "#bbada0"
  ctx.strokeStyle = "#bbada0"
  ctx.stroke()
  ctx.fill()
  for (let i = 1; i <= col; i++) {
    for (let j = 1; j <= row; j++) {
      score = this.panel[i - 1][j - 1]
      this._drawRoundRect(
        ctx,
        20 * j + 100 * (j - 1),
        20 * i + 100 * (i - 1),
        100,
        100,
        5
      )
      if (!score || score === "0") {
        ctx.fillStyle = "rgba(238, 228, 218, 0.35)"
        ctx.stroke()
        ctx.fill()
      } else {
        ctx.fillStyle = this.color[score]
        ctx.stroke()
        ctx.fill()
        this._addScore(
          ctx,
          score,
          50 + 20 * j + 100 * (j - 1),
          50 + 20 * i + 100 * (i - 1)
        )
      }
    }
  }
}
DrawCanvas.prototype._addScore = function(ctx, score, x, y) {
  const color = score > 4 ? "#f9f6f2" : "#776e65"
  const fonter = score > 100 ? "800 40px Arial" : "800 56px Arial"
  ctx.font = fonter
  ctx.textAlign = "center"
  ctx.textBaseline = "middle"
  ctx.fillStyle = color
  ctx.fillText(score, x, y)
}

DrawCanvas.prototype._addlistener = function(ctx) {
  const _this = this
  const keyboard = {
    38: "0", // Up
    39: "1", // Right
    40: "2", // Down
    37: "3", // Left
    87: "0", // W
    68: "1", // D
    83: "2", // S
    65: "3", // A
    82: "4" // Reset
  }
  function _listen(event) {
    const modifiers =
      event.altKey || event.ctrlKey || event.metaKey || event.shiftKey
    const pos = keyboard[event.which]
    if (!modifiers && pos) {
      event.preventDefault()
    }
    _this.oldPanel = JSON.parse(JSON.stringify(_this.panel))
    switch (pos) {
      case "0":
        _this.moveUp(ctx)
        _this._updatePanel(ctx)
        break
      case "1":
        _this.moveRight(ctx)
        _this._updatePanel(ctx)
        break
      case "2":
        _this.moveDown(ctx)
        _this._updatePanel(ctx)
        break
      case "3":
        _this.moveLeft(ctx)
        _this._updatePanel(ctx)
        break
      case "4":
        _this.reset(ctx)
        _this._updatePanel(ctx)
        break
      default:
        break
    }
  }
  document.onkeydown = _listen
}
DrawCanvas.prototype.moveUp = function() {
  const { row, col, panel } = this

  //二维数组初始化
  const newArr = []
  for (let i = 0; i < row; i++) {
    newArr[i] = []
  }

  // 二维数组左转
  for (let i = 0; i < row; i++) {
    for (let j = 0; j < col; j++) {
      newArr[col - j - 1][i] = panel[i][j]
    }
  }
  this.panel = newArr
  this.moveLeft()

  //二维数组右转
  for (let i = 0; i < col; i++) {
    for (let j = 0; j < row; j++) {
      newArr[j][row - i - 1] = this.panel[i][j]
    }
  }
  this.panel = newArr
}
DrawCanvas.prototype.moveDown = function() {
  this.panel = this.panel.reverse()
  this.moveUp()
  this.panel = this.panel.reverse()
}

DrawCanvas.prototype.moveLeft = function() {
  const { row, col, panel } = this
  let newPanel = []
  for (let i = 0; i < row; i++) {
    let arr = this._combineArr(panel[i], col)
    newPanel.push(arr)
  }
  this.panel = newPanel
}
DrawCanvas.prototype.moveRight = function() {
  const { row, col, panel } = this
  let newPanel = []
  for (let i = 0; i < row; i++) {
    let arr = this._combineArr(panel[i].reverse(), col)
    newPanel.push(arr.reverse())
  }
  this.panel = newPanel
}

DrawCanvas.prototype._combineArr = function(arr, len) {
  arr = arr.filter(o => o !== "0")
  let newArr = [],
    newArrLen = arr.length
  for (let i = 0; i < newArrLen; i++) {
    if (arr[i] === arr[i + 1]) {
      this.score += 2 * arr[i]
      newArr.push(2 * arr[i] + "")
      i += 1
    } else {
      newArr.push(arr[i])
    }
  }
  // //补零
  return newArr.concat(Array(len - newArr.length).fill("0"))
}
