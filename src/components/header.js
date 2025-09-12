import { UserSession } from "../services/UserSession.js";

//로그인별 actions-list
const actionCart = {
  href: "./cart.html",
  svgTag: `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32" fill="none">
  <path d="M12.889 28.4444C13.6254 28.4444 14.2223 27.8475 14.2223 27.1111C14.2223 26.3747 13.6254 25.7778 12.889 25.7778C12.1526 25.7778 11.5557 26.3747 11.5557 27.1111C11.5557 27.8475 12.1526 28.4444 12.889 28.4444Z" fill="black" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M25.3333 28.4444C26.0697 28.4444 26.6667 27.8475 26.6667 27.1111C26.6667 26.3747 26.0697 25.7778 25.3333 25.7778C24.597 25.7778 24 26.3747 24 27.1111C24 27.8475 24.597 28.4444 25.3333 28.4444Z" fill="black" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M2.66699 2.66669H7.51548L10.764 18.5359C10.8748 19.0816 11.1784 19.5717 11.6216 19.9205C12.0648 20.2694 12.6194 20.4547 13.1882 20.444H24.97C25.5389 20.4547 26.0934 20.2694 26.5366 19.9205C26.9798 19.5717 27.2834 19.0816 27.3943 18.5359L29.3337 8.59247H8.7276" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
  `,
  label: "장바구니 바로가기",
  text: "장바구니",
  id: "action-cart",
};

const actionLogin = {
  href: "./login.html",
  svgTag: `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32" fill="none">
  <path d="M26.6663 28V25.3333C26.6663 23.9188 26.1044 22.5623 25.1042 21.5621C24.104 20.5619 22.7475 20 21.333 20H10.6663C9.25185 20 7.8953 20.5619 6.8951 21.5621C5.89491 22.5623 5.33301 23.9188 5.33301 25.3333V28" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M16.0003 14.6667C18.9458 14.6667 21.3337 12.2789 21.3337 9.33333C21.3337 6.38781 18.9458 4 16.0003 4C13.0548 4 10.667 6.38781 10.667 9.33333C10.667 12.2789 13.0548 14.6667 16.0003 14.6667Z" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
  `,
  label: "로그인 바로가기",
  text: "로그인",
  id: "action-login",
};

const actionMypage = {
  href: "#",
  svgTag: `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32" fill="none">
  <path d="M26.6663 28V25.3333C26.6663 23.9188 26.1044 22.5623 25.1042 21.5621C24.104 20.5619 22.7475 20 21.333 20H10.6663C9.25185 20 7.8953 20.5619 6.8951 21.5621C5.89491 22.5623 5.33301 23.9188 5.33301 25.3333V28" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M16.0003 14.6667C18.9458 14.6667 21.3337 12.2789 21.3337 9.33333C21.3337 6.38781 18.9458 4 16.0003 4C13.0548 4 10.667 6.38781 10.667 9.33333C10.667 12.2789 13.0548 14.6667 16.0003 14.6667Z" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
  `,
  label: "마이페이지 바로가기",
  text: "마이페이지",
  id: "action-mypage",
  dropdown: `
      <div class="dropdown-mypage">
        <a class="dropdown-item" href="./mypage.html">마이페이지</a>
        <button class="dropdown-item" id="btn-logout">로그아웃</button>
      </div>
      `,
};

const actionSeller = {
  href: "./seller-center.html",
  svgTag: `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32" fill="none">
  <path d="M8 2.66669L4 8.00002V26.6667C4 27.3739 4.28095 28.0522 4.78105 28.5523C5.28115 29.0524 5.95942 29.3334 6.66667 29.3334H25.3333C26.0406 29.3334 26.7189 29.0524 27.219 28.5523C27.719 28.0522 28 27.3739 28 26.6667V8.00002L24 2.66669H8Z" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M4 8H28" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M21.3337 13.3333C21.3337 14.7478 20.7718 16.1044 19.7716 17.1045C18.7714 18.1047 17.4148 18.6666 16.0003 18.6666C14.5858 18.6666 13.2293 18.1047 12.2291 17.1045C11.2289 16.1044 10.667 14.7478 10.667 13.3333" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`,
  label: "판매자 센터 바로가기",
  text: "판매자 센터",
  id: "action-seller",
};

const actionsDefault = [actionCart, actionLogin];
const actionsLoggedIn = [actionCart, actionMypage];
const actionsLoggedInSeller = [actionMypage, actionSeller];

export function createHeader() {
  // Session
  const loginSession = new UserSession(localStorage);
  const isLoggedIn = loginSession.isAuthed();
  const isBuyer = loginSession.isBuyer();
  const isSeller = loginSession.isSeller();
  // const isBuyer = true;
  // const isSeller = false;

  // header 없으면 생성
  let existHeader = document.querySelector("header");
  if (existHeader) return;

  const $header = createDOM();

  if (isLoggedIn && isBuyer) {
    loadActionsList(actionsLoggedIn);
  } else if (isLoggedIn && isSeller) {
    loadActionsList(actionsLoggedInSeller);
  } else {
    loadActionsList(actionsDefault);
  }

  // DOM 생성
  function createDOM() {
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
      </ul>
    </div>
  `;
    return $header;
  }

  // 상태별 actionsList 로드
  function loadActionsList(actionsDataList) {
    const $actionsList = $header.querySelector(".actions-list");

    actionsDataList.forEach((action) => {
      const li = document.createElement("li");
      li.classList.add("actions-item");

      // 마이페이지 버튼 li > 드롭다운
      if (action.dropdown) {
        li.innerHTML = action.dropdown;
        li.classList.add("dropdown-parent");
      }

      const a = document.createElement("a");
      a.href = action.href;
      a.id = action.id;
      a.innerHTML = action.svgTag;
      a.ariaLabel = action.label;

      const span = document.createElement("span");
      span.textContent = action.text;

      a.append(span);
      li.appendChild(a);
      $actionsList.appendChild(li);
    });

    showDropdown();
  }

  // 마이페이지 드롭다운 active
  function showDropdown() {
    const $mypageBtn = document.getElementById("action-mypage");
    const $mypageDropdown = document.querySelector(".dropdown-mypage");
    if ($mypageBtn) {
      $mypageBtn.addEventListener("click", () => {
        $mypageDropdown.classList.add("active");

        setDropdownPos();
      });
    }

    // 마이페이지 드롭다운 >> 다른 곳 클릭시 사라짐
    document.addEventListener("click", (e) => {
      if (
        e.target.closest("#action-mypage") ||
        e.target.closest(".dropdown-mypage")
      )
        return;

      $mypageDropdown.classList.remove("active");
      $mypageDropdown.closest(".actions-item").classList.remove("active");
    });
  }

  // 마이페이지 드롭다운 위치 (오버플로우시)
  function setDropdownPos() {
    const $mypageDropdown = document.querySelector(".dropdown-mypage");
    const dropdownRect = $mypageDropdown.getBoundingClientRect();
    const padding = 24;
    if (dropdownRect.right > window.innerWidth - padding) {
      $mypageDropdown.classList.add("overflow");
    } else {
      $mypageDropdown.classList.remove("overflow");
    }
  }

  // 액션 리스트 선택시 active
  const $actionsList = document.querySelector(".actions-list");
  $actionsList.addEventListener("click", (e) => {
    const target = e.target.closest(".actions-item");
    if (!target) return;
    target.classList.add("active");
  });

  // 로그아웃 버튼 이벤트
  const $logoutBtn = document.getElementById("btn-logout");
  if ($logoutBtn) {
    $logoutBtn.addEventListener("click", () => {
      loginSession.clear();
      location.reload();
    });
  }

  window.addEventListener("resize", () => {
    setDropdownPos();
  });

  return $header;
}
