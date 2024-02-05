const Movie = require('../models/movie');

const create = async (req, res) => {
    try {
      let movie = await Movie.findById(req.params.id);
      movie.reviews.push(req.body);
      await movie.save();
      res.redirect(`/movies/${movie._id}`);
    } catch (err) {
      console.error(err);
      res.status(500).send(err.message);
    }
  }

  module.exports = {
    create
  };