const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}
const formatTime2 = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('-') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}



//弹窗
function showmodel(content, success = function () { }) {

  wx.showModal({
    title: '温馨提示',
    content: content,
    confirmText: "确定",
    confirmColor: "#FF5000",
    showCancel: false,
    success: function () {
      success();
    }
  })
}

//弹窗
function showCancelModel(content, success = function () { }) {

  wx.showModal({
    title: '温馨提示',
    content: content,
    confirmText: "确定",
    confirmColor: "#FF5000",
    success: function (res) {
      if (res.confirm) success();

    }
  })
}

//正则表达式
function inputRole(value, rex) {
  let phoneRegExp = new RegExp(rex);
  if (phoneRegExp.test(value) == true) {
    return true;
  } else {
    return false;
  }
}



function save_token(token) {
  try {
    wx.setStorageSync('token', token)
  } catch (e) { }
}



module.exports = {
  formatTime, showmodel, inputRole, save_token, showCancelModel, formatTime2, 
}
