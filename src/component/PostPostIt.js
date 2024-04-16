import Axios from "axios";
import { useEffect, useRef, useState } from "react";

import 'css/index.css';

function Post({post,delay}) {
	const element = useRef();
	const width = 256;
	const height = 256;
	const style = {
		width:`${width}px`,
		height:`${height}px`,
		left:`calc(${Math.random()*80}vw - 10vw)`,
		top:`calc(${Math.random()*80}vh - 10vh)`,
	}
	useEffect(()=>{
		let timer = setTimeout(()=>{
			element.current.classList.add('active');
		},parseInt(delay*1000.0));

		return ()=>{
			element.current.classList.remove('active');
			clearTimeout(timer)
		}
	},[])
	return <div ref={element} className={`post dotbox fontBitBit`} 
		style={style}
	>
		<div className="title">
			{post.content}
		</div>
		<div className="date">
			{post.date}
		</div>
	</div>
}

export default function PostPostIt() {
	const popInterval = 0.125;
	const [posts,setPosts] = useState([]);
	useEffect(()=>{
		async function getPosts(page) {
			await Axios.get('http://localhost:3001/api/get',{params:{page:page}})
			.then((res)=>{
				setPosts(res);
				// console.log(res);
			})
			.catch()
		}
		getPosts(0);
		return ()=>{}
	},[])
	return <div className="postPostIt">
		{posts.data&&posts.data.map((post,index)=>{
			return <Post post={post} key={index} delay={index*popInterval+popInterval}/>
		})
	}</div>;
}