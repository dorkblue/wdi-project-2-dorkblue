$(document).ready(function () {
  console.log('script is linked!')

  // enable click on list item, and redirect to page
  var $indexList = $('table.list tbody tr')
  var $allMed = $('div.all-med')
  var $medGroup = $('div.med-group')
  var $addButton = $medGroup.find('div.add-button')
  var $allNavTab = $('div.panel-body li')

  $indexList.on('click', function (e) {
    window.location.href = this.id
  })

  $allNavTab.on('click')

  $addButton.on('click', function (e) {
    // $medGroup.clone(true).appendTo($allMed)
    var $newMedGroup = $medGroup.clone(true)
    var $inlineGroup = $newMedGroup.find('div.form-inline')
    $inlineGroup.find('div.add-button').remove()
    $inlineGroup.find('div.delete-button').on('click', function (e) {
      $(e.delegateTarget).parents('div.form-group.med-group').remove()
    })
    $newMedGroup.appendTo($allMed)
  })

  $('#autocomplete').autocomplete({
    source: '/patient/search',
    minLength: 3,
    select: function (event, ui) {
      window.location.href = '/patient/' + ui.item.value
    }
  })

  $('#autocomplete-consult').autocomplete({
    source: '/patient/search',
    minLength: 3
  })
})
