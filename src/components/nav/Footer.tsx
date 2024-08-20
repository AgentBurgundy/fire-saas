import { faFire } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="footer bg-neutral text-neutral-content p-10">
      <aside>
        <FontAwesomeIcon icon={faFire} color="red" size="2x" />
        <p>
          FireSaaS
          <br />
          Made with love
        </p>
      </aside>
      <nav>
        <h6 className="footer-title">Company</h6>
        <Link href="/" className="link link-hover">
          About us
        </Link>
        <Link href="/" className="link link-hover">
          Contact
        </Link>
        <Link href="/blog" className="link link-hover">
          Blog
        </Link>
      </nav>
      <nav>
        <h6 className="footer-title">Legal</h6>
        <Link href="/" className="link link-hover">
          Terms of use
        </Link>
        <Link href="/" className="link link-hover">
          Privacy policy
        </Link>
        <Link href="/" className="link link-hover">
          Cookie policy
        </Link>
      </nav>
    </footer>
  );
}
