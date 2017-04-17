// to filter schema path for use of table head
function filterArray (arrayToFilter, arrayOfItems) {
  var filtered = arrayToFilter.filter((item) => {
    if (arrayOfItems.includes(item)) {
      return false
    } else {
      return true
    }
  })
  return filtered
}

// outputs a date with M/D/Y
function dateNow (input) {
  if (input) {
    return input.toLocaleDateString()
  } else {
    var date = new Date().toLocaleDateString()
    return date
  }
}
// check and remove if doc to add has empty string value
function checkObj (objOne, objTwo) {
  for (var key in objOne) {
    if (!Object.keys(objTwo).includes(key) || objOne[key].length < 1) {
      objOne[key] = undefined
    }
  }
  return objOne
}

function getErrMsg (input) {
  console.log(input)
  var errMsgs = []
  for (var key in input) {
    errMsgs.push(input[key].message)
  }
  return errMsgs
}

function userIsAvailable (user) {
  if (!user) {
    return ''
  } else {
    return user.username
  }
}

module.exports = {
  filterKeys: filterArray,
  dateNow: dateNow,
  checkObj: checkObj,
  getErrMsg: getErrMsg,
  userIsAvailable: userIsAvailable
}
