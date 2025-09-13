import { createHeader } from "../../components/header.js";
import { createFooter } from "../../components/footer.js";
import { UserSession } from "../../services/UserSession.js";

// 로그인 정보
const loginSession = new UserSession();
const sellerInfo = JSON.parse(loginSession.storage.omkt_user);
const sellerName = sellerInfo.name;

window.addEventListener("DOMContentLoaded", () => {
  createHeader();
  createFooter();
});
