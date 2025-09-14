import { UserSession } from "../../services/UserSession.js";

// ================== DOM ==================
const $form = document.getElementById("update-form");
const $name = document.getElementById("product-name");
const $info = document.getElementById("product-info");
const $price = document.getElementById("product-price");
const $shipping = document.querySelectorAll('input[name="shipping_method"]');
const $fee = document.getElementById("shipping-fee");
const $stock = document.getElementById("product-stock");

const $realUpload = document.querySelector(".real-upload");
const $upload = document.querySelector(".upload");
const $preview = document.querySelector(".img-preview");

const $count = document.querySelector(".count");

const loginSession = new UserSession();
// const access = loginSession.getAccess();

if (!loginSession.isAuthed() || !loginSession.isSeller()) {
  alert("이 작업을 수행할 권한(permission)이 없습니다.");
  history.back();
}

// 유효성 검사
function validateFields() {
  if (!$name.value.trim()) {
    alert("상품명을 입력해 주세요.");
    $name.focus();
    return false;
  }

  if (!$info.value.trim()) {
    alert("상품 정보를 입력해 주세요.");
    $info.focus();
    return false;
  }

  if (!$realUpload.files || !$realUpload.files[0]) {
    alert("파일이 제출되지 않았습니다.");
    $upload.focus();
    return false;
  }

  if (!$price.value.trim()) {
    alert("상품 가격을 입력해 주세요.");
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

  // 정수값 검사
  const price = $price.value.replace(/,/g, "");
  const fee = $fee.value.replace(/,/g, "");
  const stock = $stock.value.replace(/,/g, "");

  if (!/^\d+$/.test(price)) {
    alert("유효한 정수(integer)를 넣어주세요.");
    $price.focus();
    return false;
  }

  if (!/^\d+$/.test(fee)) {
    alert("유효한 정수(integer)를 넣어주세요.");
    $fee.focus();
    return false;
  }

  if (!/^\d+$/.test(stock)) {
    alert("유효한 정수(integer)를 넣어주세요.");
    $stock.focus();
    return false;
  }

  return true;
}

async function updateProduct(formData) {
  const url = `${loginSession.baseUrl}/products/`;

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${loginSession.getAccess()}`,
      },
      body: formData,
    });

    if (!res.ok) throw new Error(res.status);

    const data = await res.json();
    return data;
  } catch (err) {
    console.error(err);
    alert("상품이 등록되지 않았습니다. 다시 시도해주세요.");
  }
}

// 이벤트
// 상품 이미지
$upload.addEventListener("click", () => $realUpload.click());
$realUpload.addEventListener("change", () => {
  console.log($realUpload.files[0]);

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

    const num = Number(value);
    e.target.value = num.toLocaleString();
  });
});

// 제출
$form.addEventListener("submit", async (e) => {
  e.preventDefault();
  if (!validateFields()) return;

  const formData = new FormData();
  formData.append("name", $name.value.trim());
  formData.append("info", $info.value.trim());
  formData.append("image", $realUpload.files[0]);
  formData.append("price", $price.value.replace(/,/g, ""));
  formData.append(
    "shipping_method",
    [...$shipping].find((el) => el.checked)?.value
  );
  formData.append("shipping_fee", $fee.value.replace(/,/g, ""));
  formData.append("stock", $stock.value.replace(/,/g, ""));

  try {
    const res = await updateProduct(formData);
    alert("상품 등록 완료!");
    setTimeout(() => history.back(), 800);
    console.log(res);
  } catch (err) {
    console.error(err);
    alert("상품 등록에 실패했습니다. 다시 시도해 주세요.");
  }
});
