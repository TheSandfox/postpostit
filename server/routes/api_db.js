const express = require('express');
const router = express.Router()
const db = require('./db');


router.get('/test',(req,res)=>{
	res.send('Hello World!');
})

router.get('/get',(req,res)=>{
	const postsPerPage = 50;
	let page = req.query.page;
	db.getPosts(page,postsPerPage,(posts)=>{
		res.send(JSON.parse(JSON.stringify(posts)));
	})
})

router.get('/create',(req,res)=>{
	db.createPost(
		req.query.content,
		()=>{
			console.log('post has been created')
			res.send('포스트 추가 완료!')
		}
	)
})

router.get('/clear',(req,res)=>{
	db.clearPosts(
		()=>{
			res.send('삭제해버렸구만..')
		}
	)
})

module.exports = router;