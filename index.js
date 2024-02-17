var express = require("express");
var cors = require('cors');
const { default: mongoose } = require("mongoose");
require('dotenv').config();

mongoose.connect(process.env.DB_ACCESS_VARIABLE);
var app = express();
var routes = express.Router();

var Movie = mongoose.model('Movie', new mongoose.Schema({
    title: String,
    duration: String,
    categories: Array,
    type: String
}));

//GETS
async function getAll(req, resp) {
    var data = await Movie.find();
    return resp.json(data);
}

async function getMovie(req, resp) {
    var { title } = req.params;
    var data = await Movie.findOne({ title: title });
    return resp.json(data);
}

async function getQuery(req, resp) {
    var query = req.query;
    query = await Movie.find(query);
    return resp.json(query);
}

//POST
async function addMovie(req, resp) {
    var { title, duration, categories, type } = req.body;

    if (!title || !duration) {
        return resp.status(400).json({ ERRO_RUS: "Add title and duration" });
    };

    var added = await Movie.create({
        title, duration, categories, type
    });

    return resp.json(added);
}

//DELETE
async function delMovie(req, resp) {
    var { id } = req.params;
    var del = await Movie.findByIdAndDelete({ _id: id });
    return resp.json(del);
}

async function deleteMovie(req, resp) {
    var query = req.query;
    query = await Movie.findOneAndDelete(query);
    return resp.json(query);
};

//UPDATE
async function updateMovie(req, resp) {
    var { id } = req.params;
    var { data } = req.body;
    var res = await Movie.findByIdAndUpdate(id, { $set: data }, { new: true });
    return resp.json(res);
}

//GETS
routes.get('/movies', getAll);
routes.get('/movies/movie/:title', getMovie);
routes.get('/admin/movies', getQuery);

//POST
routes.post('/admin/movies/add', addMovie);

//DELETE
routes.get('/admin/movies/delete', deleteMovie);
routes.delete('/admin/movies/delete/:id', delMovie);

//UPDATE
routes.put('/admin/movies/update/:id', updateMovie);

app.use(cors());
app.use(express.json());
app.use(routes);

app.listen(process.env.PORT, function () {
    console.log('Server is load');
});