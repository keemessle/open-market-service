const BASE_URL = "https://api.wenivops.co.kr/services/open-market";
const $menuItems = document.querySelectorAll(".menu-item");
const $signupForm = document.getElementById("signup-form");
const $idInput = document.getElementById("user-id");
const $pwInput = document.getElementById("password");
const $pwcInput = document.getElementById("password-confirm");
const $nameInput = document.getElementById("user-name");
const $bizNumInput = document.getElementById("biz-num");
const $sNameInput = document.getElementById("store-name");
const $phone1 = document.getElementById("phone1");
const $phone2 = document.getElementById("phone2");
const $phone3 = document.getElementById("phone3");
const $idCheckBtn = document.querySelector(".id-check-btn");
const $bizCheckBtn = document.querySelector(".biz-check-btn");
const $signupBtn = document.querySelector(".signup-btn");
const $agreeBox = document.getElementById("agree-box");
const $idCheckMsg = document.getElementById("id-check");
const $pwCheckMsg = document.getElementById("pw-check");
const $bizCheckMsg = document.getElementById("biz-check");
let currentRole = "BUYER"; // 기본값 -> 구매자
let isIdChecked = false; // 아이디 중복 체크
let checkedId = null; // 중복체크 확인된 아이디
let isBizChecked = false; // 사업자번호 중복 체크
let checkedBiz = null;

// ----- 에러 메시지 표시 ------
function showIdMessage(message) {
  $idCheckMsg.textContent = message;
}

function showPwMessage(message) {
  $pwCheckMsg.textContent = message;
}

function showBizMessage(message) {
  $bizCheckMsg.textContent = message;
}

// ----- 버튼 활성화 체크 -----
function checkFormValidation() {
  const username = $idInput.value.trim();
  const password = $pwInput.value;
  const passwordConfirm = $pwcInput.value;
  const name = $nameInput.value.trim();
  const phone1 = $phone1.value.trim();
  const phone2 = $phone2.value.trim();
  const phone3 = $phone3.value.trim();
  const isAgree = $agreeBox.checked;
  const sameAsCheckedId = isIdChecked && username === checkedId;
  // 판매자

  // 모든 필드가 채워지고, 아이디 중복 확인이 완료되고, 체크박스가 체크되었을 때
  // -> 버튼 활성화
  let isFormValid =
    username &&
    isPasswordValid(password) &&
    passwordConfirm &&
    password === passwordConfirm &&
    name &&
    phone1 &&
    phone2 &&
    phone3 &&
    isIdChecked &&
    sameAsCheckedId &&
    isAgree;

  if (currentRole === "SELLER") {
    const biz = $bizNumInput.value();
    const store = $sNameInput.value();
    const sameAsCheckedBiz = isBizChecked && biz === checkedBiz;

    isFormValid =
      isFormValid && biz && isBizChecked && sameAsCheckedBiz && store;
  }

  $signupBtn.disabled = !isFormValid;

  // 디버깅용 로그
  //   console.log("값 true, No값 false", {
  //     username: !!username,
  //     password: !!password,
  //     passwordConfirm: !!passwordConfirm,
  //     name: !!name,
  //     phone1: !!phone1,
  //     phone2: !!phone2,
  //     phone3: !!phone3,
  //     isIdChecked,
  //     sameAsChecked,
  //     isAgree,
  //     passwordMatch: password === passwordConfirm,
  //     formValid: isFormValid,
  //   });
}

// ----- 아이디 중복 체크 -----
async function checkDuplicateId() {
  const username = $idInput.value.trim();

  try {
    const res = await fetch(`${BASE_URL}/accounts/validate-username/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username }),
    });

    if (res.status === 200) {
      showIdMessage("사용 가능한 아이디입니다.");
      $idCheckMsg.classList.remove("message-error");
      $idInput.classList.remove("input-error");
      isIdChecked = true;
      checkedId = username;
      console.log("id 중복체크 여부: ", isIdChecked);
      console.log("중복체크 확인된 id: ", checkedId);
    } else {
      showIdMessage("이미 사용 중인 아이디입니다.");
      $idCheckMsg.classList.add("message-error");
      $idInput.classList.add("input-error");
      isIdChecked = false;
      console.log("id 중복체크 여부: ", isIdChecked);
    }
  } catch (err) {
    console.error("아이디 중복 확인 오류:", err);
    isIdChecked = false;
  }

  checkFormValidation(); // 버튼 상태 업데이트
}

// ----- 비밀번호 유효성 검사 -----
function isPasswordValid(password) {
  return (
    password.length >= 8 && /[a-z]/.test(password) && /[0-9]/.test(password)
  );
}

// ----- 사업자 등록번호 중복 체크 ----
async function checkBizNumber() {
  const biz = $bizNumInput.value;

  if (!/^[0-9]{10}$/.test(biz)) {
    showBizMessage("사업자등록번호는 10자리 숫자여야 합니다.");
    $bizCheckMsg.classList.add("message-error");
    $bizNumInput.classList.add("input-error");
    isBizChecked = false;
    checkedBiz = null;
    checkFormValidation();
    return;
  }

  try {
    const res = await fetch(
      `${BASE_URL}/accounts/seller/validate-registration-number/`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ biz }),
      }
    );

    if (res.status === 200) {
      showBizMessage("사용 가능한 사업자번호입니다.");
      $bizCheckMsg.classList.remove("message-error");
      $bizNumInput.classList.remove("input-error");
      isBizChecked = true;
      checkedBiz = biz;
      console.log("biz 중복체크 여부: ", isBizChecked);
      console.log("중복체크 확인된 biz: ", checkedBiz);
    } else if (res.status === 409) {
      showBizMessage("이미 등록된 사업자등록번호입니다.");
      $bizCheckMsg.classList.add("message-error");
      $bizNumInput.classList.add("input-error");
      isBizChecked = false;
      console.log("id 중복체크 여부: ", isBizChecked);
    } else {
      isBizChecked = false;
      console.log("id 중복체크 여부: ", isBizChecked);
    }
  } catch (err) {
    console.error("아이디 중복 확인 오류:", err);
    isBizChecked = false;
  }

  checkFormValidation(); // 버튼 상태 업데이트
}

// ----- 서버 연결 -----
async function createAccount(userData) {
  const url = `${BASE_URL}/accounts/${currentRole.toLowerCase()}/signup/`;
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });

    const data = await res.json();

    if (!res.ok) {
      if (data.phone_number) {
        const message = Array.isArray(data.phone_number)
          ? data.phone_number[0]
          : data.phone_number;
        throw new Error(message);
      } else {
        const errorData = await res.json();
        throw new Error(JSON.stringify(errorData));
      }
    }

    return data;
  } catch (err) {
    throw err; // "이 함수에서 에러가 났으니까, 이 함수를 호출한 곳에서 처리해줘!"
  }
}

// Event
// ----- 회원 메뉴 선택 -----
$menuItems.forEach((menuItem) => {
  menuItem.addEventListener("click", () => {
    const btn = menuItem.querySelector("button[data-role]");
    if (!btn) return;

    currentRole = btn.dataset.role;
    console.log("선택된 회원의 역할: ", currentRole);

    $menuItems.forEach((item) => item.classList.remove("on"));
    menuItem.classList.add("on");

    // 판매회원가입 입력창 노출
    if (currentRole === "SELLER") {
      document.querySelector(".seller-only").hidden = false;
    }

    // 탭 전환 시에도 무효화
    isIdChecked = false;
    checkedId = null;
    checkFormValidation();
  });
});

// ----- 아이디 중복 확인 버튼 -----
$idCheckBtn.addEventListener("click", checkDuplicateId);

// ----- 아이디 입력 바뀌면 무효화 ----
$idInput.addEventListener("input", () => {
  const check = $idInput.value.trim();

  if (check !== checkedId) {
    isIdChecked = false;

    if (check) {
      showIdMessage("아이디 중복 확인해 주세요.");
      $idCheckMsg.classList.add("message-error");
    }
  }

  $idCheckMsg.textContent = "";
  $idInput.classList.remove("input-error");
  checkFormValidation();
});

// ----- 사업자번호 인증 버튼 -----
$bizCheckBtn?.addEventListener("click", checkBizNumber);

// ----- 사업자 번호 입력 바뀌면 무효화 ----
$bizNum.addEventListener("input", () => {
  if ($bizNum.value !== checkedBiz) {
    isBizChecked = false;
  }
  checkFormValidation();
});

// ----- 비밀번호 확인 -----
$pwInput.addEventListener("input", () => {
  const password = $pwInput.value;
  let checkImg = document.querySelector(".check-img");
  let imgSrc = "../../assets/images/icons/icon-check-off.svg";

  if (isPasswordValid(password)) {
    checkImg.src = "../../assets/images/icons/icon-check-on.svg";
    $pwInput.classList.remove("input-error");
    showPwMessage("");
  } else {
    checkImg.src = imgSrc;
    $pwInput.classList.add("input-error");
    $pwInput.focus();
  }

  checkFormValidation();
});

// ----- 비밀번호 재확인 -----
$pwcInput.addEventListener("input", () => {
  const password = $pwInput.value;
  const passwordConfirm = $pwcInput.value;
  let reCheckImg = document.querySelector(".recheck-img");
  let imgSrc = "../../assets/images/icons/icon-check-off.svg";

  if (passwordConfirm) {
    if (password === passwordConfirm && isPasswordValid(password)) {
      reCheckImg.src = "../../assets/images/icons/icon-check-on.svg";
      $pwcInput.classList.remove("input-error");
      showPwMessage("");
    } else {
      $pwcInput.classList.add("input-error");
      reCheckImg.src = imgSrc;
      showPwMessage("비밀번호가 일치하지 않습니다.");
    }
  }

  checkFormValidation();
});

// ----- 이름, 전화번호 입력 시에도 체크 -----
[$nameInput, $phone1, $phone2, $phone3].forEach((input) => {
  input.addEventListener("input", checkFormValidation);
});

// ----- 약관 동의 체크박스 -----
$agreeBox.addEventListener("change", () => {
  console.log("약관 동의:", $agreeBox.checked);
  checkFormValidation();
});

// ===== 폼 제출 =====
$signupForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const username = $idInput.value.trim();
  const password = $pwInput.value;
  const passwordConfirm = $pwcInput.value;
  const name = $nameInput.value.trim();
  const phone1 = $phone1.value.trim();
  const phone2 = $phone2.value.trim();
  const phone3 = $phone3.value.trim();
  const phoneNumber = phone1 + phone2 + phone3;
  const isAgree = $agreeBox.checked;

  // 1. 빈 값 체크
  if (
    !username ||
    !password ||
    !passwordConfirm ||
    !name ||
    !phone1 ||
    !phone2 ||
    !phone3
  ) {
    alert("모든 필드를 입력해주세요."); // 가입하기 활성화 안되게
    return;
  }

  // 2. 아이디 유효성 검사
  if (!/^[a-zA-Z0-9]+$/.test(username)) {
    showIdMessage("ID는 20자 이내의 영어 소문자, 대문자, 숫자만 가능합니다.");
    $idInput.classList.add("input-error");
    $idInput.focus();
    return;
  }

  // 3. 비밀번호 유효성 검사
  if (!/[a-z]/.test(password)) {
    showPwMessage("비밀번호는 8자 이상이며, 영문자와 숫자를 포함해야 합니다.");
    $pwInput.classList.add("input-error");
    $pwInput.focus();
    return;
  }
  if (!/[0-9]/.test(password)) {
    showPwMessage("비밀번호는 한개 이상의 숫자가 필수적으로 들어가야 합니다.");
    $pwInput.classList.add("input-error");
    $pwInput.focus();
    return;
  }

  // 4. 핸드폰 번호 유효성 검사
  if (!/^01[0-9]\d{7,8}$/.test(phoneNumber)) {
    showPwMessage(
      "핸드폰번호는 01*으로 시작해야 하는 10~11자리 숫자여야 합니다."
    );
    $phone1.classList.add("input-error");
    $phone2.classList.add("input-error");
    $phone3.classList.add("input-error");
    $phone1.focus();
    return;
  }

  // 5. 약관 동의 체크
  if (!isAgree) {
    alert("약관에 동의해 주세요.");
    return;
  }

  // 6. 필수 인증 완료 여부
  if (!isIdChecked) {
    alert("아이디 중복 확인을 해 주세요");
    return;
  }

  $signupBtn.disabled = false;

  try {
    const userData = {
      username,
      password,
      name,
      phone_number: phoneNumber,
    };

    // 판매자 회원가입일 경우
    if (currentRole === "SELLER") {
      const biz = $bizNum.value;
      const shop = $shopName.value.trim();

      // 안전망
      if (!(isBizChecked && biz === checkedBiz)) {
        alert("사업자등록번호 인증을 완료해주세요.");
        return;
      }
      if (!store) {
        alert("스토어 이름을 입력해주세요.");
        return;
      }

      userData.company_registration_number = biz;
      userData.store_name = shop;
    }

    const result = await createAccount(userData);
    console.log("회원가입 완료: ", result);
    alert("회원가입 완료!");
    setTimeout(() => {
      location.href = "../../login.html";
    }, 800);
  } catch (err) {
    console.error(err);
    alert(err.message || "회원가입에 실패했습니다. 다시 시도해주세요."); // 핸드폰번호 중복 여부
  } finally {
    $signupBtn.disabled = true;
  }
});

// 초기 버튼 상태 설정
document.addEventListener("DOMContentLoaded", () => {
  $signupBtn.disabled = true;
  checkFormValidation();
});

// 추가 과제: 판매회원 회원가입
