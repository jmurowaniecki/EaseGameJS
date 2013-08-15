var express  = require('express'),
	http     = require('http'),
	fs       = require('fs'),
	app      = express(),
	server   = false,
	mongoose = require('mongoose'),
	db       = mongoose.createConnection('localhost', 'jeff_game_01'),
	Schema   = mongoose.Schema,
	ObjectId = mongoose.Schema.Types.ObjectId,
	io       = require('socket.io').listen(8800);

app.configure(function () {
	app.set('port', 1139);
});

mongoose.connect('mongodb://localhost/jeff_game_01');
mongoose.connection.on('open', function () {
	console.log('db aberto');
});

var PlayerSchema = new Schema({
	name: String,
    	games: [{
		type: Schema.ObjectId,
    		ref: 'Game'
    	}],
   	messages: [{
		type: Schema.ObjectId,
    		ref: 'Message'
    	}]
    }), Player = mongoose.model('Player', PlayerSchema);

var MessageSchema = new Schema({
	from: {
		type: ObjectId,
		ref: 'Player'
	      },
    	to: {
		type: ObjectId,
    		ref: 'Player'
	    },
    	message: String,
    	status: Number /*
			  0	Not readed
			  1	Readed
			  -1	Removed
	*/
    }), Message = mongoose.model('Message', MessageSchema);

var GameSchema = new Schema({
	created: {
		type: Date,
    		default: Date.now
		 },
    	updated: {
		type: Date
		 },
    	moves: [{
		type: String
	       }],
    	players: [{
		type: ObjectId,
    		ref: 'Player'
		 }],
    	winner: {
		type: ObjectId,
    		ref: 'Player'
		},
    	status: Number /*
			  0	Created
			  1	Started
			  2	Finished
			  -1	Aborted
	*/
    }),	Game = mongoose.model('Game', GameSchema);

app.get('/', function (req, res) {
	fs.readFile(__dirname + '/index.html', function (err, data) {
		if (err) {
			res.writeHead(500);
			return res.end('Erro ao carregar front-end');
		}
		res.writeHead(200);

		Game.find({}, null, { sort: { 'updated': -1 }}).populate('player').populate('winner').limit(100).exec(function (err, Games) {
			return res.end(parseTextWithObject(data, { games: Games	}));
		});
	});
});

function parseTextWithObject (text, object) {
	for (i in object) {
		text = text.toString().replace('{{' + i + '}}', object[i]);
	}
	return text;
}
