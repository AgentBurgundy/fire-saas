import { faFire } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import UserAvatar from "./UserAvatar";

export default function Navbar() {
  return (
    <div className="mx-auto max-w-7xl relative z-[100] navbar bg-base-100">
      <div className="flex-1">
        <Link href="/" className="btn btn-ghost text-xl">
          <FontAwesomeIcon icon={faFire} color="red" /> <span>FireSaaS</span>
        </Link>
      </div>

      <div className="flex-none">
        <ul className="menu menu-horizontal px-1">
          <li>
            <a href="https://docs.firesaas.dev">Documentation</a>
          </li>
        </ul>

        <UserAvatar />
      </div>
    </div>
  );
}
