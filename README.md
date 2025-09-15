# open-market-service
## 호두샵(Open Market Service)

팀 프로젝트로 구현한 오픈마켓 서비스의 프론트엔드 레포지토리입니다. <br>
순수 HTML/CSS/JavaScript로 SPA가 아닌 멀티 페이지 구조로 제작했으며, <br>
공용 컴포넌트(`header`, `footer`, `modal`)와 페이지별 스크립트를 분리하여 유지보수성을 높였습니다. <br>
외부 공개 API를 사용해 상품 목록/상세/장바구니/회원 기능을 동작시키고, 판매자 권한으로 상품 등록과 대시보드를 제공합니다.

### 팀 구성 및 역할

- **예슬**: 로그인, 회원가입 + 판매자 상품 등록 기능 및 UI 구현
- **여훈**: 상품 상세 페이지 + 모달창 + 장바구니 기능 및 UI 구현
- **민주**: 메인 페이지(상품 목록), GNB(Header) + 판매자 대시보드 기능 및 UI, 공통 CSS 작업

### 데모 페이지 구조

- `index.html`: 메인(상품 목록 + 배너)
- `login.html`: 로그인
- `signup.html`: 회원가입(구매자/판매자 탭)
- `product-detail.html`: 상품 상세/수량 선택/장바구니 담기
- `cart.html`: 장바구니 목록/수량 증감/선택체크
- `make-product.html`: 판매자 상품 등록(이미지 미리보기 포함)
- `seller-center.html`: 판매자 대시보드(판매 상품 목록/탭/삭제 모달)
- `modal.html`: 공용 모달 템플릿
- `404.html`: 에러 페이지

### 기술 스택

- HTML5, CSS3 (모듈화된 공통 스타일: `src/styles/reset.css`, `variables.css`, `main.css`)
- Vanilla JavaScript (ES Modules)
- REST API 연동: `https://api.wenivops.co.kr/services/open-market`

### 디렉토리 구조

```text
/assets           정적 리소스(폰트, 이미지)
/src/components   공용 컴포넌트(header, footer, modal)
/src/pages        페이지별 CSS/JS
/src/services     세션 및 인증 유틸(UserSession)
/src/styles       공통 CSS(리셋/변수/메인)
/*.html           라우트별 정적 페이지
```

### 주요 기능 요약

- **인증/회원**

  - 로그인(`src/pages/login/login.js`): 역할 탭(구매자/판매자) 선택 후 로그인, 결과의 `user_type` 검증, 성공 시 세션 저장 및 리다이렉트
  - 회원가입(`src/pages/signup/signup.js`): 아이디 중복확인, 비밀번호 규칙/재확인, 휴대폰 유효성, 약관 동의; 판매자 탭에서 사업자등록번호 인증 및 스토어명 입력 후 가입
  - 세션 관리(`src/services/UserSession.js`): 토큰/유저정보 저장, 만료 검증, 자동 토큰 재발급 및 만료 시 로그아웃 처리

- **상품/구매 플로우**

  - 메인 목록(`src/pages/index/index.js`): 상품 리스트 최신순 렌더링, 이미지 에러 대비, 커스텀 배너 스와이퍼/페이지네이션/반응형 리사이즈 처리
  - 상세 페이지(`src/pages/product-detail/product-detail.js`): 상세 정보/수량 증감/총액 계산/품절 처리/판매자 접근 시 버튼 비활성; 로그인 필요 시 공용 모달로 로그인 유도; 장바구니 담기 API 연동
  - 장바구니(`src/pages/cart/cart.js`): 서버 장바구니 목록 렌더링, 수량 증감에 따른 합계 업데이트(개별 행), 전체선택/해제, 개별 주문하기, 장바구니 삭제 API 연동

- **판매자 기능**

  - 상품 등록(`src/pages/make-product/make-product.js`): 권한 체크(판매자만), 폼 유효성 검사, 가격/배송비/재고 정수 포맷팅, 이미지 미리보기, FormData로 등록 API 호출
  - 대시보드(`src/pages/seller-center/seller-center.js`): 판매자 이름 기반 상품 목록 조회, 재고 상태 UI, 탭 인터랙션, 삭제 시 공용 모달 사용

- **공용 UI/UX**
  - 헤더/GNB(`src/components/header.js`): 로그인 상태/역할에 따라 액션 버튼 동적 구성(장바구니/마이페이지/판매자 센터), 비로그인 장바구니 접근 시 모달 안내, 드롭다운 위치 보정
  - 모달(`src/components/modal.js` + `modal.html`): 모달 템플릿 지연 로드, 외부/ESC/버튼 이벤트 처리, 콜백 실행 지원
  - 푸터(`src/components/footer.js`): 공용 푸터 로드

### API 기본 정보

- Base URL: `https://api.wenivops.co.kr/services/open-market`
- 주요 엔드포인트 예시
  - `GET /products` 목록, `GET /products/{id}` 상세
  - `POST /cart/` 담기, `GET /cart/` 조회, `DELETE /cart/{id}/` 삭제
  - `POST /accounts/login/` 로그인, `POST /accounts/{buyer|seller}/signup/` 회원가입
  - `POST /accounts/validate-username/` 아이디 중복 확인, `POST /accounts/seller/validate-registration-number/` 사업자등록번호 검증

### 실행 방법(로컬)

정적 사이트이므로 간단한 정적 서버로 열 수 있습니다.

1. VS Code 확장 Live Server 사용

- `index.html`에서 “Open with Live Server” 실행

2. Node http-server 사용(예시)

```bash
npm i -g http-server
http-server -p 5173 .
# 브라우저에서 http://localhost:5173 접속
```

주의: 일부 브라우저는 `file://` 스킴 접근 시 `fetch`가 차단될 수 있으므로 반드시 로컬 서버를 사용하세요.

### 인증/권한 테스트 팁

- 판매자 전용 페이지(`make-product.html`, `seller-center.html`)는 로그인 및 역할 검사를 통과해야 접근 가능합니다.
- 비로그인 사용자가 장바구니 또는 구매 액션을 시도하면 모달로 로그인 유도 후 로그인 페이지로 이동합니다.

### 접근성/성능 고려 사항

- 이미지 `loading="lazy"` 적용, `onerror`로 대체 이미지 처리
- 배너 스와이퍼는 클론 슬라이드로 루프 구현 및 리사이즈 시 트랜지션 비활성 처리로 깜빡임 최소화
- 키보드 ESC/외부 클릭으로 모달 닫힘 지원, 스크린 리더 대체 텍스트 제공

### 라이선스

이 레포지토리는 교육 목적의 팀 프로젝트 결과물로, 별도의 라이선스를 명시하지 않았습니다. 학습 및 포트폴리오 용도로 활용 가능합니다.
