import Modal from "react-modal";
import "./RankerModal.css"; 

const RankerModal = ({ isOpen, onRequestClose, pr_code, st_code, score }) => (
  <Modal
    isOpen={isOpen}
    onRequestClose={onRequestClose}
    contentLabel="Ranker Modal"
    style={{
      content: {
        top: "50%",
        left: "50%",
        right: "auto",
        bottom: "auto",
        marginRight: "-50%",
        transform: "translate(-50%, -50%)",
        width: "60%",
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
      <h2>Code Comparison</h2>
    </div>
    <div>
      <h3>Professor's Code:</h3>
      <pre>{pr_code}</pre>
      <h3>Student's Code:</h3>
      <pre>{st_code}</pre>
      <h3>Similarity Score:</h3>
      <p>{score}</p>
    </div>
  </Modal>
);

export default RankerModal;
