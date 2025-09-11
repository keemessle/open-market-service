export class UserSession {
  constructor(storage = localStorage) {
    this.storage = storage;
  }

  // 사용자 정보 조회
  getUser() {
    try {
      return JSON.parse(this.storage.getItem("omkt_user") || "null");
    } catch {
      return null;
    }
  }

  // 사용자 역할 조회
  getRole() {
    const user = this.getUser();
    return this.user?.user_type?.toUpperCase() || null;
  }

  // 구매자 / 판매자 구분 -> ture, false 반환
  isBuyer() {
    return this.getRole() === "BUYER";
  }
  isSeller() {
    return this.getRole === "SELLER";
  }

  // Access Token 조회
  getAccess() {
    return this.storage.getItem("omkt_access");
  }

  isAuthed() {
    const access = this.getAccess();
    const rexp = Number(this.storage.getItem("omkt_rexp") || 0);
    if (!access) return false;
    if (!rexp || Date.now() >= rexp) {
      this.clear(); // 로그아웃
      return false;
    }
    return true;
  }

  // 세션 정보 저장 (로그인)
  save({ access, refresh, user }) {
    const now = Date.now();
    this.storage.setItem("omkt_access", access);
    this.storage.setItem("omkt_refresh", refresh);
    this.storage.setItem("omkt_user", JSON.stringify(user));
    this.storage.setItem("omkt_aexp", String(now + 5 * 60 * 1000));
    this.storage.setItem("omkt_rexp", String(now + 24 * 60 * 60 * 1000));
  }

  // 세션 정보 삭제 (로그아웃)
  clear() {
    this.storage.removeItem("omkt_access");
    this.storage.removeItem("omkt_refresh");
    this.storage.removeItem("omkt_user");
    this.storage.removeItem("omkt_aexp");
    this.storage.removeItem("omkt_rexp");
  }
}
