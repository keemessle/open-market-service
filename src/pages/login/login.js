const BASE_URL = "https://api.wenivops.co.kr/services/open-market";

const loginForm = document.querySelector(".form-wrap");
const loginBtn = document.querySelector(".login-btn");
const loginErr = document.getElementById("login-error");
const idInput = document.getElementById("user-id");
const pwInput = document.getElementById("password");

// Event

loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const username = idInput.value.trim();
  const password = pwInput.value;
  console.log(username, password);

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

  try {
    const { access, refresh, user } = await login(username, password);
    console.log("access:", access);
    console.log("refresh:", refresh);
    console.log("user:", user);

    // 토큰 보관(문서: access 5분, refresh 1일)
    const now = Date.now();
    localStorage.setItem("omkt_access", access);
    localStorage.setItem("omkt_refresh", refresh);
    localStorage.setItem("omkt_user", JSON.stringify(user));
    localStorage.setItem("omkt_aexp", String(now + 5 * 60 * 1000));
    localStorage.setItem("omkt_rexp", String(now + 24 * 60 * 60 * 1000));

    // 로그인 성공 후
    alert("로그인 성공!");

    // 이전 화면으로 돌아가기
    const redirect =
      sessionStorage.getItem("redirect_after_login") || "/index.html";
    sessionStorage.removeItem("redirect_after_login");

    if (redirect) {
      location.replace(redirect);
    } else if (
      document.referrer &&
      new URL(document.referrer).origin === location.origin
    ) {
      history.back();
    } else {
      location.replace("../public/index.html");
    }
  } catch (err) {
    console.error(err);
    showMessage(err.message || "로그인 실패");
  }
});

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

// 메시지 표시 함수
function showMessage(message) {
  loginErr.textContent = message;
}
