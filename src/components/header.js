import { UserSession } from "../services/UserSession.js";

export function createHeader() {
  // header 없으면 생성
  let existHeader = document.querySelector("header");
  if (existHeader) return;

  // DOM 생성
  // header-container
  const $header = document.createElement("header");
  document.body.prepend($header);

  $header.innerHTML = `
    <div class="header-container container">
      <h1 class="header-h1">
        <a href="#">
          <img class="header-logo" src="./assets/images/Logo-hodu.png" alt="호두샵 로고" />
          <span class="sr-only">HODU</span>
        </a>
      </h1>
      <form class="form-search" action="/search" method="get">
        <a class="search-logo-wrap" href="#"><img class="search-logo" src="./assets/images/Logo-hodu-sm.png" alt="호두샵 로고" /></a>
        <label class="sr-only" for="search">검색</label>
        <input id="search" type="text" placeholder="상품을 검색해보세요!" />
        <button type="submit"></button>
      </form>
      <ul class="actions-list">
        <div class="dropdown-mypage">
          <a class="dropdown-item" href="./mypage.html">마이페이지</a>
          <button class="dropdown-item" id="btn-logout">로그아웃</button>
        </div>
      </ul>
    </div>
  `;

  // 로그인별 actions-list 수정
  // Session
  const loginSession = new UserSession(localStorage);
  const isLoggedIn = loginSession.isAuthed();
  const isBuyer = loginSession.isBuyer();

  // actions-list
  const $actionsList = $header.querySelector(".actions-list");
  const actions = [
    {
      href: "#",
      img: "./assets/images/icons/icon-shopping-cart.svg",
      alt: "장바구니 바로가기",
      text: "장바구니",
      id: "action-cart",
    },
    // 기본 > 로그인 / 로그인 되었을 때 > 마이페이지
    isLoggedIn
      ? {
          href: "#",
          img: "./assets/images/icons/icon-user.svg",
          alt: "마이페이지 바로가기",
          text: "마이페이지",
          id: "action-mypage",
        }
      : {
          href: "./login.html",
          img: "./assets/images/icons/icon-user.svg",
          alt: "로그인 바로가기",
          text: "로그인",
          id: "action-login",
        },
  ];

  actions.forEach((action) => {
    const li = document.createElement("li");
    const a = document.createElement("a");
    a.href = action.href;
    a.id = action.id;

    const img = document.createElement("img");
    img.src = action.img;
    img.alt = action.alt;

    const p = document.createElement("p");
    p.textContent = action.text;

    a.append(img, p);
    li.appendChild(a);
    $actionsList.appendChild(li);
  });

  const $mypageDropdown = document.querySelector(".dropdown-mypage");
  const $mypageBtn = document.getElementById("action-mypage");
  if ($mypageBtn) {
    $mypageBtn.addEventListener("click", () => {
      $mypageDropdown.classList.add("active");
    });
  }

  document.addEventListener("click", (e) => {
    if (
      e.target.closest("#action-mypage") ||
      e.target.closest(".dropdown-mypage")
    )
      return;

    $mypageDropdown.classList.remove("active");
  });

  return $header;
}
