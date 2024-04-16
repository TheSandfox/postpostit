// express 모듈 호출
const express = require('express');
const cors = require('cors');
const app = express();
const api = require('./routes/api_db');
const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use(cors({
		origin: "*", // 출처 허용 옵션
		credential: true, // 사용자 인증이 필요한 리소스(쿠키 ..등) 접근
  })
)
//
app.use(express.urlencoded({extended:false}));
app.use('/api',api);
 
app.listen(PORT, () => {
    console.log(`Server run : http://localhost:${PORT}/`)
})