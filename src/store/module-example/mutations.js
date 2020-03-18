export function someMutation (/* state */) {
}

export function saveRouters (state, opt) {
  state.name = opt.name
  state.params = opt.params
}

export function saveMineInfo (state, opt) {
  state.mineInfo = { ...opt }
}

export function saveOrderInfo (state, opt) {
  state.orderInfo = { ...opt }
}

export function setCompanyid (state, id) {
  state.companyid = id
}

export function setUseShop (state, opt) {
  state.useShop = { ...opt }
}

// ---------see-----
export function setSeeProduct (state, opt) {
  state.seeProduct = { ...opt }
}

export function setSeeShop (state, opt) {
  state.seeShop = { ...opt }
}

export function setSeeOrder (state, opt) {
  state.seeOrder = { ...opt }
}
// -------------set dc val
export function setShareDc (state, number) {
  state.shareDc = number
}

export function setShareInfo (state, obj) {
  state.shareInfo = { ...obj }
}

// -------更改存储会员状态
export function setVipStatus (state, obj) {
  for (let k in obj) {
    if (state.vipStatus.hasOwnProperty(k)) {
      state.vipStatus[k] = obj[k]
    }
  }
}
