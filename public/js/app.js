$(document).ready(function () {
  console.log('script is linked!')

  // enable click on list item, and redirect to page
  var $indexList = $('table.list tbody tr')
  $indexList.on('click', function (e) {
    window.location.href = this.id
  })

  $('#autocomplete').autocomplete({
    source: '/clinic/patient/search',
    minLength: 3,
    select: function (event, ui) {
      console.log(ui)
      window.location.href = 'patient/' + ui.item.value
    }
  })

  //
  // $( "#search" ).catcomplete({
  //       source: 'suggest_zip.php',
  //       select: function( event, ui ) {
  //           window.location = ui.item.url;
  //       }
  //   });
})
