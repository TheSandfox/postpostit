import axios from "axios";
import { useEffect, useRef, useState } from "react";

import 'css/index.css';
import Post from 'component/Post';
import PostPostItInput from 'component/PostPostItInput';

const THRESHOLD = 50;

function shuffle(array) {
	for (let i = array.length - 1; i > 0; i--) {
	  const j = Math.floor(Math.random() * (i + 1));
  
	  [array[i], array[j]] = [array[j], array[i]];
	}
	return array;
}

function PostPostItRefresh({refresh}){
	return <div className="postPostItRefresh" onClick={()=>{refresh([])}}>
		새로고침
	</div>
}

export default function PostPostIt({max}) {
	const popInterval = 0.025;
	const initial = useRef(true);
	const maxOrder = useRef(1);
	const [windowSize,setWindowSize] = useState([
		/*new*/[
			window.innerWidth,
			window.innerHeight
		],
		/*old*/[
			window.innerWidth,
			window.innerHeight
		]
	])
	const windowSizeRef = useRef([window.innerWidth,window.innerHeight]);
	const [posts,setPosts] = useState([]);
	const [additionalPosts,setAdditionalPosts] = useState([]);
	const additionalPostsRef = useRef([]);
	const [newPostRefresher,newPostRefresh] = useState([]);
	const [refresher,refresh] = useState([]);
	//
	const refreshPosts = useRef(()=>{
		setPosts([]);
		refresh([]);
	})
	//포스트잇들 가져오기(최초에&리프레시버튼 입력시)
	useEffect(()=>{
		//추가포스트 비워주기
		setAdditionalPosts([]);
		additionalPostsRef.current = [];
		//랜덤포스트 가져오기 요청
		async function getPosts(page) {
			await axios.get('http://localhost:3001/api/get',{params:{page:page,threshold:THRESHOLD}})
			.then((res)=>{
				shuffle(res.data);
				setPosts(JSON.parse(JSON.stringify(res.data)));
			})
			.catch()
		}
		getPosts(parseInt(Math.random()*parseInt(max/THRESHOLD)));
		//클린업
		return ()=>{}
	},[max,refresher]);
	//인풋 엔터 시 리스트갱신
	useEffect(()=>{
		if (initial.current) {
			initial.current = false
		} else {
			async function getNewPost() {
				await axios.get('http://localhost:3001/api/getNew')
				.then((res)=>{
					additionalPostsRef.current.push(res.data[0]);
					// console.log(res.data[0]);
					// console.log(JSON.parse(JSON.stringify(additionalPostsRef.current)));
					setAdditionalPosts(JSON.parse(JSON.stringify(additionalPostsRef.current)));
					// setAdditionalPosts(JSON.parse(JSON.stringify(additionalPosts.push(res.data[0]))))
				})
				.catch();
			}
			getNewPost();
		}
		return ()=>{}
	},[newPostRefresher])
	//리사이즈 콜백
	useEffect(()=>{

		const resizeCallback = (event)=>{
			setWindowSize([
				/*new*/[
					window.innerWidth,
					window.innerHeight
				],
				/*old*/[
					windowSizeRef.current[0],
					windowSizeRef.current[1],
				]
			])
			windowSizeRef.current = [
				window.innerWidth,
				window.innerHeight
			]
			// console.log(windowSize);
		}

		window.addEventListener('resize',resizeCallback);

		return ()=> {
			window.removeEventListener('resize',resizeCallback);
		}
	},[])
	return <div className="postPostIt fontBitBit">
		<h1 className="postPostItHeader">Post Post It!</h1>
		{posts.map((post,index)=>{
			return <Post 
				post={post} 
				key={index} 
				delay={index*popInterval+popInterval} 
				maxOrder={maxOrder}
				windowSize={windowSize}
			/>
		})}
		{additionalPosts.map((post,index)=>{
			return <Post
				post={post}
				key={'a'+index} 
				delay={popInterval} 
				maxOrder={maxOrder}
				windowSize={windowSize}
			/>
		})}
		<PostPostItInput
			newPostRefresh={newPostRefresh}
		/>
		<PostPostItRefresh
			refresh={refreshPosts.current}
		/>
	</div>;
}