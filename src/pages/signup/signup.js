import { UserSession } from "../../services/UserSession.js";

const BASE_URL = "https://api.wenivops.co.kr/services/open-market";

const $menuItems = document.querySelectorAll(".menu-item");

const $signupFrom = document.getElementById("signup-form");
const $idIninput = document.getElementById("user-id");
const $pwInput = document.getElementById("password");
const $pwcInput = document.getElementById("password-confirm");
const $nameInput = document.getElementById("user-name");
const $phone1 = document.getElementById("phone1");
const $phone2 = document.getElementById("phone2");
const $phone3 = document.getElementById("phone3");

const $idCheckBtn = document.querySelectorAll(".check-btn");
const $SignupBtn = document.querySelectorAll(".signup-btn");

const $idCheckMsg = document.getElementById("id-check");
const $pwCheckMsg = document.getElementById("pw-check");

let currentRole = "BUYER"; // 기본값 -> 구매자

const session = new UserSession();

// ----- 서버 연결 -----
async function createAcoount({ userData }) {
  const url = `${BASE_URL}/accounts/${currentRole.toLowerCase()}/signup/`;
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });

    if (!res.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await res.json();
    console.log("계정 생성 성공:", result);
    return result;
  } catch (err) {
    console.error("계정 생성 실패:", err);
  }
}

// ===== 에러 메시지 표시 =====
function showMessage(message) {
  $idCheckMsg.textContent = message;
}

// Event ====================
// ===== 회원 메뉴 선택 =====
$menuItems.forEach((menuItem) => {
  menuItem.addEventListener("click", (e) => {
    const btn = menuItem.querySelector("button[data-role]");
    if (!btn) return;

    currentRole = btn.dataset.role;
    console.log("선택된 회원의 역할: ", currentRole);

    $menuItems.forEach((item) => item.classList.remove("on")); // 일단 현재 on 클래스 전체 삭제
    menuItem.classList.add("on");
  });
});

// ===== 폼 제출 =====
$signupFrom.addEventListener("submit", (e) => {
  e.preventDefault();
});
