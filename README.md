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
- **Helmet / HPP / csrf-csrf** – 보안 미들웨어 (CSRF는 Double Submit Cookie 패턴)
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
├── migrations/       # Sequelize CLI 마이그레이션 (스키마는 sync가 아닌 마이그레이션으로 관리)
├── middlewares/       # 인증, CSRF 등 공통 미들웨어
├── passport/         # Passport 전략 (local, kakao)
├── utils/            # 순수 함수 유틸 (해시태그 링크 변환 등)
├── views/            # Nunjucks 템플릿
├── public/           # 정적 파일 (CSS, 클라이언트 JS)
└── docker-compose.yml # 로컬 개발용 MySQL/Redis 컨테이너
```

---

## 🚀 실행 방법

### 1. 의존성 설치

```bash
npm install
```

### 2. 로컬 DB/Redis 준비 (Docker)

MySQL과 Redis가 로컬에 없다면 [Docker Desktop](https://www.docker.com/products/docker-desktop/)을 설치한 뒤 아래 명령으로 띄울 수 있습니다.

```bash
docker compose up -d
```

### 3. 환경 변수 설정

프로젝트 루트에 `.env` 파일을 만들고 아래 값을 채워주세요. (`docker-compose.yml` 기본값 기준)

```
NODE_ENV=development
PORT=8001
SEQUELIZE_PASSWORD=nodebird
SEQUELIZE_PORT=3307
REDIS_HOST=localhost
REDIS_PORT=6379
COOKIE_SECRET=아무-비밀-문자열
KAKAO_ID=dummy   # 실제 카카오 로그인을 쓰려면 REST API 키로 교체 (비워두면 서버가 기동되지 않습니다)
```

이미 로컬에 MySQL이 설치되어 3306 포트를 쓰고 있다면 `docker-compose.yml`의 MySQL 포트 매핑과 `SEQUELIZE_PORT`를 다른 값으로 바꿔주세요.

### 4. DB 마이그레이션

스키마는 `sequelize.sync()`가 아니라 `migrations/`의 마이그레이션 파일로 관리합니다. DB를 처음 준비할 때(또는 초기화했을 때) 한 번 실행해주세요.

```bash
npm run db:migrate
```

### 5. 실행

```bash
npm run dev   # 개발 모드 (nodemon)
npm start     # 운영 모드 (pm2)
npm test      # 테스트 실행 (jest)
```
