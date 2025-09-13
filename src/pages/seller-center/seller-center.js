import { createHeader } from "../../components/header.js";
import { createFooter } from "../../components/footer.js";
import { UserSession } from "../../services/UserSession.js";

// DOM
const $sellerName = document.getElementById("seller-name");
const $listOnsale = document.getElementById("list-onsale");

// 로그인 정보
const loginSession = new UserSession();

if (!loginSession.isAuthed() && !loginSession.isSeller()) {
  window.location.href = "./index.html";
}

const sellerInfo = JSON.parse(loginSession.storage.omkt_user);
const sellerName = sellerInfo.name;

// 판매중인 상품
const BASE_URL = "https://api.wenivops.co.kr/services/open-market/";

async function loadeSellerProduct() {
  const response = await fetch(BASE_URL + sellerName + "/products");
  if (!response.ok) throw new Error(response.status);
  const data = await response.json();

  if (data["results"].length === 0) {
    $listOnsale.classList.add("item-none");
    $listOnsale.innerText = "판매중인 상품이 없습니다.";
  }

  data["results"].forEach((product) => {
    const li = document.createElement("li");
    li.className = "table-item";
    if (product.stock === 0) {
      li.classList.add("stock-none");
    }
    li.innerHTML = `
                <div class="item-col has-img">
                  <img src="${product.image}" alt="${product.info}" />
                  <div class="item-title-wrap">
                    <p class="item-title">
                      ${product.name}
                    </p>
                    <p class="item-desc">
                      재고: <span>${product.stock}</span>개
                    </p>
                  </div>
                </div>
                <p class="item-col">
                  <span> ${product.price.toLocaleString()}</span>원
                </p>
                <a href="" class="item-col btn-modify btn btn-s">
                  수정
                </a>
                <a href="" class="item-col btn-delete btn btn-s btn-white">
                  삭제
                </a>
    `;
    $listOnsale.append(li);
  });
}

loadeSellerProduct();

// 조립
$sellerName.innerText = sellerName;

window.addEventListener("DOMContentLoaded", () => {
  createHeader();
  createFooter();
});
