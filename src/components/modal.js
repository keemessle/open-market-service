// 모달 이벤트 설정 함수
function setupModal(callbackFunction) {
  const modal    = document.getElementById("modal");
  const modalCloseBtn = document.getElementById("btn-close");
  const btnContainer  = modal.querySelector(".btn-container");

  function handleClickClose(e) {
    if (!e.target.closest("#btn-close")) return;
    modal.close();
    removeEvent();
  }

  async function handleClickYesNo(e) {
    if (e.target.closest("#btn-yes")) {
      // 콜백함수 호출
      if(callbackFunction && typeof callbackFunction === "function"){
        await callbackFunction();        
      }
      modal.close();
    }
    else if (e.target.closest("#btn-no")) {
      modal.close();

    }
    removeEvent();
  }

  // 바깥 클릭시 닫기
  function handleClickOutside(e) {
    if (e.target !== modal && !modal.contains(e.target)) {      
      modal.close();      
      removeEvent();
    }
  }

  // ESC 클릭시 닫기
  function handleEscKey(e) {
    if (e.key === 'Escape') {
      modal.close();
      removeEvent();
    }
  }

  // 모달 이벤트 제거 함수
  function removeEvent() {
    modalCloseBtn.removeEventListener("click", handleClickClose);
    btnContainer.removeEventListener("click" , handleClickYesNo);
    document.removeEventListener("click"     , handleClickOutside);
    document.removeEventListener("keydown"   , handleEscKey);
  }

  modalCloseBtn.addEventListener("click", handleClickClose);
  btnContainer.addEventListener("click" , handleClickYesNo);
  document.addEventListener("click"     , handleClickOutside);
  document.addEventListener("keydown"   , handleEscKey);
  
}

/**
 * 모달이 body 가장 아래 영역에 생성되며, 모달창이 호출 됨.
 * event : 모달 호출 객체, notice : 모달창 안내 문구, callbackFunction : 예 버튼 클릭 시 호출 함수
 * @param {Event} event 
 * @param {String} notice
 * @param {Function} callbackFunction
 */
async function showModal(event=null, notice="", callbackFunction=null) {
  // 모달이 이미 있는지 확인
  if (!document.getElementById("modal")) {
    // 모달 HTML 로드
    const response = await fetch('./modal.html');
    const html = await response.text();
    document.body.insertAdjacentHTML('beforeend', html);
  }

  // 이벤트 버블링 중지 (바로 닫히는 기능 방지)
  if(event) event.stopPropagation();

  // 이벤트 설정
  setupModal(callbackFunction);

  // 모달 문구 변경
  document.getElementById("modal-notice").innerText = notice;

  // 모달 표시  
  document.getElementById("modal").show();  
}

export { showModal };