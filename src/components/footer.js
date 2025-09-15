export function createFooter() {
  let existFooter = document.querySelector("footer");
  if (existFooter) return;

  const $footer = document.createElement("footer");
  document.body.append($footer);

  $footer.innerHTML = `
    <div class="footer-container container">
      <div class="links-container">
        <ul class="footer-links">
          <li><a href="">호두샵 소개</a></li>
          <li><a href="">이용약관</a></li>
          <li><a href=""><span class="font-bold">개인정보처리방침</span></a></li>
          <li><a href="">전자금융거래약관</a></li>
          <li><a href="">청소년보호정책</a></li>
          <li><a href="">제휴문의</a></li>
        </ul>
        <ul class="footer-sns">
          <li><a class="link-insta" href="https://www.instagram.com/" aria-label="인스타그램 바로가기"></a></li>
          <li><a class="link-fb" href="https://www.facebook.com/" aria-label="페이스북 바로가기"></a></li>
          <li><a class="link-yt" href="https://www.youtube.com/" aria-label="유튜브 바로가기"></a></li>
        </ul>
      </div>
      <div class="divider"></div>
      <div class="footer-info">
        <p><span class="font-bold">(주)HODU SHOP</span></p>
        <p>제주특별자치도 제주시 동광고 137 제주코딩베이스캠프</p>
        <p>사업자 번호 : 000-0000-0000 | 통신판매업</p>
        <p>대표 : 김호두</p>
      </div>
    </div>
  `;

  return $footer;
}
