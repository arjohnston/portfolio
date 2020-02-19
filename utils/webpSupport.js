/* global Image:false */

function webpSupport () {
  return new Promise(resolve => {
    const webP = new Image()
    webP.src =
      'data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA'
    webP.onload = webP.onerror = function () {
      resolve(webP.height === 2)
    }
  })
}

module.exports = {
  webpSupport: webpSupport
}
