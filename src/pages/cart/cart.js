/* 공통 영역 시작 */
import { UserSession  } from "../../services/UserSession.js";
import { createHeader } from "../../components/header.js";
import { createFooter } from "../../components/footer.js";
import { showModal    } from "../../components/modal.js";

// header & footer 넣기
createHeader();
createFooter();

// 로그인 상태 가져오기
const userSession             = new UserSession();
let isLoggedIn                = userSession.isAuthed();
let userRole                  = userSession.getRole();
let accessToken;

/* 공통 영역 끝 */

// 변수 선언
const API_URL                 = "https://api.wenivops.co.kr/services/open-market";
const CART_API_URL            = `${API_URL}/cart/`;

const $cartListBody           = document.getElementById("cart-list-body");
const $selectAll              = document.getElementById("select-all");

const $cartSummary            = document.getElementById("cart-summary");
const $cartTotProductAmount   = document.getElementById("cart-tot-product-amount");
const $cartTotProductDiscount = document.getElementById("cart-tot-product-discount");
const $cartTotMethodAmount    = document.getElementById("cart-tot-method-amount");
const $cartTotAmount          = document.getElementById("cart-tot-amount");

const $cartEmpty              = document.getElementById("cart-empty");

let cartTotProductAmount      = 0;
let cartTotProductDiscount    = 0;
let cartTotMethodAmount       = 0;
let cartTotAmount             = 0;

// API 호출
/**
 * 장바구니 조회 API
 */
async function getCartList() {
    if (userRole === "SELLER") {
            return alert("판매자는 이용하실 수 없습니다.");
    }        

    // 토큰 재발급.
    accessToken    = await userSession.refreshAccessToken();
    
    try {
        const res  = await fetch(CART_API_URL, {            
            method: "GET", 
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                "Content-Type" : "application/json",
            }
        });

        if (!res.ok) throw new Error('오류 발생!', res.status);
        const data = await res.json();

        if (data.count === 0) {
            isCartEmpty(true);
            return;
        }
        else {
            isCartEmpty(false);
        }

        createCartList(data["results"]);
        
    } catch (err) {
        alert("서버에서 오류가 발생하였습니다.");
    }
}

/**
 * 장바구니 수량 수정 API
 * @param   {HTMLElement} 현재 row
 * @param   {Boolean}     수량 증가시 true, 수량 감소시 false
 * @returns {Boolean}     API 호출 성공 시 true, 실패 시 false 반환
 */
async function modifyCart($row, state) {
    const cartItemId           = parseInt($row.dataset.cartItemId);
    const $tempProductQuantity = $row.querySelector("[id^='product-quantity']");            
    let   productQuantity      = state ? parseInt($tempProductQuantity.value) + 1 : parseInt($tempProductQuantity.value) - 1;

    let cartData               = new Object();  
    
    // 수량 추가
    cartData.quantity          = productQuantity;

    try{
        // 토큰 재발급.
        accessToken                = await userSession.refreshAccessToken();
            
        const response         = await fetch(`${CART_API_URL}${cartItemId}/`, {            
            method: "PUT", 
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                "Content-Type" : "application/json",
            },
            body: JSON.stringify(cartData)
        })

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return true;

    } catch(err) {
        alert("서버에서 오류가 발생하였습니다.");
        console.log(err);
        return false;
    }    
}

/**
 * 장바구니 상품 삭제 API
 * @param   {HTMLElement} 현재 row
 * @returns {Boolean}     API 호출 성공 시 true, 실패 시 false 반환
 */
async function deleteCart($row) {
    const cartItemId    = parseInt($row.dataset.cartItemId);
    let cartData        = new Object();    
    
    // 토큰 재발급.
    accessToken         = await userSession.refreshAccessToken();

    try{
        const response  = await fetch(`${CART_API_URL}${cartItemId}/`, {            
            method: "DELETE", 
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                "Content-Type" : "application/json",
            },
            body: JSON.stringify(cartData)
        })

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return true;

    } catch(err) {
        alert("서버에서 오류가 발생하였습니다.");
        console.log(err);
        return false;
    }    
}

// 이벤트
// 장바구니 전체 조회 API
window.addEventListener("DOMContentLoaded", getCartList);

// 테이블 상단 체크박스 클릭 이벤트
$selectAll.addEventListener("click", function(e) {
    const chkBoxList       = $cartListBody.querySelectorAll("input[type='checkbox']");    

    chkBoxList.forEach((chkBox)=>{  
        const $row         = chkBox.closest("tr");

        if (e.target.checked !== true) {
            chkBox.checked = false;
        }
        else {
            chkBox.checked = true;            
        }
    });

    calTotAmount();
});


// 기타 함수
/**
 * 상품 리스트 동적 생성
 * @param {JSON} results 
 */
function createCartList(results) {

    for(let i=0; i<results.length; i++) {
        let data                 = results[i];

        let productTotAmount                         = data.product.price * data.quantity;       

        // DOM 선언
        let $tr                      = document.createElement("tr");
        let $tdChkBox                = document.createElement("td")
        let $inputChkBox             = document.createElement("input");
            
        let $tdArticle               = document.createElement("td");
        let $article                 = document.createElement("article");
        let $img                     = document.createElement("img");
        let $hgroup                  = document.createElement("hgroup");
        let $productId               = document.createElement("p");
        let $brandName               = document.createElement("p");
        let $productName             = document.createElement("h3");
        let $productAmount           = document.createElement("p");
        let $productMethod           = document.createElement("small");
        let $productMethodAmount     = document.createElement("small");
    
        let $tdFieldset              = document.createElement("td");
        let $fieldset                = document.createElement("fieldset");
        let $btnDec                  = document.createElement("button");
        let $productQuantity         = document.createElement("input");
        let $btnAdd                  = document.createElement("button");
    
        let $tdOrder                 = document.createElement("td");
        let $output                  = document.createElement("output");
        let $btnBuy                  = document.createElement("button");
    
        let $tdDelete                = document.createElement("td");
        let $btnDelete               = document.createElement("button");

        // 속성 설정
        // row 데이터셋 설정 (상품ID)
        $tr.dataset.productId        = data.product.id;
        $tr.dataset.cartItemId       = data.id;
   
        $tdArticle.className         = "cart-list-detail";

        $tdArticle.addEventListener("click", function(e) {
            const $row               = e.target.closest("tr");
            const productId          = parseInt($row.dataset.productId);
   
            location.href            = `./product-detail.html?id=${productId}`
        });

        // 체크박스
        $inputChkBox.setAttribute("type", "checkbox");

        $inputChkBox.addEventListener("click", function(e) {
            const $row              = e.target.closest("tr");            

            if (e.target.checked == false) {
                $selectAll.checked     = false;
            }
            else {
                const chkBoxList       = $cartListBody.querySelectorAll("input[type='checkbox']");
                let chkAllToken        = true;
                chkBoxList.forEach((chkBox)=>{
                    if (chkBox.checked === false) {
                        chkAllToken    = false;
                        return;
                    }
                })
                if (chkAllToken === true) {
                    $selectAll.checked = true;
                }
            }

            calTotAmount();
        })

        // 이미지
        $img.src                                = data.product.image;
        $img.alt                                = `${data.product.name} 상품 이미지`;
        $img.id                                 = `product-image${i}`;
     
        // 상품ID     
        $productId.className                    = "hide";
        $productId.id                           = `product-id${i}`;
        $productId.innerText                    = data.product.id;
     
        // 브랜드명     
        $brandName.id                           = `product-brand${i}`;
        $brandName.innerText                    = data.product.seller.store_name;
     
        // 상품명     
        $productName.id                         = `product-name${i}`;
        $productName.innerText                  = data.product.name;
     
        // 상품재고     
        $productId.className                    = "hide";
        $productId.id                           = `product-stock${i}`;        
        $productId.innerText                    = data.product.stock;
     
        // 상품금액     
        $productAmount.id                       = `product-amount${i}`;
        $productAmount.innerText                = `${formatNumberWithComma(data.product.price)}`;

        // 배송방법
        $productMethod.id                       = `product-method${i}`;

        if (data.product.shipping_method === "PARCEL") {
            $productMethod.innerText            = "택배배송";
        }
        else {
            $productMethod.innerText            = "직접배송"
        }
        
        // 배송료
        $productMethodAmount.id                 = `product-method-amount${i}`;

        if (data.product.shipping_fee === 0) {
            $productMethodAmount.innerText      = "무료배송";
        }
        else {
            $productMethodAmount.innerText      = `${formatNumberWithComma(data.product.shipping_fee)}원`;
        }

        // 주문수량
        $fieldset.className                     = "order-amount";
    
        // 감소 버튼    
        $btnDec.className                       = "order-btn order-btn-decrease";
        $btnDec.id                              = `btn-dec${i}`;
        $btnDec.setAttribute("aria-label", "수량 감소");

        // 수량 감소 버튼 클릭
        $btnDec.addEventListener("click", async function(e) {
            const $row                          = e.target.closest("tr");            
            const productAmount                 = parseInt(onlyNumber($row.querySelector("[id^='product-amount']").innerText));
            const $tempProductQuantity          = $row.querySelector("[id^='product-quantity']");            
            let   productQuantity               = parseInt($tempProductQuantity.value);
            const $tempProductTotAmount         = $row.querySelector("[id^='product-tot-amount']");
            const productStock                  = parseInt($row.querySelector("[id^='product-stock']").innerText);

            if (!isNumber(productQuantity) || productQuantity<2) {        
                return alert("물품 수량이 잘못 되었습니다.");
            }

            let result = await modifyCart($row, false);

            if (result) {

                $tempProductQuantity.value      = --productQuantity;

                // 수량이 1개 이하일 경우, 감소 버튼 비활성화
                validateProductQuantity($row, productQuantity, productStock);

                // 총 갯수 및 금액 계산            
                $tempProductTotAmount.innerText = `${formatNumberWithComma(productQuantity * productAmount)}원`;
            
                calTotAmount();    
            }
        });

        // 감소 버튼 내부 텍스트 요소
        let $orderTextMin                       = document.createElement("p");
        $orderTextMin.className                 = "order-text-min";
        $orderTextMin.textContent               = "상품 수량을 더 이상 내릴 수 없습니다.";
        $btnDec.appendChild($orderTextMin);

        // 주문 수량
        $productQuantity.type                   = "number";
        $productQuantity.id                     = `product-quantity${i}`;
        $productQuantity.value                  = data.quantity;
    
        // 증가 버튼    
        $btnAdd.className                       = "order-btn order-btn-increase";
        $btnAdd.id                              = `btn-add${i}`;
        $btnAdd.setAttribute("aria-label", "수량 증가");

        $btnAdd.addEventListener("click", async function(e) {
            const $row                          = e.target.closest("tr");
            const productAmount                 = parseInt(onlyNumber($row.querySelector("[id^='product-amount']").innerText));
            const $tempProductQuantity          = $row.querySelector("[id^='product-quantity']");            
            let   productQuantity               = parseInt($tempProductQuantity.value);
            const $tempProductTotAmount         = $row.querySelector("[id^='product-tot-amount']");
            const productStock                  = parseInt($row.querySelector("[id^='product-stock']").innerText);

            if (!isNumber(productQuantity)) {        
                return alert("물품 수량이 잘못 되었습니다.");
            }
            else if (productQuantity === productStock) {
                return alert("상품의 재고 수량을 초과하였습니다.");
            }

            let result = await modifyCart($row, true);

            if (result) {

                $tempProductQuantity.value      = ++productQuantity;

                // 수량이 재고와 동일한 경우, 증가 버튼 비활성화
                validateProductQuantity($row, productQuantity, productStock)

                // 총 갯수 및 금액 계산            
                $tempProductTotAmount.innerText = `${formatNumberWithComma(productQuantity * productAmount)}원`; 
            }

            calTotAmount();
        });

        // 증가 버튼 내부 텍스트 요소
        let $orderTextStock         = document.createElement("p");
        $orderTextStock.className   = "order-text-stock";
        $orderTextStock.textContent = "상품의 재고 수량을 초과할 수 없습니다.";
        $btnAdd.appendChild($orderTextStock);

        $tdOrder.className          = "cart-list-order";

        $output.id                  = `product-tot-amount${i}`;

        $btnBuy.className           = "btn btn-s btn-left";
        $btnBuy.textContent         = "주문하기";
        $btnBuy.addEventListener('click', function(e) {
            const $row              = e.target.closest("tr");
            const productId         = parseInt($row.dataset.productId);
            const productQuantity   = parseInt($row.querySelector("[id^='product-quantity']").value);

            addBuy(productId, productQuantity);
        });

        $btnDelete.className        = "btn-del";
        $btnDelete.addEventListener("click", async function(e) {
            const $row              = e.target.closest("tr");            

            let result              = await deleteCart($row);

            if (result) {                
                $row.remove();                
            }

            calTotAmount();

            if($cartListBody.querySelectorAll("tr[data-cart-item-id]").length === 0) {
                isCartEmpty(true);
            }
            else {
                isCartEmpty(false);
            }
        })

        if (data.product.stock === 0) {
            $btnAdd.disabled        = true;
            $output.innerText       = 0;
            $btnBuy.disabled        = true;
        }
        else {
            $productQuantity.value  = data.quantity;            
            $output.innerText       = `${formatNumberWithComma(productTotAmount)}원`;
            $btnBuy.disabled        = false;            
        }

        // DOM 구조 조립
        $tdChkBox.appendChild($inputChkBox);

        $hgroup.appendChild($productId);
        $hgroup.appendChild($brandName);
        $hgroup.appendChild($productName);
        $hgroup.appendChild($productAmount);
        $hgroup.appendChild($productMethod);
        $hgroup.appendChild($productMethodAmount);

        $article.appendChild($img);
        $article.appendChild($hgroup);

        $tdArticle.appendChild($article);

        $fieldset.appendChild($btnDec);
        $fieldset.appendChild($productQuantity);
        $fieldset.appendChild($btnAdd);

        $tdFieldset.appendChild($fieldset);

        $tdOrder.appendChild($output);
        $tdOrder.appendChild($btnBuy);

        $tdDelete.appendChild($btnDelete);

        $tr.appendChild($tdChkBox);
        $tr.appendChild($tdArticle);
        $tr.appendChild($tdFieldset);
        $tr.appendChild($tdOrder);
        $tr.appendChild($tdDelete);

        // 테이블에 추가
        $cartListBody.appendChild($tr);

        // 버튼 비활성화
        validateProductQuantity($tr, data.quantity, data.product.stock);
    };
}

/**
 * 수량이 1보다 크고 재고 개수보다 적은지 확인한다.
 * 수량이 1이면 감소버튼을 비활성화한다.
 * 수량이 재고 개수와 동일하면 증가버튼을 비활성화한다.
 * @param {Number} quantity 
 */
function validateProductQuantity(row, quantity, productStock) {
    const $tempBtnDec = row.querySelector("[id^='btn-dec']")
    const $tempBtnAdd = row.querySelector("[id^='btn-add']")    

    if (quantity === 1) {
        $tempBtnDec.disabled = true;
    }
    else {
        $tempBtnDec.disabled = false;
    }

    if (quantity === productStock) {
        $tempBtnAdd.disabled = true;
    }
    else {
        $tempBtnAdd.disabled = false;
    }
}

/**
 * 개별 주문하기 버튼 클릭 시, 구매목록을 로컬스토리지에 추가하고, 구매하기 페이지로 이동한다.
 * @param {Number} productId
 * @param {Number} productQuantity
 */
function addBuy(productId, productQuantity) {
    // 로컬스토리지 구매목록 초기화
    window.localStorage.removeItem("buyProduct");

    // buyProduct 객체 생성
    let buyData         = new Object();
    buyData.PRODUCT_ID  = productId;
    buyData.QUANTITY    = productQuantity;    

    // 로컬스토리지 구매목록 추가
    window.localStorage.setItem("buyProduct", JSON.stringify(buyData));

    // 구매하기 페이지 이동
    location.href = "./product-buy.html";
}

/**
 * 상품요약 금액 계산.
 * 체크박스의 체크상태가 변경되거나, 체크 된 상품이 삭제되거나, 체크된 상품의 수량 변경 시 호출
 */
function calTotAmount() {
    // 계산 값 초기화
    cartTotProductAmount             = 0;
    // 할인금액 값은 차후 적용
    // cartTotProductDiscount = 0;    
    cartTotMethodAmount              = 0;
    cartTotAmount                    = 0;

    // 행 합계 변수 선언
    let rowTotProductAmount          = 0;
    let rowMethodAmount              = 0;

    Array.from($cartListBody.children).forEach((row) => {
        let rowChkBox                = row.querySelector("input[type='checkbox']")
        if(rowChkBox && rowChkBox.checked) {
            rowTotProductAmount      = onlyNumber(row.querySelector("[id^='product-tot-amount']").value);
            // 할인금액 값은 차후 적용
            // const rowProductDiscount = row.querySelector("[id^='']");
            rowMethodAmount          = onlyNumber(row.querySelector("[id^='product-method-amount']").innerText);
            
            cartTotProductAmount    += rowTotProductAmount;
            cartTotMethodAmount     += rowMethodAmount;
        }
    });    

    cartTotAmount                    = cartTotProductAmount - cartTotProductDiscount + cartTotMethodAmount;
    $cartTotProductAmount.innerText  = formatNumberWithComma(cartTotProductAmount);
    // 할인금액 값은 차후 적용
    //$cartTotProductDiscount    
    $cartTotMethodAmount.innerText   = formatNumberWithComma(cartTotMethodAmount);
    $cartTotAmount.innerText         = formatNumberWithComma(cartTotAmount);
}

/**
 * 장바구니 목록 숨김 처리
 * @param {Boolean} empty 장바구니에 상품이 있으면 true, 없으면 false
 */
function isCartEmpty(empty) {
    if (empty) {
        $cartListBody.classList.add("hide");
        $cartSummary.classList.add("hide");
        $cartEmpty.classList.remove("hide");
    }
    else {
        $cartListBody.classList.remove("hide");
        $cartSummary.classList.remove("hide");
        $cartEmpty.classList.add("hide");
    }
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