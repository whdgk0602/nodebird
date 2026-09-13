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
├── docker-compose.yml # 로컬 개발용 MySQL/Redis 컨테이너
└── render.yaml       # Render 배포용 Blueprint
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

---

## ☁️ 무료 배포 (Render + Aiven + Upstash)

이 앱은 Nunjucks로 서버에서 화면을 직접 그리는 **단일 Express 앱**이라, 프론트/백엔드를 따로 배포하지 않고 **①앱 서버, ②MySQL, ③Redis** 3곳만 준비하면 됩니다. 아래는 카드 등록 없이 쓸 수 있는 무료 조합입니다.

| 구성 요소 | 서비스 | 비고 |
|---|---|---|
| 앱 서버 | [Render](https://render.com) Web Service (Free) | 512MB RAM, 월 750시간, 15분 미사용 시 슬립(첫 요청 30~60초 지연) |
| MySQL | [Aiven](https://aiven.io/free-mysql-database) | 카드 등록 없이 영구 무료, 1GB 저장공간 |
| Redis | [Upstash](https://upstash.com) | 월 50만 커맨드, 256MB |

### 1) Aiven MySQL 만들기

1. [Aiven](https://aiven.io/free-mysql-database)에 가입하고 무료 MySQL 서비스를 생성합니다.
2. 서비스 개요 페이지에서 **Host, Port, User, Password, Default database name**을 확인합니다.

### 2) Upstash Redis 만들기

1. [Upstash](https://upstash.com) 콘솔에서 Redis 데이터베이스를 생성합니다.
2. 데이터베이스 상세 페이지에서 TLS 연결 문자열(`rediss://default:비밀번호@호스트:포트` 형태)을 복사합니다.

### 3) 운영 DB에 마이그레이션 적용

로컬에서 운영 DB를 가리키도록 환경변수를 임시로 지정해 마이그레이션을 한 번 실행합니다. (Render 무료 플랜은 배포 전 커맨드를 지원하지 않아 수동으로 실행합니다.)

```bash
DB_HOST=<Aiven host> DB_PORT=<Aiven port> DB_USERNAME=<Aiven user> DB_PASSWORD=<Aiven password> DB_NAME=<Aiven db name> DB_SSL=true NODE_ENV=production npx sequelize db:migrate
```

### 4) Render에 배포

1. GitHub 저장소를 Render에 연결하면 저장소 루트의 `render.yaml`을 인식해 서비스가 자동 구성됩니다 ([Blueprint](https://render.com/docs/blueprint-spec) 방식).
2. Render 대시보드에서 아래 환경변수를 채워넣습니다 (`render.yaml`에 `sync: false`로 표시된 값들).

```
COOKIE_SECRET=충분히 긴 임의의 문자열
DB_HOST=<Aiven host>
DB_PORT=<Aiven port>
DB_USERNAME=<Aiven user>
DB_PASSWORD=<Aiven password>
DB_NAME=<Aiven db name>
REDIS_URL=<Upstash rediss:// 연결 문자열>
KAKAO_ID=dummy   # 실제 카카오 로그인을 쓰려면 REST API 키로 교체
```

3. 배포가 끝나면 Render가 준 `https://*.onrender.com` 주소로 접속해 동작을 확인합니다.

**참고**: `DB_SSL`은 `render.yaml`에 이미 `true`로 설정되어 있고, 기본적으로 Aiven의 인증서를 검증하지 않는 완화 모드(`rejectUnauthorized: false`)로 접속합니다. 트래픽은 여전히 TLS로 암호화되며, 학습용 소규모 프로젝트에는 충분한 수준입니다. 더 엄격한 인증서 검증이 필요하면 `DB_SSL_REJECT_UNAUTHORIZED=true`로 설정하고 Aiven이 제공하는 CA 인증서를 별도로 연결해야 합니다.
