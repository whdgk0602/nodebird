# 🐦 NodeBird - Node.js 교과서 실습 프로젝트

> 이 저장소는 **Node.js 교과서** 도서에 수록된 NodeBird 예제 코드를 기반으로 Node.js/Express 백엔드를 학습하기 위해 작성되었습니다.
> 책의 코드를 따라가며 직접 구현/수정한 내용을 담고 있습니다.

Node.js와 Express를 기반으로 만든 트위터 스타일의 SNS 웹 애플리케이션입니다.
유저는 글(포스트)을 작성하고, 해시태그로 게시글을 검색하고, 로컬/카카오 소셜 로그인으로 인증할 수 있습니다.

---

## ✨ 주요 기능

- 📝 **게시글(포스트) 작성**
- 🏷️ **해시태그 등록 및 해시태그별 게시글 검색**
- 🔐 **로컬 회원가입 / 로그인 (Passport Local)**
- 🔑 **카카오 소셜 로그인 (Passport Kakao)**
- 👤 **프로필 페이지**
- 🖼️ **이미지 업로드 (Multer)**
- 🛡️ **보안 미들웨어 적용 (Helmet, HPP, CSRF)**

---

## 🛠 사용 기술 스택

- **Node.js** + **Express**
- **MySQL** + **Sequelize / Sequelize CLI** – ORM 및 DB 마이그레이션
- **Nunjucks** – 템플릿 엔진
- **Passport** (`passport-local`, `passport-kakao`) – 인증 처리
- **bcrypt** – 비밀번호 암호화
- **Multer** – 이미지 업로드
- **express-session** + **connect-redis** – 세션 관리
- **Helmet / HPP / csurf** – 보안 미들웨어
- **Winston** + **Morgan** – 로깅
- **PM2** – 프로세스 매니저 (운영 환경 실행)
- **Jest** – 테스트

---

## 📂 프로젝트 구조

```
├── app.js            # Express 앱 설정
├── server.js         # 서버 실행 진입점
├── config/           # DB 등 설정
├── controllers/      # 라우트별 비즈니스 로직
├── routes/           # 라우터 정의
├── models/           # Sequelize 모델 (User, Post, Hashtag)
├── middlewares/       # 인증 등 공통 미들웨어
├── passport/         # Passport 전략 (local, kakao)
├── views/            # Nunjucks 템플릿
└── public/           # 정적 파일
```

---

## 🚀 실행 방법

```bash
npm install
npm run dev   # 개발 모드 (nodemon)
npm start     # 운영 모드 (pm2)
npm test      # 테스트 실행 (jest)
```

실행 전 `.env` 파일에 DB 접속 정보 및 카카오 로그인 키 등 환경 변수를 설정해야 합니다.
