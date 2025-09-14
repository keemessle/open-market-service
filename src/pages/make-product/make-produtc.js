import { UserSession } from "../services/UserSession.js";

// ================== DOM ==================
const $form = document.querySelector(".update-form");
const $name = document.querySelector(".product-name");
const $info = document.querySelector(".product-info");
const $image = document.querySelector(".product-image");
const $price = document.querySelector(".product-price");
const $shipping = document.querySelectorAll('input[name="shipping_method"]');
const $fee = document.querySelector(".product-fee");
const $stock = document.querySelector(".product-stock");

const $realUpload = document.querySelector(".real-upload");
const $upload = document.querySelector(".upload");
const $preview = document.querySelector(".img-preview");

const $count = document.querySelector(".count");

const loginSession = new UserSession();
// const access = loginSession.getAccess();

// 권한 가드
// (function guard() {
//   if (!session.isAuthed()) {
//     alert("로그인이 필요합니다.");
//     location.href = "../../login.html";
//     return;
//   }
//   if (session.getRole() !== "SELLER") {
//     alert("이 작업을 수행할 권한(permission)이 없습니다.");
//     history.back();
//   }
// })();

if (!loginSession.isAuthed() && !loginSession.isSeller()) {
  alert("이 작업을 수행할 권한(permission)이 없습니다.");
  history.back();
}

// 유효성 검사
function validateFields($input) {
  // $input.forEach((input) => {
  //   if (!input.value) {
  //     input.focus();
  //     ok = false;
  //     return ok;
  //   }
  // });

  if (!$name.value.trim()) {
    // $name.textContent = '상품명을 입력해주세요.';
    alert("상품명을 입력해 주세요.");
    $name.focus();
    return false;
  }

  if (!$info.value.trim()) {
    alert("상품 정보를 입력해 주세요.");
    $info.focus();
    return false;
  }

  if (!$realUpload.files || !$realUpload.file[0]) {
    alert("파일이 제출되지 않았습니다.");
    $upload.focus();
    return false;
  }

  if (!$price.value.trim()) {
    alert("품 가격을 입력해 주세요.");
    $price.focus();
    return false;
  }

  if (![...$shipping].some((el) => el.checked)) {
    alert("배송 방법을 선택해 주세요.");
    $shipping[0].focus();
    return false;
  }

  if (!$fee.value.trim()) {
    alert("배송비를 입력해 주세요.");
    $fee.focus();
  }
}

async function updateProduct(productData) {
  const url = `${session.baseUrl}/products/`;

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(productData),
    });

    if (!res.ok) throw new Error(res.status);

    const data = await res.json();
    return data;
  } catch (err) {
    console.error(err);
    alert("상품이 등록되지 않았습니다. 다시 시도해주세요.");
  }
}

// 제출
$form.addEventListener("submit", async (e) => {
  e.preventDefault();
});

// 상품 이미지
$upload.addEventListener("click", () => $realUpload.click());
$realUpload.addEventListener("change", () => {
  const imgSrc = URL.createObjectURL($realUpload.files[0]);
  $preview.src = imgSrc;
  $preview.style.cssText = "width: 100%; height: 100%; border-radius: 0;";
});

// 상품명 글자 수
$name.addEventListener("input", (e) => {
  $count.textContent = e.target.value.length;
});

// 모든 input[type="number"]에 toLocalString() 적용
document.querySelectorAll("input.num").forEach((input) => {
  input.addEventListener("input", (e) => {
    const value = e.target.value.replace(/[^0-9]/g, ""); // 기존 콤마 제거
    if (!value) {
      // 숫자값이 아닌 경우, 빈 값으로 만들기
      e.target.value = "";
      return;
    }

    const num = parseInt(value, 10);
    e.target.value = num.toLocaleString();
  });
});
