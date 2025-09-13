import { createHeader } from "../../components/header.js";
import { createFooter } from "../../components/footer.js";
import { UserSession } from "../../services/UserSession.js";
import { showModal } from "../../components/modal.js";

// 로그인 정보
const loginSession = new UserSession();

if (!loginSession.isAuthed() && !loginSession.isSeller()) {
  window.location.href = "./index.html";
}

const sellerInfo = JSON.parse(loginSession.storage.omkt_user);
const sellerName = sellerInfo.name;

// 판매중인 상품
async function loadeSellerProduct() {
  const BASE_URL = "https://api.wenivops.co.kr/services/open-market/";

  const response = await fetch(BASE_URL + sellerName + "/products");
  if (!response.ok) throw new Error(response.status);
  const data = await response.json();

  // DOM
  const $sellerName = document.getElementById("seller-name");
  const $listOnsale = document.getElementById("list-onsale");
  const $countOnsale = document.getElementById("count-onsale");
  $sellerName.innerText = sellerName;

  if (data["results"].length === 0) {
    $listOnsale.classList.add("item-none");
    $listOnsale.innerText = "판매중인 상품이 없습니다.";
  }
  $countOnsale.innerText = `(${data["results"].length})`;

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
                <a 
                  href="./make-product.html" 
                  class="item-col btn btn-s btn-modify" 
                >수정</a>
                <button 
                  class="item-col btn btn-s btn-white btn-delete" 
                >삭제</button>
    `;
    $listOnsale.append(li);
  });
}

const badgeDateList = [
  { tabname: "onsale", count: 1 },
  { tabname: "order", count: 0 },
  { tabname: "feedback", count: 10 },
  { tabname: "stats", count: 0 },
];
function showTabBadge(badgeDateList) {
  const $tabMenu = document.querySelectorAll(".tab-menu");
  badgeDateList.forEach((data) => {
    $tabMenu.forEach((menu) => {
      if (menu.dataset.tabname === data.tabname) {
        if (data.count > 0) {
          const $badge = menu.querySelector(".badge");
          $badge.innerText = data.count;
          $badge.classList.add("active");
        }
      }
    });
  });
}

function activateTabMenu() {
  const $tabList = document.querySelector(".tab-list");
  const $tabPanels = document.querySelector(".tab-panels");

  $tabList.addEventListener("click", (e) => {
    const targetMenu = e.target.closest(".tab-menu");
    if (!targetMenu || targetMenu.classList.contains("active")) return;

    // 탭메뉴
    $tabList.querySelector(".tab-menu.active")?.classList.remove("active");
    targetMenu.classList.add("active");

    // 탭패널
    const targetName = targetMenu.dataset.tabname;
    $tabPanels.querySelectorAll(".panel-table").forEach((panel) => {
      if (panel.dataset.tabname === targetName) {
        panel.classList.add("active");
      } else {
        panel.classList.remove("active");
      }
    });
  });
}

function deleteItem() {
  const $listOnsale = document.getElementById("list-onsale");
  $listOnsale.addEventListener("click", (e) => {
    const deleteBtn = e.target.closest(".btn-delete");
    if (!deleteBtn) return;

    const deleteTarget = deleteBtn.closest(".table-item");
    const targetName = deleteTarget.querySelector(".item-title").innerText;

    const notice = `
    ${targetName}\n상품을 삭제하시겠습니까?
    `;

    showModal(e, notice, async () => {
      deleteTarget.remove();
    });
  });
}

// 문의/리뷰 패널 임시 리스트 생성
function createTempList() {
  const $listFeedback = document.getElementById("list-feedback");
  const tempItem = document.createElement("li");
  tempItem.className = "table-item";
  tempItem.innerHTML = `
      <div class="item-col">
        <div class="item-title-wrap">
          <p class="item-title">개발자 금속 키링</p>
          <p class="item-desc">기본 패키지</p>
        </div>
      </div>
      <p class="item-col"><span>3</span>건/<span>5</span>건</p>
      <a href="" class="item-col btn btn-s btn-modify"> 수정 </a>
      <div href="" class="item-col btn btn-s btn-white btn-delete">
        삭제
      </div>`;

  for (let i = 0; i < 10; i++) {
    const clone = tempItem.cloneNode(true);
    $listFeedback.append(clone);
  }
}

window.addEventListener("DOMContentLoaded", () => {
  createHeader();
  createFooter();
  loadeSellerProduct();
});

showTabBadge(badgeDateList);
activateTabMenu();
deleteItem();

createTempList();
