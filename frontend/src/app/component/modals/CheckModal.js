import Modal from "react-modal";
import "./CheckModal.css"; 

const CheckModal = ({ isOpen, onRequestClose, response }) => (
  <Modal
    isOpen={isOpen}
    onRequestClose={onRequestClose}
    contentLabel="Response Modal"
    style={{
      content: {
        top: "50%",
        left: "50%",
        right: "auto",
        bottom: "auto",
        marginRight: "-50%",
        transform: "translate(-50%, -50%)",
        width: "50%",
        padding: "20px",
        borderRadius: "8px",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
      },
      overlay: {
        backgroundColor: "rgba(0, 0, 0, 0.75)",
      },
    }}
  >
    <div className="modal-header">
      <button 
        className="close-button" 
        onClick={onRequestClose} 
        aria-label="Close"
      >
        &times;
      </button>
      <h2>Code Analysis</h2>
    </div>
    <pre>{response}</pre>
  </Modal>
);

export default CheckModal;
