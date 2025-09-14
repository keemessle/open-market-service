// ================== DOM ==================
const BASE_URL = "https://api.wenivops.co.kr/services/open-market";
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
let currentRole = "BUYER";
let isIdChecked = false;
let validatedId = null;

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
  $phone1, // 전화번호는 첫 번째 필드만 체크
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

// ================== 유틸 & 검증 함수 ==================

function showMessage($input, message, type = "error") {
  if (!$input) return;
  const $msg = $input.closest(".form-group")?.querySelector(".message");
  if (!$msg) return;
  $msg.textContent = message || "";
  $msg.classList.remove("message-error", "message-success");
  if (message) {
    $msg.classList.add(
      type === "success" ? "message-success" : "message-error"
    );
  }
}

function clearMessage($input) {
  showMessage($input, "");
  $input.classList.remove("input-error");
}

function isValidPassword(password) {
  return PASSWORD_PATTERN.test(password || "");
}

function isPhoneFilled() {
  return $phone1.value && $phone2.value && $phone3.value;
}

function isFieldFilled($fieldElement) {
  if (!$fieldElement) return true;

  // 전화번호 첫 번째 필드의 경우, 세 필드 모두 확인
  if ($fieldElement === $phone1) {
    return $phone1.value && $phone2.value && $phone3.value;
  }

  return $fieldElement.value.trim() !== "";
}

function getCurrentFieldOrder() {
  return currentRole === "SELLER" ? SELLER_FIELD_ORDER : BUYER_FIELD_ORDER;
}

function checkPreviousFields($currentField) {
  const fieldOrder = getCurrentFieldOrder();
  const currentFieldIndex = fieldOrder.indexOf($currentField);

  if (currentFieldIndex === -1) return true; // 현재 필드가 순서에 없으면 통과

  let allPrevFilled = true;
  // 현재 필드보다 앞선 필드들 확인
  for (let i = 0; i < currentFieldIndex; i++) {
    const $previousField = fieldOrder[i];
    if (!isFieldFilled($previousField)) {
      // 비어있는 이전 필드에 오류 메시지 표시
      console.log("비어있는 필드:", $previousField.id);
      showMessage($previousField, "필수 정보입니다.");
      allPrevFilled = false; // return하지 않고 계속 진행 → 비어있는 입력창 중 첫번째 창만 표시 (수정)
    }
  }
  return allPrevFilled;
}

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
}

function toggleSellerSection() {
  const show = currentRole === "SELLER";
  if ($sellerBox) $sellerBox.hidden = !show;

  if (!show) {
    // BUYER로 전환 시 SELLER 상태/값 리셋
    isBizChecked = false;
    validatedBiz = null;
    if ($bizNumberInput) $bizNumberInput.value = "";
    if ($storeNameInput) $storeNameInput.value = "";
    clearMessage($bizNumberInput);
    clearMessage($storeNameInput);
  }
}

// ================== 버튼 활성화 종합 판정 ==================
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
async function checkDuplicateId() {
  const username = $idInput.value.trim();

  // 로컬 형식 검증
  if (!username) {
    showMessage($idInput, "필수 정보입니다.");
    isIdChecked = false;
    validatedId = null;
    updateFormValidation();
    return;
  }

  if (!USERNAME_PATTERN.test(username)) {
    showMessage(
      $idInput,
      "ID는 20자 이내의 영어 대·소문자, 숫자만 가능합니다."
    );
    $idInput.classList.add("input-error");
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
      // 200
      showMessage(
        $idInput,
        data.message || "사용 가능한 아이디입니다.",
        "success"
      );
      $idInput.classList.remove("input-error");
      isIdChecked = true;
      validatedId = username;
      console.log(isIdChecked, validatedId); // 확인
    } else {
      showMessage($idInput, data.error || "이미 사용 중인 아이디입니다.");
      $idInput.classList.add("input-error");
      isIdChecked = false;
      validatedId = null;
    }
  } catch {
    showMessage(
      $idInput,
      "아이디 확인 중 오류가 발생했습니다. 다시 시도해주세요."
    );
    isIdChecked = false;
    validatedId = null;
  } finally {
    $idCheckBtn.disabled = false;
    updateFormValidation();
  }
}

async function checkBizNumber() {
  const bizNum = ($bizNumberInput?.value || "").trim();

  if (!bizNum) {
    showMessage($bizNumberInput, "필수 정보입니다.");
    isBizChecked = false;
    validatedBiz = null;
    updateFormValidation();
    return;
  }
  if (!BIZ_NUMBER_PATTERN.test(bizNum)) {
    showMessage($bizNumberInput, "사업자등록번호는 10자리 숫자여야 합니다.");
    $bizNumberInput.classList.add("input-error");
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
      // 200
      showMessage(
        $bizNumberInput,
        data.message || "사용 가능한 사업자등록번호입니다.",
        "success"
      );
      $bizNumberInput.classList.remove("input-error");
      isBizChecked = true;
      validatedBiz = bizNum;
    } else {
      const errMsg =
        data.error ||
        (res.status === 409
          ? "이미 등록된 사업자등록번호입니다."
          : "사업자등록번호를 다시 확인해주세요.");
      showMessage($bizNumberInput, errMsg);
      $bizNumberInput.classList.add("input-error");
      isBizChecked = false;
      validatedBiz = null;
    }
  } catch {
    showMessage($bizNumberInput, "사업자등록번호 확인 중 오류가 발생했습니다.");
    isBizChecked = false;
    validatedBiz = null;
  } finally {
    $bizCheckBtn && ($bizCheckBtn.disabled = false);
    updateFormValidation();
  }
}

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
      const errMsg =
        data.error || "회원가입에 실패했습니다. 다시 시도해주세요.";
      throw new Error(errMsg);
    }
  }
  return data;
}

// ================== 이벤트 리스너 ==================
// ----- 탭 전환
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

// ----- 아이디 입력
$idInput.addEventListener("input", () => {
  const username = $idInput.value.trim();

  if (!username) {
    isIdChecked = false;
    validatedId = null;
    showMessage($idInput, "필수 정보입니다.");
  } else if (!USERNAME_PATTERN.test(username)) {
    isIdChecked = false;
    validatedId = null;
    showMessage(
      $idInput,
      "ID는 20자 이내의 영어 대·소문자, 숫자만 가능합니다."
    );
    $idInput.classList.add("input-error");
  } else if (username !== validatedId) {
    isIdChecked = false;
    showMessage($idInput, "아이디 중복 확인해 주세요.");
    $idInput.classList.remove("input-error");
  } else {
    showMessage($idInput, "사용 가능한 아이디입니다.", "success");
    $idInput.classList.remove("input-error");
  }

  updateFormValidation();
});
$idCheckBtn.addEventListener("click", checkDuplicateId);

// ----- 비밀번호 입력
$passwordInput.addEventListener("input", () => {
  checkPreviousFields($passwordInput);

  const password = $passwordInput.value;
  const checkIcon = document.querySelector(".check-img");

  if (checkIcon)
    checkIcon.src = isValidPassword(password)
      ? "../../assets/images/icons/icon-check-off.svg"
      : "../../assets/images/icons/icon-check-on.svg";

  if (!password) {
    showMessage($passwordInput, "필수 정보입니다.");
  } else if (!isValidPassword(password)) {
    showMessage(
      $passwordInput,
      "비밀번호는 8자 이상, 영문과 숫자를 포함해야 합니다."
    );
    $passwordInput.classList.add("input-error");
  } else {
    clearMessage($passwordInput);
  }

  updateFormValidation();
});

// ----- 비밀번호 재확인 입력
$passwordConfirmInput.addEventListener("input", () => {
  checkPreviousFields($passwordConfirmInput);

  const password = $passwordInput.value;
  const passwordConfirm = $passwordConfirmInput.value;
  const isPasswordMatch =
    isValidPassword(password) &&
    passwordConfirm &&
    password === passwordConfirm;
  const recheckIcon = document.querySelector(".recheck-img");

  if (recheckIcon)
    recheckIcon.src = isPasswordMatch
      ? "../../assets/images/icons/icon-check-on.svg"
      : "../../assets/images/icons/icon-check-off.svg";

  if (!passwordConfirm) {
    showMessage($passwordConfirmInput, "필수 정보입니다.");
  } else if (isPasswordMatch) {
    showMessage($passwordConfirmInput, "비밀번호가 일치합니다.", "success");
    $passwordConfirmInput.classList.remove("input-error");
  } else {
    showMessage($passwordConfirmInput, "비밀번호가 일치하지 않습니다.");
    $passwordConfirmInput.classList.add("input-error");
  }

  updateFormValidation();
});

// ----- 이름 입력
$nameInput.addEventListener("input", () => {
  checkPreviousFields($nameInput);

  if (!$nameInput.value.trim()) {
    showMessage($nameInput, "필수 정보입니다.");
  } else {
    clearMessage($nameInput);
  }
  updateFormValidation();
});

// ----- 핸드폰 번호 입력
[$phone1, $phone2, $phone3].forEach(($el) => {
  $el.addEventListener("input", () => {
    checkPreviousFields($phone1);

    const phoneNum = `${$phone1.value}${$phone2.value}${$phone3.value}`;

    if (!isFieldFilled) {
      showMessage($phone1, "필수 정보입니다.");
    } else if (!PHONE_PATTERN.test(phoneNum)) {
      showMessage($phone1, "01*로 시작하는 10~11자리 숫자여야 합니다.");
      [$phone1, $phone2, $phone3].forEach((el) =>
        el.classList.add("input-error")
      );
    } else {
      showMessage($phone1, "", "success");
      [$phone1, $phone2, $phone3].forEach((el) =>
        el.classList.remove("input-error")
      );
    }
    updateFormValidation();
  });
});

// ----- 사업자번호 입력 (판매자)
$bizNumberInput.addEventListener("input", () => {
  checkPreviousFields($bizNumberInput);

  const bizNum = $bizNumberInput.value;

  if (!bizNum) {
    showMessage($bizNumberInput, "필수 정보입니다.");
    isBizChecked = false;
    validatedBiz = null;
  } else if (!BIZ_NUMBER_PATTERN.test(bizNum)) {
    showMessage($bizNumberInput, "사업자등록번호는 10자리 숫자여야 합니다.");
    $bizNumberInput.classList.add("input-error");
    isBizChecked = false;
    validatedBiz = null;
  } else if (bizNum !== validatedBiz) {
    showMessage($bizNumberInput, "인증을 다시 진행해주세요.");
    $bizNumberInput.classList.add("input-error");
    isBizChecked = false;
    validatedBiz = null;
  } else {
    showMessage($bizNumberInput, "인증 완료된 번호입니다.", "success");
    $bizNumberInput.classList.remove("input-error");
  }
  updateFormValidation();
});
$bizCheckBtn?.addEventListener("click", checkBizNumber);

// ----- 스토어 이름 (판매자)
$storeNameInput.addEventListener("input", () => {
  checkPreviousFields($storeNameInput);

  if (!$storeNameInput.value.trim()) {
    showMessage($storeNameInput, "필수 정보입니다.");
  } else {
    clearMessage($storeNameInput);
  }
  updateFormValidation();
});

// ----- 약관 동의
$agreeBox.addEventListener("change", updateFormValidation);

// ----- 제출
$signupForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const username = $idInput.value.trim();
  const password = $passwordInput.value;
  const name = $nameInput.value.trim();
  const phoneNum = `${$phone1.value}${$phone2.value}${$phone3.value}`;

  if (!(isIdChecked && username === validatedId)) {
    showMessage($idInput, "아이디 중복 확인을 해주세요.");
    $idInput.focus();
    return;
  }
  if (!$agreeBox.checked) {
    alert("약관에 동의해 주세요."); // 전역 안내는 alert/토스트가 직관적
    return;
  }

  const userData = {
    username,
    password,
    name,
    phone_number: phoneNum,
  };

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

  $signupBtn.disabled = true;
  try {
    const result = await createAccount(userData);
    alert("회원가입 완료!");
    setTimeout(() => (location.href = "../../login.html"), 800);
  } catch (err) {
    console.log(err);

    if (err.field === "phone") {
      showMessage($phone1, err.message);
    } else {
      const errMsg =
        err.message || "회원가입에 실패했습니다. 다시 시도해주세요.";
      alert(errMsg);
    }
  } finally {
    updateFormValidation();
  }
});

// ----- 초기화
document.addEventListener("DOMContentLoaded", () => {
  toggleSellerSection();
  clearAll();
  updateFormValidation();
});
