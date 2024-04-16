var mysql      = require('mysql2');
var connection = mysql.createConnection({
	host		: 'localhost',
	user		: 'root',
	password	: '123456',
	database	: 'postpostit',//schema이름임.
	dateStrings	: 'date'
});

function getPosts(page,postsPerPage,callback) {
	connection.query(
		`
		SELECT * FROM post LIMIT ${postsPerPage*page},${postsPerPage}
		`
		,(err,posts)=>{
			if(err) throw err;
			callback(posts);
		}
	)
}

function createPost(content,callback) {
	connection.query(
		`
		INSERT INTO post(content,date) VALUES('${content}',NOW())
		`
		,(err)=>{
			if(err) throw err;
			callback();
		}
	)
}

function clearPosts(callback) {
	connection.query(
		`
		TRUNCATE TABLE post
		`
		,(err)=>{
			if(err) throw err;
			callback();
		}
	)
}

module.exports = {
	getPosts,
	createPost,
	clearPosts
}
