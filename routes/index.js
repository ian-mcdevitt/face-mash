var express = require('express');
var router = express.Router();
var Celeb = require("../models/celeb");
var fs = require("fs");
var path = require("path");

/* GET home page. */
router.get('/', function(req, res, next) {

	Celeb.find()
		.exec(function(err, celebs){


			let index1 = Math.floor((Math.random() * celebs.length));
			let index2 = Math.floor((Math.random() * celebs.length));
			while (index1 == index2){
				index2 = Math.floor((Math.random() * celebs.length));
			}

			res.render('index', {celeb1: celebs[index1], celeb2: celebs[index2]});

		});
});

router.get('/rankings', function(req, res, next){

	Celeb.find()
		.exec(function(err, celebs){
			celebs.sort(function (a, b) { return b.score - a.score });
			console.log(celebs[0]);
			res.render('ranking', {celebs: celebs});			
		});
	
});

router.get('/img/:name', function(req, res, next) {
	let name = req.params.name;
	res.render('image', {name: "/images/"+req.params.name});
});

router.post("/api/update", function(req, res, next) {
	Celeb.findById(req.body.winner, function(err, winner){
		Celeb.findById(req.body.loser, function(err, loser){
			
			let Rw = winner.score;
			let Rl = loser.score;
			
			let Sw = 1;
			let Sl = 0;

			let Ew = 1 / (1 + Math.pow(10, (Rl - Rw) / 400))
			let El = 1 / (1 + Math.pow(10, (Rw - Rl) / 400))

			winner.score += 16 * (Sw - Ew)
			loser.score += 16 * (Sl - El)

			winner.save()
			loser.save()

			res.json("{ok: true}");

		});
	});

});

router.get("/output_scores", function(req, res, next){

	let out = "";
	Celeb.find()
		.exec(function(err, celebs) {
			celebs.sort(function(a, b){return b.score - a.score});
			celebs.forEach(function(celeb){
				out += "<p> -- " + celeb.name + " ==> " + celeb.score + "</p>";
			});
			res.send(out)
		});

});

/* 
RESETS DATA WITH FRESH SCORES BASED ON PICTURES IN ../PUBLIC/IMAGES
*/ 
router.get('/set_data', function(req, res, next) {

	Celeb.find({}, function(err, celebs){
		celebs.forEach(function(celeb){
			celeb.remove();
		});
	});

	startPath = path.join(__dirname, "../public/images/")
	filter = ".jpg"

	if (!fs.existsSync(startPath)) {
		console.log("no dir ", startPath);
		return;
	}

	var files = fs.readdirSync(startPath);
	for (var i = 0; i < files.length; i++) {
		if (files[i][0] == ".") continue;
		let name = files[i].substring(0, files[i].length-4)
		name = name.replace("_", " ");
		name = name.replace("_", " ");
		name = name.replace("_", " ");
		name = name.replace("_", " ");
		name = name.replace("_", " ");		
		let url = "/images/" + files[i];
		console.log("-- found: ", name, " @ ", url);

		let celeb = new Celeb({
			url: url,
			name: name,
			score: 1500
		});
		celeb.save(function(err, result){
			if (err){
				console.log(err);
			}
			else{
				console.log("Added!");
			}
		});

	};
	res.send("ok!");			

});


module.exports = router;
