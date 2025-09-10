import { UserSession } from "../../services/UserSession.js";

const BASE_URL = "https://api.wenivops.co.kr/services/open-market";

const menuItems = document.querySelectorAll(".menu-item");
const loginForm = document.getElementById("login-form");
const loginBtn = document.querySelector(".login-btn");
const loginErr = document.getElementById("login-error");
const idInput = document.getElementById("user-id");
const pwInput = document.getElementById("password");
let currentRole = "BUYER"; // 기본값 -> 구매자

const session = new UserSession();

// [ Event ] ================
// ===== 회원 메뉴 선택 =====
menuItems.forEach((menuItem) => {
  menuItem.addEventListener("click", (e) => {
    const btn = menuItem.querySelector("button[data-role");
    if (!btn) return;

    currentRole = btn.dataset.role;
    console.log("선택된 회원의 역할: ", currentRole);

    menuItems.forEach((item) => item.classList.remove("on")); // 일단 현재 on 클래스 전체 삭제
    menuItem.classList.add("on");
  });
});

// ===== 폼 제출 -> 로그인 정보 제출 =====
loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const username = idInput.value.trim();
  const password = pwInput.value;

  // 유효성 검사
  if (!username) {
    showMessage("아이디를 입력해 주세요.");
    idInput.focus();
    return;
  }
  if (!password) {
    showMessage("비밀번호를 입력해 주세요.");
    pwInput.focus();
    return;
  }

  // 중복 제출 방지
  loginBtn?.setAttribute("disabled", "");

  try {
    const { access, refresh, user } = await login(username, password);

    const serverRole = String(user?.user_type || "");
    if (!serverRole || serverRole !== currentRole) {
      const roleAccessMsg =
        currentRole === "BUYER"
          ? "판매회원으로 로그인해주세요."
          : "구매회원으로 로그인해주세요.";
      alert(roleAccessMsg);
      idInput.focus();
      return;
    }

    // UserSession 클래스 활용
    session.save({ access, refresh, user });

    alert("로그인 성공!");

    // 이전 화면으로 돌아가기 (SessionStorage)
    const redirect =
      sessionStorage.getItem("redirect_after_login") || "../index.html";
    sessionStorage.removeItem("redirect_after_login"); // 로그인 성공 후 제거

    if (redirect) {
      location.replace(redirect);
    } else if (
      document.referrer &&
      new URL(document.referrer).origin === location.origin
    ) {
      history.back();
    } else {
      location.replace("../index.html");
    }
  } catch (err) {
    console.error(err);
    showMessage(err.message || "로그인 실패");
  } finally {
    loginBtn?.removeAttribute("disabled");
  }
});

// ===== API 서버 연결 =====
async function login(username, password) {
  const res = await fetch(`${BASE_URL}/accounts/login/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || data.detail || "로그인 실패");
  }

  return data;
}

// ===== 에러 메시지 표시 =====
function showMessage(message) {
  loginErr.textContent = message;
}
