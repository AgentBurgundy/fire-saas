import Cookies from "js-cookie";

export const DefaultCookieManager = {
  addAuthCookie: (uid: string) => {
    Cookies.set("uid", uid, { secure: true });
  },
  removeAuthCookie: () => {
    Cookies.remove("uid");
  },
};
