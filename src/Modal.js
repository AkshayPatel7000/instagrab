import React from "react";

const Modal = ({ show, setShow, selectedUser }) => {
  return (
    <>
      {show && (
        <div class="details-modal">
          <div class="details-modal-close">
            <h4 onClick={setShow(false)}>X</h4>
          </div>
          <div class="details-modal-title">
            <h1>{selectedUser.name}</h1>
          </div>
          <div class="details-modal-content">
            <img src={selectedUser.image} />
          </div>
        </div>
      )}
    </>
  );
};

export default Modal;
