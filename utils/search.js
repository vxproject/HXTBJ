const searchList = (inputName, list) => {
  let inputSd = inputName.trim()
  let sd = inputSd.toLowerCase()
  let num = sd.length
  // 手机号码
  let temp = list.filter(item => {
    let text = item.mobile.slice(0, num).toLowerCase()
    return (text && text == sd)
  })
  if (temp[0]) {
    return temp
  }
  //名字
  let name = list.filter(
    item => {
      let consignee = item.consignee.slice(0, num)
      return (consignee && consignee == sd)
    }
  )
  if (name[0]) {
    return name
  }
  return []
}
module.exports={
  searchList
}