import axios from "axios";
import { useRef } from "react";

export default function PostPostItInput({newPostRefresh}) {

	const enterCallback = useRef(
		(event)=>{
			let inputVal = '';
			if (event.keyCode!==13) {return;}
			if (event.isShift) {return;}
			inputVal = event.target.value.trim();
			console.log(inputVal);
			event.target.value = '';
			if (!inputVal) {return;}
			async function createPost(content) {
				await axios.get('http://localhost:3001/api/create',{params:{content:content}})
				.then(()=>{
					newPostRefresh([]);
				})
				.catch()
			}
			createPost(inputVal);
		}
	);

	return <div className="postPostItInput dotbox">
		<input className="input fontBitBit" type="text" onKeyDown={enterCallback.current}></input>
	</div>;
}