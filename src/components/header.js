export function createHeader(isLoggedIn = false) {
  const $header = document.createElement("header");
  $header.innerHTML = `
    <div class="header-container container">
      <h1 class="header-h1">
        <a href="#">
          <img class="header-logo" src="../assets/images/Logo-hodu.png" alt="호두샵 로고" />
          <span class="sr-only">HODU</span>
        </a>
      </h1>
      <form class="form-search" action="/search" method="get">
        <a class="search-logo-wrap" href="#"><img class="search-logo" src="../assets/images/Logo-hodu-sm.png" alt="호두샵 로고" /></a>
        <label class="sr-only" for="search">검색</label>
        <input id="search" type="text" placeholder="상품을 검색해보세요!" />
        <button type="submit"></button>
      </form>
      <ul class="actions-list"></ul>
    </div>
  `;

  // actions-list
  const $actionsList = $header.querySelector(".actions-list");
  const actions = [
    {
      href: "",
      img: "../assets/images/icons/icon-shopping-cart.svg",
      alt: "장바구니 바로가기",
      text: "장바구니",
    },
    // 기본 > 로그인 / 로그인 되었을 때 > 마이페이지
    isLoggedIn
      ? {
          href: "",
          img: "../assets/images/icons/icon-user.svg",
          alt: "마이페이지 바로가기",
          text: "마이페이지",
        }
      : {
          href: "/login",
          img: "../assets/images/icons/icon-user.svg",
          alt: "로그인 바로가기",
          text: "로그인",
        },
  ];

  actions.forEach((action) => {
    const li = document.createElement("li");
    const a = document.createElement("a");
    a.href = action.href;

    const img = document.createElement("img");
    img.src = action.img;
    img.alt = action.alt;

    const p = document.createElement("p");
    p.textContent = action.text;

    a.append(img, p);
    li.appendChild(a);
    $actionsList.appendChild(li);
  });

  return $header;

  // DOM
  //   const $header = document.createElement("header");
  //   const $container = document.createElement("div");
  //   $container.className = "header-container container";

  //   const h1 = document.createElement("h1");
  //   h1.className = "header-logo";

  //   const aLogo = document.createElement("a");
  //   aLogo.href = "#";

  //   const imgLogo = document.createElement("img");
  //   imgLogo.src = "../assets/images/Logo-hodu.png";
  //   imgLogo.alt = "호두샵 로고";

  //   const spanSr = document.createElement("span");
  //   spanSr.className = "sr-only";
  //   spanSr.textContent = "HODU";
  //   aLogo.append(imgLogo, spanSr);
  //   h1.appendChild(aLogo);

  //   // form-search
  //   const form = document.createElement("form");
  //   form.className = "form-search";
  //   form.action = "/search";
  //   form.method = "get";

  //   const label = document.createElement("label");
  //   label.className = "sr-only";
  //   label.htmlFor = "search";
  //   label.textContent = "검색";

  //   const input = document.createElement("input");
  //   input.id = "search";
  //   input.type = "text";
  //   input.placeholder = "상품을 검색해보세요!";

  //   const button = document.createElement("button");
  //   button.type = "submit";

  //   form.append(label, input, button);

  //   // actions-list
  //   const ul = document.createElement("ul");
  //   ul.className = "actions-list";
  //   const actions = [
  //     {
  //       href: "",
  //       img: "../assets/images/icons/icon-shopping-cart.svg",
  //       alt: "장바구니 바로가기",
  //       text: "장바구니",
  //     },
  //     // 기본 > 로그인 / 로그인이 되었을 때 > 마이페이지로
  //     isLoggedIn
  //       ? {
  //           href: "",
  //           img: "../assets/images/icons/icon-user.svg",
  //           alt: "마이페이지 바로가기",
  //           text: "마이페이지",
  //         }
  //       : {
  //           href: "/login",
  //           img: "../assets/images/icons/icon-user.svg",
  //           alt: "로그인 바로가기",
  //           text: "로그인",
  //         },
  //   ];

  //   actions.forEach((action) => {
  //     const li = document.createElement("li");
  //     const a = document.createElement("a");
  //     a.href = action.href;

  //     const img = document.createElement("img");
  //     img.src = action.img;
  //     img.alt = action.alt;

  //     const p = document.createElement("p");
  //     p.textContent = action.text;

  //     a.append(img, p);
  //     li.appendChild(a);
  //     ul.appendChild(li);
  //   });

  //   $container.append(h1, form, ul);
  //   $header.appendChild($container);

  //   return $header;
}
