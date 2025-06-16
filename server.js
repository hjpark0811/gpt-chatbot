require("dotenv").config();
const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static("public"));

// 🧠 선생님 이름과 교무실 위치 데이
const teacherLocations = {
  "백승옥": "학생안전인권부(4층)",
  "김소라": "학생안전인권부(4층)",
  "이봉희": "교육연구부(2층)",
  "최진철": "3학년부(5층)",
  "김정현": "수리과학교육부(2층)",
  "장용남": "진로상담부(4층)",
  "한우리": "3학년부(5층)",
  "이미령": "3학년부(5층)",
  "박정원": "3학년부(5층)",
  "방민영": "2학년부(4층)",
  "서경환": "1학년부(1층)",
  "조일환": "교육연구부(2층)",
  "유지수": "3학년부(5층)",
  "윤선희": "1학년부(1층)",
  "최원태": "3학년부(5층)",
  "김혁": "문화예술체육교육부(3층)",
  "서현군": "학생안전인권부(4층)",
  "이슬희": "3학년부(5층)",
  "홍지현": "3학년부(5층)",
  "한선희": "고무기획부(2층)",
  "이인삼": "미래교육부(3층)",
  "강지원": "3학년부(5층)",
  "한가연": "고무기획부(2층)",
  "조현선": "3학년부(5층)",
  "이경준": "수리과학교육부(2층)",
  "진현준": "1학년부(1층)",
  "장선희": "수석교사실(3층)",
  "권순아": "고무기획부(2층)",
  "윤효정": "2학년부(4층)",
  "이용순": "2학년부(4층)",
  "성용연": "1학년부(1층)",
  "박종배": "문화예술체육교육부(3층)",
  "손기민": "교육연구부(2층)",
  "장탁홍": "학생안전인권부(4층)",
  "한혜중": "3학년부(5층)",
  "김현진": "3학년부(5층)",
  "최민경": "고무기획부(2층)",
  "유민지": "고무기획부(2층)",
};

app.post("/api/chat", async (req, res) => {
  const userMessage = req.body.message;

  // ① 사용자 메시지에서 선생님 이름 찾기
  for (const [name, room] of Object.entries(teacherLocations)) {
    if (userMessage.includes(name)) {
      return res.json({ reply: `${name} 선생님의 교무실은 ${room}입니다.` });
    }
  }

  // ② GPT에게 질문 넘기기 (선생님이 명단에 없을 경우)
  try {
    const response = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "너는 학교 교무실 위치를 안내하는 챗봇이야. 모르는 정보는 정중하게 모른다고 대답해.",
          },
          {
            role: "user",
            content: userMessage,
          },
        ],
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        },
      }
    );

    const reply = response.data.choices[0].message.content;
    res.json({ reply });
  } catch (error) {
    console.error("GPT 호출 오류:", error.response?.data || error.message);
    res.status(500).json({ error: "GPT 응답 실패" });
  }
});

app.listen(PORT, () => {
  console.log(`✅ 서버 실행 중: http://localhost:${PORT}`);
});
