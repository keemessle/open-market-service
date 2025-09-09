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
      .reverse()
      .forEach((product) => {
        const $listItem = document.createElement("li");
        $listItem.className = "list-item";
        $listItem.innerHTML = `
        <a href="product-detail.html?id=${product.id}">
            <img class="product-img" src="${product.image}" alt="${
          product.name
        }" />
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
