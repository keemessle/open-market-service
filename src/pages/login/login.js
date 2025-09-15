import { UserSession } from "../../services/UserSession.js";

const $menuItems = document.querySelectorAll(".menu-item");
const $loginForm = document.getElementById("login-form");
const $loginBtn = document.querySelector(".login-btn");
const $loginErr = document.querySelector(".message");
const $idInput = document.getElementById("user-id");
const $pwInput = document.getElementById("password");
let currentRole = "BUYER"; // 기본값 -> 구매자

const loginSession = new UserSession();

function showMessage(message) {
  $loginErr.textContent = message;
}

async function login(username, password) {
  const res = await fetch(`${loginSession.baseUrl}/accounts/login/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });

  const data = await res.json();

  if (!res.ok) {
    if (res.status === 401) {
      throw new Error("아이디 또는 비밀번호가 올바르지 않습니다.");
    } else {
      throw new Error(data.error || data.detail || "로그인 실패");
    }
  }

  return data;
}

// Event
$menuItems.forEach((menuItem) => {
  menuItem.addEventListener("click", (e) => {
    const btn = menuItem.querySelector("button[data-role]");
    if (!btn) return;

    currentRole = btn.dataset.role;
    console.log("선택된 회원의 역할: ", currentRole);

    $menuItems.forEach((item) => item.classList.remove("on"));
    menuItem.classList.add("on");
  });
});

$loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  showMessage("");

  const username = $idInput.value.trim();
  const password = $pwInput.value;

  if (!username) {
    showMessage("아이디를 입력해 주세요.");
    $idInput.focus();
    return;
  }
  if (!password) {
    showMessage("비밀번호를 입력해 주세요.");
    $pwInput.focus();
    return;
  }

  // 중복 제출 방지
  $loginBtn.setAttribute("disabled", "");

  try {
    const result = await login(username, password);
    console.log(result.user.user_type);

    const userRole = String(result.user.user_type || "").toUpperCase();
    if (!userRole || userRole !== currentRole) {
      alert("선택한 회원 유형으로 로그인할 수 없습니다.");
      $idInput.focus();
      return;
    }

    loginSession.save(result);

    alert("로그인 성공!");

    // 이전 화면으로 돌아가기
    if (document.referrer && !document.referrer.includes("/login")) {
      location.replace(document.referrer);
    } else {
      location.replace("./index.html");
    }
  } catch (err) {
    console.error(err);
    showMessage(err.message || "로그인 실패했습니다. 다시 시도해 주세요.");
  } finally {
    $loginBtn.removeAttribute("disabled");
  }
});
