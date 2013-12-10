
/*
 * GET About page.
 */

exports.page = function(req, res){
  res.render('about', { title: 'Protobuf Message Monitor' });
};