"use client";

import { useAuth } from "@/lib/context/AuthContext";
import signout from "@/lib/firebase/signout";
import Link from "next/link";
import SubscriptionModalReminder from "../subscription/SubscriptionModalReminder";

export default function UserAvatar() {
  const { currentUser, userRole, isLoadingAuth } = useAuth();

  if (isLoadingAuth) {
    return <span className="loading loading-spinner loading-md"></span>;
  }

  if (!currentUser) {
    return (
      <Link href="login" className="btn btn-accent">
        <span>Login</span>
      </Link>
    );
  }

  return (
    <div className="dropdown dropdown-end">
      <div
        tabIndex={0}
        role="button"
        className="btn btn-ghost btn-circle avatar placeholder"
      >
        <div className="bg-neutral text-neutral-content w-10 rounded-full">
          {currentUser.displayName && <span>{currentUser.displayName[0]}</span>}
        </div>
      </div>
      <ul
        tabIndex={0}
        className="mt-3 z-[100] p-2 shadow menu menu-sm dropdown-content bg-base-100 rounded-box w-52"
      >
        <li className="mb-4">
          <SubscriptionModalReminder />
        </li>
        <li>
          <Link href="/app/dashboard">Dashboard</Link>
        </li>
        <li>
          <Link href="/app/settings">Settings</Link>
        </li>

        <li>
          <a onClick={signout}>Logout</a>
        </li>
      </ul>
    </div>
  );
}
