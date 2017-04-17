// // RESTFULL ROUTES
// CREATE FORM   => GET => /movies/new
// EDIT FORM     => GET => /movies/:id/edit
//
// INDEX         => GET => /movies
// CREATE        => POST => /movies
// SHOW          => GET => /movies/:id
// UPDATE        => PUT => /movies/:id
// DELETE        => DELETE => /movies/:id

function showHome (req, res) {
  res.render('unrestricted/homepage')
}

module.exports = {
  showHome: showHome
}
