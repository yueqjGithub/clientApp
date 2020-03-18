// import { Dialog } from 'quasar'
// let lat
// let lng
// let geoSuccess = (position) => { // 获取地理位置成功
//   // alert(position.coords.latitude)
//   lat = position.coords.latitude
//   lng = position.coords.longitude
//   return { lat: lat, lng: lng }
// }
let geoError = (error) => { // 获取地理位置失败
  alert('获取地理位置失败' + error.message)
}

let getGeo = (lat, lng) => {
  navigator.geolocation.getCurrentPosition((position) => {
    lat = position.coords.latitude
    lng = position.coords.longitude
    alert('lat:' + lat + 'lng:' + lng)
  }, geoError)
}

export { getGeo }
