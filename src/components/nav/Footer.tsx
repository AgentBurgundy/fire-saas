import { faFire } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function Footer() {
  return (
    <div className="flex flex-row space-x-1 items-center justify-center w-full mt-10 h-16 bg-neutral-content text-neutral">
      <span className="flex flex-row space-x-2 items-center">
        <FontAwesomeIcon icon={faFire} color="red" /> <span>FireSaaS</span>
      </span>
      <span> - Made with love</span>
    </div>
  );
}
