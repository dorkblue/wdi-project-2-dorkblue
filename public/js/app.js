$(document).ready(function () {
  console.log('script is linked!')



  // enable click on list item, and redirect to page
  var $indexList = $('table.list tbody tr')
  $indexList.on('click', function (e) {
    window.location.href = this.id
  })
})
