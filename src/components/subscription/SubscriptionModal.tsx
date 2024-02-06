"use client";
import { useEffect, useRef, useState } from "react";
import SubscriptionCardContainer from "./SubscriptionCardContainer";
import { useSearchParams } from "next/navigation";
import { set } from "firebase/database";

export default function SubscriptionModal({}: any) {
  const modalRef = useRef<HTMLDialogElement>(null);
  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false);
  const [showPricing, setShowPricing] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      let pricing = localStorage.getItem("showPricing");
      if (!pricing) return;

      setShowPricing(pricing);
    }
  }, []);

  useEffect(() => {
    if (showPricing === "true") {
      setShowSubscriptionModal(true);

      if (typeof window !== "undefined") {
        localStorage.setItem("showPricing", "false");
        setShowPricing("false");
      }
    }
  }, [showPricing]);

  useEffect(() => {
    if (showSubscriptionModal && modalRef.current) {
      modalRef.current.showModal();
    }
  }, [showSubscriptionModal, modalRef]);

  return (
    <dialog
      ref={modalRef}
      id="my_modal_5"
      className="modal modal-bottom sm:modal-middle"
    >
      <div className="modal-box sm:w-full sm:max-w-5xl">
        <h3 className="font-bold text-center text-2xl">Upgrade Now</h3>
        <SubscriptionCardContainer />
        <div className="modal-action">
          <form method="dialog">
            {/* if there is a button in form, it will close the modal */}
            <button className="btn">Close</button>
          </form>
        </div>
      </div>
    </dialog>
  );
}
