export class UserSession {
  constructor(
    storage = localStorage,
    baseUrl = "https://api.wenivops.co.kr/services/open-market"
  ) {
    this.storage = storage;
    this.baseUrl = baseUrl;
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
    return user?.user_type?.toUpperCase() || null;
  }

  // 구매자 / 판매자 구분 -> ture, false 반환
  isBuyer() {
    return this.getRole() === "BUYER";
  }
  isSeller() {
    return this.getRole() === "SELLER";
  }

  // Access Token 조회
  getAccess() {
    return this.storage.getItem("omkt_access");
  }

  // Refresh Token 조회
  getRefresh() {
    return this.storage.getItem("omkt_refresh");
  }

  // 로그인 상태 확인 (access, refresh token check)
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

  // 토큰 재발급 -> 성공/ 실패 여부를 간단히 알 수 있는 로직 필요
  async refreshAccessToken() {
    const refreshToken = this.getRefresh();
    const rexp = Number(this.storage.getItem("omkt_rexp") || 0);

    // refresh 토큰이 없거나 만료됐을 때
    if (!refreshToken || Date.now() >= rexp) {
      this.clear();
      // 로그인창으로 보내버리기
      alert("다시 로그인해 주세요.");
      location.replace("../login/login.html");
    }

    try {
      const res = await fetch(`${this.baseUrl}/accounts/token/refresh/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          refresh: refreshToken,
        }),
      });

      if (!res.ok) {
        throw new Error("토큰 재발급 실패");
      }

      const data = await res.json();
      const newAccessToken = data.access;

      const now = Date.now();
      this.storage.setItem("omkt_access", newAccessToken);
      this.storage.setItem("omkt_aexp", String(now + 5 * 60 * 1000));

      return newAccessToken;
    } catch (err) {
      // 서버 오류
      this.clear();
      // 에러 났을 때 어떤 처리가 필요할지
      alert("다시 로그인해 주세요.");
      location.replace("../login/login.html");
    }
  }

  // 세션 정보 저장 (로그인)
  save({ access, refresh, user }) {
    const now = Date.now();
    this.storage.setItem("omkt_access", access);
    this.storage.setItem("omkt_refresh", refresh);
    this.storage.setItem("omkt_user", JSON.stringify(user));
    this.storage.setItem("omkt_aexp", String(now + 5 * 60 * 1000)); // 업데이트 필요 -> 비동기
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
