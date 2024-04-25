/*eslint-disable*/
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

function PostPostItRefresh({postRefresh}){
	return <div className="postPostItRefresh" onClick={()=>{postRefresh([])}}>
		새로고침
	</div>
}

export default function PostPostIt({max}) {
	const popInterval = 0.025;
	const initial = useRef(true);
	const maxOrder = useRef(1);
	//
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
	//
	const [posts,setPosts] = useState([]);
	const [additionalPosts,setAdditionalPosts] = useState([]);
	const [newPostRefresher,newPostRefresh] = useState([]);
	const [postRefresher,postRefresh] = useState([]);
	const [blurState,setBlurState] = useState([true]);
	const [blurStateRefresher,blurStateRefresh] = useState([]);
	//
	const handleBlurState = {
		get:()=>{
			return blurState[0];
		},
		set:(val)=>{
			let arr = [];
			arr.push(val);
			setBlurState(arr);
		}
	}
	//블러필터 비활성화
	const awakeBody = useRef(()=>{
		handleBlurState.set(false);
		blurStateRefresh([]);
	});
	//포스트잇들 가져오기(최초에&리프레시버튼 입력시)
	useEffect(()=>{
		//블러 비활성
		awakeBody.current();
		//포스트 비워주기
		setPosts([]);
		//추가포스트 비워주기
		setAdditionalPosts([]);
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
	},[max,postRefresher]);
	//인풋 엔터 시 리스트갱신
	useEffect(()=>{
		if (initial.current) {
			initial.current = false
		} else {
			async function getNewPost() {
				await axios.get('http://localhost:3001/api/getNew')
				.then((res)=>{
					setAdditionalPosts([
						...additionalPosts,
						res.data[0]
					])
				})
				.catch();
			}
			getNewPost();
			awakeBody.current();
		}
		return ()=>{}
	},[newPostRefresher])
	//리사이즈 콜백
	useEffect(()=>{

		const resizeCallback = (event)=>{
			console.log(windowSize[0][0])
			console.log(windowSize[0][1])
			console.log(windowSizeRef.current[0])
			console.log(windowSizeRef.current[1])
			let oldX = windowSize[0][0]
			let oldY = windowSize[0][1]
			setWindowSize([
				/*new*/[
					window.innerWidth,
					window.innerHeight
				],
				/*old*/[
					// windowSize[0][0],
					// windowSize[0][1]
					windowSizeRef.current[0],
					windowSizeRef.current[1],
					// oldX,
					// oldY
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
	//블러 타임아웃
	useEffect(()=>{
		// console.log('타이머작동');
		const timer = setTimeout(()=>{
			handleBlurState.set(true);
		},2500);
		return ()=>{
			clearTimeout(timer);
		}
	},[blurStateRefresher]);
	//리턴 컴포넌트
	return <div className="postPostIt fontBitBit">
		<h1 className="postPostItHeader">Post Post It!</h1>
		<div className={'postPostItBody '+(handleBlurState.get()?'blur':'')}>
			{posts.map((post,index)=>{
				return <Post 
					post={post} 
					key={post.id} 
					delay={index*popInterval+popInterval} 
					maxOrder={maxOrder}
					windowSize={windowSize}
					awakeBody={awakeBody.current}
				/>
			})}
			{additionalPosts.map((post,index)=>{
				return <Post
					post={post}
					key={'a'+post.id} 
					delay={popInterval} 
					maxOrder={maxOrder}
					windowSize={windowSize}
					awakeBody={awakeBody.current}
				/>
			})}
		</div>
		<PostPostItInput
			newPostRefresh={newPostRefresh}
		/>
		<PostPostItRefresh
			postRefresh={postRefresh}
			// refreshPosts.current();awakeBody.current()
		/>
	</div>;
}