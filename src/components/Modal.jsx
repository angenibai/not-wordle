import "./Modal.css";

const Modal = (props) => {
  const { isOpen, children } = props;
  return (
    <div className={`Modal ${!isOpen ? "modalClose" : ""}`}>{children}</div>
  );
};

export default Modal;
