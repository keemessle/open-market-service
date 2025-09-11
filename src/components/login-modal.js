// 모달 이벤트 설정 함수
function setupLoginModal() {
  const loginModal = document.getElementById("login-modal");
  const modalCloseBtn = document.getElementById("btn-close");
  const btnContainer = loginModal.querySelector(".btn-container");

  function handleClickClose(e) {
    if (!e.target.closest("#btn-close")) return;
    loginModal.close();
    document.removeEventListener("click", handleClickClose);
  }

  function handleClickYesNo(e) {
    if (e.target.closest("#btn-yes")) {
      window.location.href = "./login.html";
    }
    else if (e.target.closest("#btn-no")) {
      loginModal.close();
    }
    document.removeEventListener("click", handleClickYesNo);
  }

  // 바깥 클릭시 닫기
  function handleClickOutside(e) {
    if (e.target !== loginModal && !loginModal.contains(e.target)) {      
      loginModal.close();      
      document.removeEventListener("click", handleClickOutside);
    }
  }

  modalCloseBtn.addEventListener("click",handleClickClose);
  btnContainer.addEventListener("click",handleClickYesNo);
  document.addEventListener("click", handleClickOutside);  
}

/**
 * 로그인 모달 로드 및 표시 함수.
 * 로그인 모달이 body 가장 아래 영역에 생성되며, 모달창이 호출 됨.
 * @param {Event} event 
 */
async function showLoginModal(event=null) {
  // 모달이 이미 있는지 확인
  if (!document.getElementById("login-modal")) {
    // 모달 HTML 로드
    const response = await fetch('./login-modal.html');
    const html = await response.text();
    document.body.insertAdjacentHTML('beforeend', html);
  }

  // 이벤트 버블링 중지 (바로 닫히는 기능 방지)
  if(event) event.stopPropagation();

  // 이벤트 설정
  setupLoginModal();

  // 모달 표시  
  document.getElementById("login-modal").show();
  
}

export { showLoginModal };