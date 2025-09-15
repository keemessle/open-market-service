/* 공통 영역 시작 */
import { UserSession  } from "../../services/UserSession.js";
import { createHeader } from "../../components/header.js";
import { createFooter } from "../../components/footer.js";
import { showModal    } from "../../components/modal.js";

// header & footer 넣기
createHeader();
createFooter();

// 로그인 상태 가져오기
const userSession            = new UserSession();
let isLoggedIn               = userSession.isAuthed();
let userRole                 = userSession.getRole();
let accessToken;

/* 공통 영역 끝 */

// 변수 선언
const url                    = new URL(location.href);
const productId              = url.searchParams.get("id");
const API_URL                = "https://api.wenivops.co.kr/services/open-market";
const DETAIL_API_URL         = `${API_URL}/products/${productId}`
const CART_API_URL           = `${API_URL}/cart/`
let   productStock           = 0;
let   productAmount          = 0;
let   productDeliveryFee     = 0;

// const $productAbstract       = document.getElementById("product-abstract");
const $productImage          = document.getElementById("product-image");
const $productImageSoldout   = document.getElementById("product-image-soldout");
const $productBrand          = document.getElementById("product-brand");
const $productName           = document.getElementById("product-name");
const $productAmount         = document.getElementById("product-amount");
const $productShoppingMethod = document.getElementById("product-shopping-method");

const $btnDec                = document.getElementById("btn-dec");
const $productQuantity       = document.getElementById("product-quantity")
const $btnAdd                = document.getElementById("btn-add");

const $productTotQuantity    = document.getElementById("product-tot-quantity");
const $productTotAmount      = document.getElementById("product-tot-amount");

const $btnBuy                = document.getElementById("btn-buy");
const $btnCart               = document.getElementById("btn-cart");

const $tabArea               = document.getElementById("tab-area");

const $productInfo           = document.getElementById("product-info");


// API 호출
async function getProductDetail() {
    try {
        const res = await fetch(DETAIL_API_URL);
        if (!res.ok) throw new Error('오류 발생!', res.status);
        const data = await res.json();

        $productImage.setAttribute("src",data.image);
        $productBrand.innerText              = data.seller.store_name;
        $productName.innerText               = data.name;
        $productAmount.innerText             = `${formatNumberWithComma(data.price)}`;
        productAmount                        = data.price;
        productDeliveryFee                   = data.shipping_fee;
        productStock                         = data.stock;
        $productInfo.innerHTML               = data.info;
        
        if (productDeliveryFee === 0) {
            $productShoppingMethod.innerText = "무료배송";
        }
        else {
            $productShoppingMethod.innerText = `택배배송 (배송료 ${formatNumberWithComma(productDeliveryFee)}원)`;
        }

        if (userRole === "SELLER") {
            $btnAdd.disabled                 = true;
            $btnDec.disabled                 = true;
            $btnBuy.disabled                 = true;
            $btnCart.disabled                = true;
        }
        else if (productStock === 0) {
            $btnAdd.disabled                 = true;
            $productTotAmount.innerText      = 0;
            $productImageSoldout.classList.add("product-image-soldout-active");
            $btnBuy.disabled                 = true;
            $btnCart.disabled                = true;
        }
        else {
            $productQuantity.value           = 1;
            $productTotQuantity.innerText    = 1;
            $productTotAmount.innerText      = formatNumberWithComma(productAmount + productDeliveryFee);
            $btnBuy.disabled                 = false;
            $btnCart.disabled                = false;
        }
    } catch (err) {
        // 에러 페이지 이동
        location.href = "./404.html";
    }
}

async function addCart() {
    let cartData        = new Object();
    cartData.product_id = onlyNumber(productId);
    cartData.quantity   = onlyNumber($productTotQuantity.innerText);
    
    // 토큰 재발급.
    accessToken     = await userSession.refreshAccessToken();

    try{
        const response  = await fetch(CART_API_URL, {            
            method: "POST", 
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                "Content-Type" : "application/json",
            },
            body: JSON.stringify(cartData)
        })

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        alert("장바구니에 물건이 담겼습니다.");

        // 장바구니 페이지 이동
        location.href    = "./cart.html";
    } catch(err) {
        console.log(err);
        alert("서버에서 오류가 발생하였습니다.");
    }    
}
    
// 이벤트
// API 호출
window.addEventListener("DOMContentLoaded", getProductDetail);

// 수량 감소 버튼 클릭
$btnDec.addEventListener("click", function(e) {
    let productQuantity    = parseInt($productQuantity.value);

    if (!isNumber(productQuantity) || productQuantity<2) {        
        return alert("물품 수량이 잘못 되었습니다.");
    }

    $productQuantity.value = --productQuantity;

    // 수량이 1개 이하일 경우, 감소 버튼 비활성화
    validateProductQuantity(productQuantity);

    // 총 갯수 및 금액 계산
    $productTotQuantity.innerText = formatNumberWithComma(productQuantity);
    $productTotAmount.innerText = formatNumberWithComma(productQuantity * productAmount + productDeliveryFee);
});

// 수량 증가 버튼 클릭
$btnAdd.addEventListener("click", function(e) {
    let productQuantity = parseInt($productQuantity.value);    

    if (!isNumber(productQuantity)) {        
        return alert("물품 수량이 잘못 되었습니다.");
    }
    else if (productQuantity === productStock) {
        return alert("상품의 재고 수량을 초과하였습니다.");
    }

    $productQuantity.value = ++productQuantity;

    // 수량이 재고와 동일한 경우, 증가 버튼 비활성화
    validateProductQuantity(productQuantity)

    // 총 갯수 및 금액 계산
    $productTotQuantity.innerText = formatNumberWithComma(productQuantity);
    $productTotAmount.innerText   = formatNumberWithComma(productQuantity * productAmount + productDeliveryFee);
});

// 바로 구매 버튼 클릭
$btnBuy.addEventListener("click", function(e) {
    if(!isLoggedIn) {
        let modalNotice = "로그인이 필요한 서비스입니다.\n로그인 하시겠습니까?";
        showModal(e, modalNotice, callbackLoginModal);
        return;
    }

    // 물품구매 물건 넣기
    addBuy();    
});

// 장바구니 버튼 클릭
$btnCart.addEventListener("click", function(e) {
    if(!isLoggedIn) {
        let modalNotice = "로그인이 필요한 서비스입니다.\n로그인 하시겠습니까?";
        showModal(e, modalNotice, callbackLoginModal);
        return;
    }

    // 장바구니 물건 넣기
    addCart();
    // 임시페이지 연결
    
});

// 탭 버튼 클릭
$tabArea.addEventListener("click", function(e) {
    if (e.target.tagName !== "BUTTON") return;
    
    const $activeBtn     = $tabArea.querySelector(".product-tabs-tab-active");
    const $activeContent = document.querySelector($activeBtn.dataset.target);

    // 숨김처리
    $activeBtn.classList.remove("product-tabs-tab-active");
    $activeContent.classList.add("hide");

    // 활성화처리
    const $newBtn     = e.target;
    const $newContent = document.querySelector($newBtn.dataset.target);

    $newBtn.classList.add("product-tabs-tab-active");
    $newContent.classList.remove("hide");
});


// 기타 함수
/**
 * 수량이 1보다 크고 재고 개수보다 적은지 확인한다.
 * 수량이 1이면 감소버튼을 비활성화한다.
 * 수량이 재고 개수와 동일하면 증가버튼을 비활성화한다.
 * @param {Number} quantity 
 */
function validateProductQuantity(quantity) {
    if (quantity === 1) {
        $btnDec.disabled = true;
    }
    else {
        $btnDec.disabled = false;
    }

    if (quantity === productStock) {
        $btnAdd.disabled = true;
    }
    else {
        $btnAdd.disabled = false;
    }
}

/**
 * 로그인모달 콜백. 로그인 페이지로 이동
 *
 */
function callbackLoginModal() {
    window.location.href = "../../login.html";
}

/**
 * 바로 구매 버튼 클릭 시, 구매목록을 로컬스토리지에 추가하고, 구매하기 페이지로 이동한다.
 * 
 */
function addBuy() {
    // 로컬스토리지 구매목록 초기화
    window.localStorage.removeItem("buyProduct");

    // buyProduct 객체 생성
    let buyData         = new Object();
    buyData.PRODUCT_ID  = productId;
    buyData.QUANTITY    = onlyNumber($productTotQuantity.innerText);
    buyData.TOTAL_PRICE = onlyNumber($productTotAmount.innerText);

    // 로컬스토리지 구매목록 추가
    window.localStorage.setItem("buyProduct", JSON.stringify(buyData));

    // 구매하기 페이지 이동
    location.href = "./product-buy.html";
}


// 공통 함수
/**
 * num이 숫자면 true, 그 외면 false를 반환 
 * @param {Number} num 
 * @returns Boolean
 */
function isNumber(num) {
    if (num === undefined) return false;
    if (isNaN(num))        return false;
    return true;
}

/**
 * 숫자 세자리마다 콤마 입력
 * @param {Number} num 
 * @returns String
 */
function formatNumberWithComma(num) {
    let str = String(num);
    return str.replace(/(\d)(?=(?:\d{3})+(?!\d))/g, '$1,');
}

/**
 * 숫자만 남기기
 * @param {String} str
 * @returns Number
 */
function onlyNumber(str) {
    return parseInt(str.replace(/[^0-9]/g, ""));
}