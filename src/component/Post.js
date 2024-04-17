import { useEffect, useRef } from "react";

const POST_COLORS = [
	'#fc0',
	'#96ff4f',
	'#ff4fff',
	'#8ae7e4',
];

function isTouchDevice() {
	return 'ontouchstart' in window || navigator.maxTouchPoints;
}

function setElementPosition(element,x,y) {
	element.style.transform = `translate(${x}px,${y}px)`;
	// element.style.left = `${x}px`;
	// element.style.top = `${y}px`;
}

export default function Post({post,delay,maxOrder,windowSize}) {
	const width = 256;
	const position = useRef([
		Math.random()*(windowSize[0][0]-width),
		Math.random()*(windowSize[0][1]-width)
	]);
	const touchPosition = useRef([0,0]);
	const selected = useRef(false);
	
	const element = useRef();
	const style = {
		width:`${width}px`,
	}
	const getMaxOrder = useRef(()=>maxOrder.current);
	const addMaxOrder = useRef(()=>maxOrder.current=maxOrder.current+1);
	//최초 마운트 시 타임아웃으로 스케일링, 초기 포지션 설정
	useEffect(()=>{
		let el = element.current;
		let timer = setTimeout(()=>{
			el.classList.add('active');
		},parseInt(delay*1000.0));

		el.style.backgroundColor = POST_COLORS[parseInt(Math.random()*POST_COLORS.length)];
		setElementPosition(el,position.current[0],position.current[1]);

		return ()=>{
			el.classList.remove('active');
			clearTimeout(timer);
		}
	},[delay]);
	//마우스 다운, 무브, 업
	useEffect(()=>{

		let el = element.current;
		el.style.zIndex = getMaxOrder.current();

		//다운
		const mouseDownCallback = (event)=>{
			if (isTouchDevice()) {
				if (event.type!=='mousedown'&&event.touches.length<2) {
					//터치스타트
					touchPosition.current = [
						event.touches[0].clientX,
						event.touches[0].clientY
					]
				} else {
					return;
				}
			} else {
				//마우스클릭
				if (event.button!==0) {
					return;
				}
			}
			// console.log("AAAA");
			el.style.zIndex = getMaxOrder.current();
			addMaxOrder.current();
			selected.current = true;
		}
		//무브
		const mouseMoveCallback = (event)=>{
			if (!selected.current) {
				return;
			}
			let xvec = 0;
			let yvec = 0;
			if (isTouchDevice()) {
				//터치무브
				xvec = event.touches[0].clientX - touchPosition.current[0];
				yvec = event.touches[0].clientY - touchPosition.current[1]; 
				touchPosition.current = [
					event.touches[0].clientX,
					event.touches[0].clientY
				]
			} else {
				//마우스무브
				event.preventDefault();
				xvec = event.movementX;
				yvec = event.movementY;
			}
			position.current = [
				position.current[0] + xvec,
				position.current[1] + yvec
			]
			// console.log(`translate(${position.current[0]}px,${position.current[1]}px)`);
			setElementPosition(el,position.current[0],position.current[1]);
		}
		//업
		const mouseUpCallback = (event) => {
			if (isTouchDevice()) {
				if (event.type!=='mouseup') {

				} else {
					return;
				}
			} else {
				if (event.button!==0) {return;}
			}
			selected.current = false;
		}

		el.addEventListener('mousedown',mouseDownCallback);
		el.addEventListener('touchstart',mouseDownCallback);
		window.addEventListener('mousemove',mouseMoveCallback);
		window.addEventListener('touchmove',mouseMoveCallback);
		window.addEventListener('mouseup',mouseUpCallback);
		window.addEventListener('touchend',mouseUpCallback);

		return ()=>{
			el.removeEventListener('mousedown',mouseDownCallback);
			el.removeEventListener('touchstart',mouseDownCallback);
			window.removeEventListener('mousemove',mouseMoveCallback);
			window.removeEventListener('touchmove',mouseMoveCallback);
			window.removeEventListener('mouseup',mouseUpCallback);
			window.removeEventListener('touchend',mouseUpCallback);
		}
	},[]);
	//윈도우 리사이즈 시 리포지셔닝
	useEffect(()=>{

		let el = element.current;
		let xpos = position.current[0] / windowSize[1][0];
		let ypos = position.current[1] / windowSize[1][1];

		position.current = [
			xpos * windowSize[0][0],
			ypos * windowSize[0][1]
		]
		
		setElementPosition(el,position.current[0],position.current[1]);

	},[windowSize]);
	//return jsx
	return <div ref={element} className={`post dotbox`} 
		style={style}
	>
		<pre className="content fontBitBit">
			{post.content}
		</pre>
		<div className="date">
			{post.date}
		</div>
	</div>
}