import 'css/index.css';
import axios from 'axios';

import PostPostIt from 'component/PostPostIt';

function App() {
	let max = 0;
	async function countPosts() {
		await axios.get('http://localhost:3001/api/count')
		.then((res)=>{
			max = res[0];
		})
		.catch()
	}
	countPosts();
 	return <PostPostIt max={max}/>;
}

export default App;
