const BASE_URL = "https://api.wenivops.co.kr/services/open-market";
// ================== DOM ==================
const $menuItems = document.querySelectorAll(".menu-item");
const $signupForm = document.getElementById("signup-form");

const $idInput = document.getElementById("user-id");
const $passwordInput = document.getElementById("password");
const $passwordConfirmInput = document.getElementById("password-confirm");
const $nameInput = document.getElementById("user-name");

const $bizNumberInput = document.getElementById("biz-num");
const $storeNameInput = document.getElementById("store-name");
const $bizCheckBtn = document.querySelector(".biz-check-btn");
const $sellerBox = document.querySelector(".seller-only");

const $phone1 = document.getElementById("phone1");
const $phone2 = document.getElementById("phone2");
const $phone3 = document.getElementById("phone3");

const $idCheckBtn = document.querySelector(".id-check-btn");
const $signupBtn = document.querySelector(".signup-btn");
const $agreeBox = document.getElementById("agree-box");

// ================== 상태 관리 ==================
let currentRole = "BUYER"; // 현재 회원가입 유형

// 중복확인 상태 변수
let isIdChecked = false;
let validatedId = null;

// 인증 상태 변수
let isBizChecked = false;
let validatedBiz = null;

// ================== 정규식 패턴 ==================
const USERNAME_PATTERN = /^[A-Za-z0-9]{1,20}$/;
const PASSWORD_PATTERN = /^(?=.*[A-Za-z])(?=.*\d).{8,}$/;
const PHONE_PATTERN = /^01[0-9]\d{7,8}$/;
const BIZ_NUMBER_PATTERN = /^[0-9]{10}$/;

// ================== 순서 검증을 위한 필드 배열 ==================
const BUYER_FIELD_ORDER = [
  $idInput,
  $passwordInput,
  $passwordConfirmInput,
  $nameInput,
  $phone1,
];

const SELLER_FIELD_ORDER = [
  $idInput,
  $passwordInput,
  $passwordConfirmInput,
  $nameInput,
  $phone1,
  $bizNumberInput,
  $storeNameInput,
];

// ================== 에러 메시지 ==================
const VALIDATION_ERROR = {
  REQUIRED: "필수 정보입니다.",
  INVALID_ID: "아이디는 20자 이내의 영문 또는 숫자만 사용할 수 있습니다.",
  INVALID_PASSWORD: "비밀번호는 8자 이상, 영문과 숫자를 모두 포함해야 합니다.",
  INVALID_PASSWORD_CONFIRM: "비밀번호가 일치하지 않습니다.",
  PASSWORD_MATCH: "비밀번호가 일치합니다.",
  INVALID_PHONE: "핸드폰 번호는 10~11자리 숫자여야 합니다.",
  INVALID_BIZ: "사업자등록번호는 숫자 10자리로 입력해 주세요.",
  BIZ_DUPLICATE: "이미 등록된 사업자등록번호입니다.",
  BIZ_NEED_AUTH: "인증을 다시 진행해주세요.",
  BIZ_AUTHED: "인증 완료된 번호입니다.",
  ID_DUPLICATE: "이미 사용 중인 아이디입니다.",
  ID_NEED_CHECK: "아이디 중복 확인해 주세요.",
  ID_AVAILABLE: "사용 가능한 아이디입니다.",
  BIZ_AVAILABLE: "사용 가능한 사업자등록번호입니다.",
  SIGNUP_FAIL: "회원가입에 실패했습니다. 다시 시도해 주세요.",
  SEVER_ERR: "오류가 발생했습니다. 잠시 후 다시 시도해 주세요.",
};

// ================== 검증 함수 ==================
// 비밀번호 유효성 검사
function isValidPassword(password) {
  return PASSWORD_PATTERN.test(password || "");
}

// 핸드폰 번호 3칸 모두 입력됐는지 검사
function isPhoneFilled() {
  return $phone1.value && $phone2.value && $phone3.value;
}

// 특정 필드가 채워졌는지 검사 (핸드폰은 3칸 모두)
function isFieldFilled($fieldElement) {
  if (!$fieldElement) return true;

  if ($fieldElement === $phone1) {
    return isPhoneFilled();
  }

  return $fieldElement.value.trim() !== "";
}

// 현재 회원 유형에 따라 입력 순서 배열 반환
function getCurrentFieldOrder() {
  return currentRole === "SELLER" ? SELLER_FIELD_ORDER : BUYER_FIELD_ORDER;
}

// 현재 필드 이전 필드들이 모두 입력됐는지 검사
function checkPreviousFields($currentField) {
  const fieldOrder = getCurrentFieldOrder();
  const currentFieldIndex = fieldOrder.indexOf($currentField);

  if (currentFieldIndex === -1) return true;

  let allPrevFilled = true;
  for (let i = 0; i < currentFieldIndex; i++) {
    const $previousField = fieldOrder[i];
    if (!isFieldFilled($previousField)) {
      showMessage($previousField, VALIDATION_ERROR.REQUIRED);
      allPrevFilled = false;
    }
  }
  return allPrevFilled;
}

// 모든 입력/메시지 초기화
function clearAll() {
  document.querySelectorAll(".form-group .message").forEach(($msg) => {
    $msg.textContent = "";
    $msg.classList.remove("message-error", "message-success");
  });
  document
    .querySelectorAll(".form-group input, .form-group select")
    .forEach(($el) => {
      $el.classList.remove("input-error");
      $el.value = "";
    });

  updateCheckIcon(".check-img", false);
  updateCheckIcon(".recheck-img", false);
}

// 판매자 전용 입력란 표시/숨김
function toggleSellerSection() {
  const show = currentRole === "SELLER";
  if ($sellerBox) $sellerBox.hidden = !show;

  if (!show) {
    isBizChecked = false;
    validatedBiz = null;
    if ($bizNumberInput) $bizNumberInput.value = "";
    if ($storeNameInput) $storeNameInput.value = "";
    clearMessage($bizNumberInput);
    clearMessage($storeNameInput);
  }
}

// ================== 버튼 활성화 ==================
// 모든 입력값이 유효할 때만 가입 버튼 활성화
function updateFormValidation() {
  const username = $idInput.value.trim();
  const pw = $passwordInput.value;
  const pwc = $passwordConfirmInput.value;
  const name = $nameInput.value.trim();
  const phoneNum = `${$phone1.value}${$phone2.value}${$phone3.value}`;
  const isAgree = $agreeBox.checked;

  let isFormValid =
    username &&
    pw &&
    pwc &&
    name &&
    $phone1.value &&
    $phone2.value &&
    $phone3.value &&
    isIdChecked &&
    username === validatedId &&
    isValidPassword(pw) &&
    pw === pwc &&
    PHONE_PATTERN.test(phoneNum) &&
    isAgree;

  if (currentRole === "SELLER") {
    const bizNum = ($bizNumberInput?.value || "").trim();
    const storeName = ($storeNameInput?.value || "").trim();
    isFormValid =
      isFormValid &&
      bizNum &&
      BIZ_NUMBER_PATTERN.test(bizNum) &&
      isBizChecked &&
      bizNum === validatedBiz &&
      storeName;
  }

  $signupBtn.disabled = !isFormValid;
}

// ================== 서버 통신 ==================
// 아이디 중복 확인
async function checkDuplicateId() {
  const username = $idInput.value.trim();

  if (!username) {
    showMessage($idInput, VALIDATION_ERROR.REQUIRED);
    isIdChecked = false;
    validatedId = null;
    updateFormValidation();
    return;
  }

  if (!USERNAME_PATTERN.test(username)) {
    showMessage($idInput, VALIDATION_ERROR.INVALID_ID);
    isIdChecked = false;
    validatedId = null;
    updateFormValidation();
    return;
  }

  $idCheckBtn.disabled = true;

  try {
    const res = await fetch(`${BASE_URL}/accounts/validate-username/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username }),
    });
    const data = await res.json();

    if (res.ok) {
      showMessage(
        $idInput,
        data.message || VALIDATION_ERROR.ID_AVAILABLE,
        "success"
      );
      isIdChecked = true;
      validatedId = username;
    } else {
      showMessage($idInput, data.error || VALIDATION_ERROR.ID_DUPLICATE);
      isIdChecked = false;
      validatedId = null;
    }
  } catch {
    showMessage($idInput, VALIDATION_ERROR.SEVER_ERR);
    isIdChecked = false;
    validatedId = null;
  } finally {
    $idCheckBtn.disabled = false;
    updateFormValidation();
  }
}

// 사업자등록번호 인증
async function checkBizNumber() {
  const bizNum = ($bizNumberInput?.value || "").trim();

  if (!bizNum) {
    showMessage($bizNumberInput, VALIDATION_ERROR.REQUIRED);
    isBizChecked = false;
    validatedBiz = null;
    updateFormValidation();
    return;
  }
  if (!BIZ_NUMBER_PATTERN.test(bizNum)) {
    showMessage($bizNumberInput, VALIDATION_ERROR.INVALID_BIZ);
    isBizChecked = false;
    validatedBiz = null;
    updateFormValidation();
    return;
  }

  try {
    const res = await fetch(
      `${BASE_URL}/accounts/seller/validate-registration-number/`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ company_registration_number: bizNum }),
      }
    );
    const data = await res.json();

    if (res.ok) {
      showMessage(
        $bizNumberInput,
        data.message || VALIDATION_ERROR.BIZ_AVAILABLE,
        "success"
      );
      isBizChecked = true;
      validatedBiz = bizNum;
    } else {
      const errMsg =
        data.error ||
        (res.status === 409
          ? VALIDATION_ERROR.BIZ_DUPLICATE
          : VALIDATION_ERROR.BIZ_NEED_AUTH);
      showMessage($bizNumberInput, errMsg);
      isBizChecked = false;
      validatedBiz = null;
    }
  } catch {
    showMessage($bizNumberInput, VALIDATION_ERROR.SEVER_ERR);
    isBizChecked = false;
    validatedBiz = null;
  } finally {
    $bizCheckBtn && ($bizCheckBtn.disabled = false);
    updateFormValidation();
  }
}

// 회원가입 요청
async function createAccount(userData) {
  const url = `${BASE_URL}/accounts/${currentRole.toLowerCase()}/signup/`;
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(userData),
  });

  const data = await res.json();

  if (!res.ok) {
    const pick = (v) => (Array.isArray(v) ? v[0] : v);
    if (data.phone_number) {
      throw { field: "phone", message: pick(data.phone_number) };
    } else {
      const errMsg = data.error || VALIDATION_ERROR.SIGNUP_FAIL;
      throw new Error(errMsg);
    }
  }
  return data;
}

// ================== 공통 유틸 함수 ==================
// 메시지 출력 및 input-error 처리
function showMessage($input, message, type = "error") {
  // $input이 배열이면 각각 처리
  if (Array.isArray($input)) {
    $input.forEach((el) => showMessage(el, message, type));
    return;
  }
  if (!$input) return;
  const $msg = $input.closest(".form-group")?.querySelector(".message");
  if (!$msg) return;

  $msg.textContent = message || "";
  $msg.classList.remove("message-error", "message-success");
  if (message) {
    $msg.classList.add(
      type === "success" ? "message-success" : "message-error"
    );
    if (type === "error") {
      $input.classList.add("input-error");
    } else {
      $input.classList.remove("input-error");
    }
  } else {
    $input.classList.remove("input-error");
  }
}

// 메시지 및 input-error 제거
function clearMessage($input) {
  showMessage($input, "");
}

// 체크 아이콘 on/off 변경
function updateCheckIcon(selector, isActive) {
  const icon = document.querySelector(selector);

  if (icon) {
    const iconState = isActive ? "on" : "off";
    icon.src = `./assets/images/icons/icon-check-${iconState}.svg`;
  }
}

// 이름/스토어명 입력 처리
function handleNameInput($input) {
  checkPreviousFields($input);

  if (!$input.value.trim()) {
    showMessage($input, VALIDATION_ERROR.REQUIRED);
  } else {
    clearMessage($input);
  }
  updateFormValidation();
}

// ================== 이벤트 리스너 ==================
// 탭(구매/판매) 전환
$menuItems.forEach((menuItem) => {
  menuItem.addEventListener("click", () => {
    const btn = menuItem.querySelector("button[data-role]");
    if (!btn) return;

    currentRole = btn.dataset.role;
    $menuItems.forEach((li) => li.classList.remove("on"));
    menuItem.classList.add("on");

    isIdChecked = false;
    validatedId = null;

    toggleSellerSection();
    clearAll();
    updateFormValidation();
  });
});

// form 전체 input 이벤트 위임 (실시간 검증)
$signupForm.addEventListener("input", (e) => {
  const $el = e.target;

  // 아이디 입력
  if ($el === $idInput) {
    const username = $idInput.value.trim();

    if (!username) {
      isIdChecked = false;
      validatedId = null;
      showMessage($idInput, VALIDATION_ERROR.REQUIRED);
    } else if (!USERNAME_PATTERN.test(username)) {
      isIdChecked = false;
      validatedId = null;
      showMessage($idInput, VALIDATION_ERROR.INVALID_ID);
    } else if (username !== validatedId) {
      isIdChecked = false;
      showMessage($idInput, VALIDATION_ERROR.ID_NEED_CHECK);
    } else {
      showMessage($idInput, VALIDATION_ERROR.ID_AVAILABLE, "success");
    }

    updateFormValidation();
  }

  // 비밀번호 입력
  else if ($el === $passwordInput) {
    checkPreviousFields($passwordInput);

    const password = $passwordInput.value;
    const passwordConfirm = $passwordConfirmInput.value;
    const isPasswordMatch =
      isValidPassword(password) &&
      passwordConfirm &&
      password === passwordConfirm;

    updateCheckIcon(".check-img", isValidPassword(password));

    if (!password) {
      showMessage($passwordInput, VALIDATION_ERROR.REQUIRED);
    } else if (!isValidPassword(password)) {
      showMessage($passwordInput, VALIDATION_ERROR.INVALID_PASSWORD);
    } else {
      clearMessage($passwordInput);
    }

    // 비밀번호 재확인 값이 있으면 즉시 검증
    if (passwordConfirm) {
      updateCheckIcon(".recheck-img", isPasswordMatch);

      if (isPasswordMatch) {
        showMessage(
          $passwordConfirmInput,
          VALIDATION_ERROR.PASSWORD_MATCH,
          "success"
        );
      } else {
        showMessage(
          $passwordConfirmInput,
          VALIDATION_ERROR.INVALID_PASSWORD_CONFIRM
        );
      }
    } else {
      clearMessage($passwordConfirmInput);
      updateCheckIcon(".recheck-img", false);
    }

    updateFormValidation();
  }

  // 비밀번호 확인 입력
  else if ($el === $passwordConfirmInput) {
    checkPreviousFields($passwordConfirmInput);

    const password = $passwordInput.value;
    const passwordConfirm = $passwordConfirmInput.value;
    const isPasswordMatch =
      isValidPassword(password) &&
      passwordConfirm &&
      password === passwordConfirm;

    updateCheckIcon(".recheck-img", isPasswordMatch);

    if (!passwordConfirm) {
      showMessage($passwordConfirmInput, VALIDATION_ERROR.REQUIRED);
    } else if (isPasswordMatch) {
      showMessage(
        $passwordConfirmInput,
        VALIDATION_ERROR.PASSWORD_MATCH,
        "success"
      );
    } else {
      showMessage(
        $passwordConfirmInput,
        VALIDATION_ERROR.INVALID_PASSWORD_CONFIRM
      );
    }

    updateFormValidation();
  }

  // 이름 입력
  else if ($el === $nameInput) {
    handleNameInput($nameInput);
  }

  // 핸드폰 번호 입력
  else if ([$phone1, $phone2, $phone3].includes($el)) {
    checkPreviousFields($phone1);

    const phoneNum = `${$phone1.value}${$phone2.value}${$phone3.value}`;

    if (!isFieldFilled) {
      showMessage([$phone1, $phone2, $phone3], VALIDATION_ERROR.REQUIRED);
    } else if (!PHONE_PATTERN.test(phoneNum)) {
      showMessage([$phone1, $phone2, $phone3], VALIDATION_ERROR.INVALID_PHONE);
    } else {
      showMessage([$phone1, $phone2, $phone3], "", "success");
    }
    updateFormValidation();
  }

  // 사업자 번호 입력
  else if ($el === $bizNumberInput) {
    checkPreviousFields($bizNumberInput);

    const bizNum = $bizNumberInput.value;

    if (!bizNum) {
      showMessage($bizNumberInput, VALIDATION_ERROR.REQUIRED);
      isBizChecked = false;
      validatedBiz = null;
    } else if (!BIZ_NUMBER_PATTERN.test(bizNum)) {
      showMessage($bizNumberInput, VALIDATION_ERROR.INVALID_BIZ);
      isBizChecked = false;
      validatedBiz = null;
    } else if (bizNum !== validatedBiz) {
      showMessage($bizNumberInput, VALIDATION_ERROR.BIZ_NEED_AUTH);
      isBizChecked = false;
      validatedBiz = null;
    } else {
      showMessage($bizNumberInput, VALIDATION_ERROR.BIZ_NEED_AUTH, "success");
    }
    updateFormValidation();
  }

  // 스토어 이름 입력
  else if ($el === $storeNameInput) {
    handleNameInput($storeNameInput);
  }
});

// 아이디 중복확인 버튼
$idCheckBtn.addEventListener("click", checkDuplicateId);
// 사업자등록번호 인증 버튼
$bizCheckBtn.addEventListener("click", checkBizNumber);
// 약관 동의 체크박스
$agreeBox.addEventListener("change", updateFormValidation);

// ================== 폼 제출(회원가입) ==================
$signupForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const username = $idInput.value.trim();
  const password = $passwordInput.value;
  const name = $nameInput.value.trim();
  const phoneNum = `${$phone1.value}${$phone2.value}${$phone3.value}`;

  if (!(isIdChecked && username === validatedId)) {
    showMessage($idInput, VALIDATION_ERROR.ID_NEED_CHECK);
    $idInput.focus();
    return;
  }

  if (!$agreeBox.checked) {
    alert("약관에 동의해 주세요.");
    return;
  }

  // 기본 회원가입 데이터 (구매자)
  const userData = {
    username,
    password,
    name,
    phone_number: phoneNum,
  };

  // 판매자라면 사업자번호/스토어명 추가
  if (currentRole === "SELLER") {
    const bizNum = ($bizNumberInput.value || "").trim();
    const storeName = ($storeNameInput.value || "").trim();

    if (!(isBizChecked && bizNum === validatedBiz)) {
      showMessage($bizNumberInput, "사업자등록번호 인증을 완료해주세요.");
      $bizNumberInput.focus();
      return;
    }

    userData.company_registration_number = bizNum;
    userData.store_name = storeName;
  }

  console.log(userData);

  $signupBtn.disabled = true;

  try {
    const result = await createAccount(userData);
    alert("회원가입 완료!");
    setTimeout(() => (location.href = "./login.html"), 800);
  } catch (err) {
    console.log(err);

    if (err.field === "phone") {
      showMessage($phone1, err.message);
    } else {
      const errMsg = err.message || VALIDATION_ERROR.SIGNUP_FAIL;
      alert(errMsg);
    }
  } finally {
    updateFormValidation();
  }
});

// ================== 초기화 ==================
// 페이지 로드 시 입력/상태 초기화
document.addEventListener("DOMContentLoaded", () => {
  toggleSellerSection();
  clearAll();
  updateFormValidation();
});
