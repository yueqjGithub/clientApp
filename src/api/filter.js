export function toMoney (money = 0) {
  let m = parseFloat(money) || 0
  return m.toFixed(2)
}

export function toTime (timeData) {
  if (timeData !== '') {
    let newDate = /\d{4}-\d{1,2}-\d{1,2}/g.exec(timeData)
    return newDate
  }
}

export function dealImage (base64, w, callback) {
  let newImage = new Image()
  let quality = 0.6 // 压缩系数0-1之间
  newImage.src = base64
  let imgWidth, imgHeight
  newImage.onload = function () {
    imgWidth = this.width
    imgHeight = this.height
    let canvas = document.createElement('canvas')
    let ctx = canvas.getContext('2d')
    if (Math.max(imgWidth, imgHeight) > w) {
      if (imgWidth > imgHeight) {
        canvas.width = w
        canvas.height = w * imgHeight / imgWidth
      } else {
        canvas.height = w
        canvas.width = w * imgWidth / imgHeight
      }
    } else {
      canvas.width = imgWidth
      canvas.height = imgHeight
      quality = 0.6
    }
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    ctx.drawImage(this, 0, 0, canvas.width, canvas.height)
    let base64 = canvas.toDataURL('image/jpeg', quality) // 压缩语句
    callback(base64) // 必须通过回调函数返回，否则无法及时拿到该值
  }
}
