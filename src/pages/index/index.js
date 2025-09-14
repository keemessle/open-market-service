import { createHeader } from "../../components/header.js";
import { createFooter } from "../../components/footer.js";

// section-list > product-list
// API
const BASE_URL = "https://api.wenivops.co.kr/services/open-market/";
async function loadProductList() {
  // DOM
  const $sectionList = document.querySelector(".section-list");
  const $productList = document.createElement("ul");
  $productList.className = "list-product";

  // fetch
  try {
    const response = await fetch(`${BASE_URL}products`);
    if (!response.ok) throw new Error("Network response was not ok");

    const data = await response.json();
    data["results"]
      .slice()
      .reverse() // 역순으로 추가
      .forEach((product) => {
        const $listItem = document.createElement("li");
        $listItem.className = "list-item";
        $listItem.innerHTML = `
          <a href="product-detail.html?id=${product.id}">
              <div class="product-img">
                <img 
                  
                  src="${product.image}"
                  alt="${product.name}" 
                  loading="lazy"
                  onerror="this.src='./assets/images/product-default.png'"
                />
              </div>
              <div class="info-container">
              <p class="info-seller ellipsis">${product.seller.store_name}</p>
              <p class="info-info ellipsis">${product.name}</p>
              <p class="info-unit">
                  <span class="info-price">${product.price.toLocaleString()}</span>원
              </p>
              </div>
          </a>
        `;
        $productList.append($listItem);
      });
    $sectionList.append($productList);
  } catch (error) {
    console.error("fetch error:", error);
  }
}

async function loadBannerDatas() {
  let bannerImageList = [];
  try {
    const response = await fetch(`${BASE_URL}products`);
    if (!response.ok) throw new Error("Network response was not ok");
    const data = await response.json();
    data["results"].forEach((product) => {
      bannerImageList.push({
        href: "#",
        title: product.name,
        desc: `${product.seller.store_name}의 인기 상품이 새로 들어왔습니다!`,
        img: product.image,
      });
    });

    return bannerImageList;
  } catch (error) {
    console.log(error);
  }
}

// const bannerDataList = [
//   {
//     href: "#",
//     title: "배너제목1",
//     desc: "배너설명1",
//     img: productImageList[0],
//   },
//   {
//     href: "#",
//     title: "배너제목2",
//     desc: "배너설명2",
//     img: productImageList[1],
//   },
//   {
//     href: "#",
//     title: "배너제목3",
//     desc: "배너설명3",
//     img: productImageList[2],
//   },
//   {
//     href: "#",
//     title: "배너제목4",
//     desc: "배너설명4",
//     img: productImageList[3],
//   },
//   {
//     href: "#",
//     title: "배너제목5",
//     desc: "배너설명5",
//     img: productImageList[4],
//   },
// ];

// section-banner
function loadBanner(dataList) {
  const swiperWrap = document.querySelector(".swiper-wrap");
  const bannerBtns = document.querySelector(".btn-container");
  const paginationList = document.querySelector(".pagination-list");

  dataList.forEach((data) => {
    // swiper
    const swiperItem = document.createElement("a");
    swiperItem.className = "swiper-item";
    swiperItem.setAttribute("tabindex", "-1");
    swiperItem.setAttribute("href", data.href);

    swiperItem.innerHTML = `
      <p class="banner-title">${data.title}</p>
      <p class="banner-desc">${data.desc}</p>
    <img src="${data.img}" />
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

  const offsetSwiper = function offsetSwiper(direction = "none") {
    const wrapWidth = swiperWrap.clientWidth;
    const maxIdnex = dataList.length;
    let offsetWidth;
    if (direction == "left") {
      swiperIndex = (swiperIndex - 1 + maxIdnex) % maxIdnex;
    }
    if (direction == "right") {
      swiperIndex = (swiperIndex + 1) % maxIdnex;
    }
    offsetWidth = wrapWidth * swiperIndex * -1;
    swiperWrap.style.transform = `translateX(${offsetWidth}px)`;

    activePagination(swiperIndex);
  };

  function activePagination(index) {
    const paginationItems = document.querySelectorAll(".pagination-item");
    paginationItems.forEach((item, i) => {
      if (i === index) {
        item.classList.add("active");
      } else {
        item.classList.remove("active");
      }
    });
  }

  return offsetSwiper;
}

let resizeTimer;
function offBannerTransition() {
  const $swiper = document.querySelector(".swiper-wrap");
  $swiper.style.transition = "none";

  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(() => {
    $swiper.style.transition = "";
  }, 200);
}

window.addEventListener("DOMContentLoaded", async () => {
  createHeader();
  createFooter();

  await loadProductList();
  const bannerDataList = await loadBannerDatas();

  const offsetSwiper = loadBanner(bannerDataList);

  window.addEventListener("resize", () => {
    offBannerTransition();
    offsetSwiper();
  });
});
