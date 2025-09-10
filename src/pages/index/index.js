import { createHeader } from "../../components/header.js";
import { createFooter } from "../../components/footer.js";

// header & footer 넣기
let isLoggedIn = false;
const $header = createHeader(isLoggedIn);
document.body.prepend($header);

const $footer = createFooter(isLoggedIn);
document.body.append($footer);

// section-list > product-list
// DOM
const $sectionList = document.querySelector(".section-list");
const $productList = document.createElement("ul");
$productList.className = "list-product";

// API
const BASE_URL = "https://api.wenivops.co.kr/services/open-market/";
fetch(`${BASE_URL}products`)
  .then((response) => {
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    return response.json();
  })
  .then((data) => {
    data["results"]
      .slice()
      .reverse() // 역순으로 추가
      .forEach((product) => {
        const $listItem = document.createElement("li");
        $listItem.className = "list-item";
        $listItem.innerHTML = `
        <a href="product-detail.html?id=${product.id}">
            <img 
              class="product-img" 
              src="${product.image}"
              alt="${product.name}" 
              loading="lazy"
              onerror="this.src='/assets/images/product-default.png'"
            />
            <div class="info-container">
            <p class="info-seller ellipsis">${product.seller.name}</p>
            <p class="info-info ellipsis">${product.name}</p>
            <p class="info-unit">
                <span class="info-price">${product.price.toLocaleString()}</span>원
            </p>
            </div>
        </a>
        `;
        $productList.append($listItem);
        $sectionList.append($productList);
      });
  })
  .catch((error) => {
    console.error("There has been a problem with your fetch operation:", error);
  });

// section-banner
const swiperWrap = document.querySelector(".swiper-wrap");
const bannerBtns = document.querySelector(".btn-container");
const paginationList = document.querySelector(".pagination-list");

const bannerDataList = [
  { href: "#", title: "배너제목1", desc: "배너설명1", img: "yellowgreen" },
  { href: "#", title: "배너제목2", desc: "배너설명2", img: "pink" },
  { href: "#", title: "배너제목3", desc: "배너설명3", img: "skyblue" },
  { href: "#", title: "배너제목4", desc: "배너설명4", img: "orange" },
  { href: "#", title: "배너제목5", desc: "배너설명5", img: "dodgerblue" },
];

bannerDataList.forEach((data) => {
  // swiper
  const swiperItem = document.createElement("a");
  swiperItem.className = "swiper-item";
  swiperItem.setAttribute("href", data.href);
  swiperItem.style.backgroundColor = data.img;
  swiperItem.innerHTML = `
    <p class="banner-title">${data.title}</p>
    <p class="banner-desc">${data.desc}</p>
  `;

  // pagination
  const paginationItem = document.createElement("li");
  paginationItem.className = "pagination-item";

  // append
  swiperWrap.append(swiperItem);
  paginationList.append(paginationItem);
});

// btn click event
bannerBtns.addEventListener("click", (e) => {
  const direction = e.target.closest(".btn-left") ? "left" : "right";
  offsetSwiper(direction);
});

let swiperIndex = 0;
activePagination(swiperIndex);

function offsetSwiper(direction) {
  const wrapWidth = swiperWrap.clientWidth;
  const maxIdnex = bannerDataList.length;
  let offsetWidth;
  if (direction == "left") {
    swiperIndex = (swiperIndex - 1 + maxIdnex) % maxIdnex;
  } else {
    swiperIndex = (swiperIndex + 1) % maxIdnex;
  }
  offsetWidth = wrapWidth * swiperIndex * -1;
  console.log(swiperIndex);
  swiperWrap.style.transform = `translateX(${offsetWidth}px)`;

  activePagination(swiperIndex);
}

// pagination
function activePagination(index) {
  const paginationItems = document.querySelectorAll(".pagination-item");
  paginationItems.forEach((item, index) => {
    if (index === swiperIndex) {
      item.classList.add("active");
    } else {
      item.classList.remove("active");
    }
  });
}
