require("dotenv").config();
const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static("public"));

// 🧠 선생님 이름과 교무실 위치 데이터
const teacherRooms = {
  "김철수": "2층 과학실 옆 교무실",
  "이영희": "3층 영어과 교무실",
  "박민준": "1층 수학과 교무실",
  // 여기에 더 추가 가능
};

app.post("/api/chat", async (req, res) => {
  const userMessage = req.body.message;

  // ① 사용자 메시지에서 선생님 이름 찾기
  for (const [name, room] of Object.entries(teacherRooms)) {
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
