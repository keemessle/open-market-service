import { createHeader } from "../../components/header.js";
import { createFooter } from "../../components/footer.js";

// section-list > product-list
// API
const BASE_URL = "https://api.wenivops.co.kr/services/open-market/";
export async function loadProductList(keyword=null) {
  // DOM
  const $sectionList = document.querySelector(".section-list");
  const $productList = document.createElement("ul");
  $productList.className = "list-product";

  // 초기화
  $sectionList.innerHTML = '';

  // fetch
  try {
    const url = new URL('products', BASE_URL);
    if (keyword) {
      url.searchParams.set('search', keyword);
    }
    const response = await fetch(url);

    if (!response.ok) throw new Error("Network response was not ok");

    const data = await response.json();
    data["results"]
      .slice()
      .reverse()
      .forEach((product) => {
        const $listItem = document.createElement("li");
        $listItem.className = "list-item";
        $listItem.innerHTML = `
          <a href="product-detail.html?id=${product.id}">
              <div class="product-img">
                <img 
                  src="${product.image.replace(/^http:/, "https:")}"
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
        href: `product-detail.html?id=${product.id}`,
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

// section-banner
function loadBanner(dataList) {
  const swiperWrap = document.querySelector(".swiper-wrap");
  const bannerBtns = document.querySelector(".btn-container");
  const paginationList = document.querySelector(".pagination-list");

  const cloneDataList = [
    dataList[dataList.length - 1],
    ...dataList,
    dataList[0],
  ];

  cloneDataList.forEach((data, index) => {
    // swiper
    const swiperItem = document.createElement("a");
    swiperItem.className = "swiper-item";
    swiperItem.setAttribute("tabindex", "-1");
    swiperItem.setAttribute("href", data.href);

    swiperItem.innerHTML = `
      <p class="banner-title">${data.title}</p>
      <p class="banner-desc">${data.desc}</p>
      <img src="${data.img}" alt="배너" />
  `;

    swiperWrap.append(swiperItem);

    // pagination
    if (index > 0 && index <= dataList.length) {
      const paginationItem = document.createElement("li");
      paginationItem.className = "pagination-item";
      paginationList.append(paginationItem);
    }
  });

  //
  let swiperIndex = 1;
  let wrapWidth = swiperWrap.clientWidth;
  let isMoving = false;
  swiperWrap.style.transform = `translateX(-${wrapWidth * swiperIndex}px)`;

  function updatePagination(index) {
    const paginationItems = document.querySelectorAll(".pagination-item");
    let activeIndex = index - 1;
    if (activeIndex < 0) activeIndex = dataList.length - 1;
    if (activeIndex >= dataList.length) activeIndex = 0;

    paginationItems.forEach((item, i) => {
      item.classList.toggle("active", i === activeIndex);
    });
  }
  updatePagination(swiperIndex);

  function moveSwiper(direction) {
    if (isMoving) return;
    isMoving = true;

    if (direction == "left") swiperIndex--;
    if (direction == "right") swiperIndex++;
    updateSwiper(true);
  }

  function updateSwiper(withTransition = true) {
    wrapWidth = swiperWrap.clientWidth;
    swiperWrap.style.transition = withTransition
      ? "transform 0.3s ease"
      : "none";
    swiperWrap.style.transform = `translateX(${-wrapWidth * swiperIndex}px)`;
    updatePagination(swiperIndex);
  }

  swiperWrap.addEventListener("transitionend", () => {
    let reset = false;

    if (swiperIndex === 0) {
      swiperIndex = dataList.length;
      reset = true;
    } else if (swiperIndex === dataList.length + 1) {
      swiperIndex = 1;
      reset = true;
    }
    if (reset) updateSwiper(false);
    isMoving = false;
  });

  bannerBtns.addEventListener("click", (e) => {
    const direction = e.target.closest(".btn-left") ? "left" : "right";
    moveSwiper(direction);
  });

  return (withTransition = true) => updateSwiper(withTransition);
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

  const param = new URLSearchParams(window.location.search);
  const keyword = decodeURIComponent(param.get("search"));

  if (param.get("search")) {
    await loadProductList(keyword);
  }
  else {
    await loadProductList();
  }  
  const bannerDataList = await loadBannerDatas();
  const updateSwiper = loadBanner(bannerDataList);

  window.addEventListener("resize", () => {
    offBannerTransition();
    updateSwiper(false);
  });
});
