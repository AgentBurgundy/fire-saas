import { User, onAuthStateChanged } from "firebase/auth";
import { auth, db } from "../firebase/firebaseClient";

export class AuthService {
  onAuthStateChanged(callback: (user: User | null) => void) {
    return onAuthStateChanged(auth, callback);
  }

  async getUserClaims(user: User): Promise<{ [key: string]: any }> {
    await user.getIdToken(true); // Force token refresh
    const tokenResult = await user.getIdTokenResult();
    return tokenResult.claims;
  }
}
