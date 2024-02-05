const Movie = require('../models/movie');

module.exports = {
  create
};

async function create(req, res) {
    try {
      const movie = await Movie.findById(req.params.id);
      // we push an object with the data for the 
      // review sub-doc into Mongoose arrays
      movie.reviews.push(req.body);
      // Not saving sub-doc, but the top level document.
      const updatedMovie = await movie.save();
      res.redirect(`/movies/${updatedMovie._id}`);
    } catch (err) {
      console.error(err);
      res.status(500).send(err.message);
    }
  }