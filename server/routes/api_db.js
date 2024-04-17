const express = require('express');
const router = express.Router()
const db = require('./db');


router.get('/test',(req,res)=>{
	res.send('Hello World!');
})

router.get('/get',(req,res)=>{
	let page = req.query.page;
	let threshold = req.query.threshold;
	db.getPosts(page,threshold,(posts)=>{
		res.send(JSON.parse(JSON.stringify(posts)));
	})
})

router.get('/getNew',(req,res)=>{
	db.getNewPost((post)=>{
		res.send(JSON.parse(JSON.stringify(post)));
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

// router.get('/clear',(req,res)=>{
// 	db.clearPosts(
// 		()=>{
// 			res.send('삭제해버렸구만..')
// 		}
// 	)
// })

router.get('/count',(req,res)=>{
	db.countPosts(
		(val)=>{
			res.send(String(val)+'개')
		}
	)
})

module.exports = router;