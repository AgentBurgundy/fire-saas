import { useEffect, useRef } from "react";
import SubscriptionCardContainer from "./SubscriptionCardContainer";

export default function SubscriptionModal({ modalOpen }: any) {
  const modalRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    if (modalOpen && modalRef.current) {
      modalRef.current.showModal();
    }
  }, [modalOpen, modalRef]);

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
