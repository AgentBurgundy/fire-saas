"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFire } from "@fortawesome/free-solid-svg-icons";
import mixpanel from "mixpanel-browser";

export default function GetStartedButton() {
  const handleButtonClick = () => {
    mixpanel.track("Get Started Button Clicked");
    window.open("https://github.com/AgentBurgundy/fire-saas", "_blank");
  };

  return (
    <button onClick={handleButtonClick} className="btn btn-secondary">
      <FontAwesomeIcon icon={faFire} color="red" size="lg" />
      <span>Start Using FireSaaS for Free</span>
    </button>
  );
}
