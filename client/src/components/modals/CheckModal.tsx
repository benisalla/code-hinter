import { Modal, Box } from "@mui/material";
import "./CheckModal.css"; 

interface CheckModalProps {
  isOpen: boolean;
  onRequestClose: () => void;
  response: string;
}

const CheckModal: React.FC<CheckModalProps> = ({ isOpen, onRequestClose, response }) => (
  <Modal
    open={isOpen}
    onClose={onRequestClose}
    aria-labelledby="response-modal-title"
    aria-describedby="response-modal-description"
  >
    <Box
      sx={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '50%',
        bgcolor: 'background.paper',
        boxShadow: 24,
        p: 4,
        borderRadius: 1,
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
        <h2 id="response-modal-title">Code Analysis</h2>
      </div>
      <pre id="response-modal-description">{response}</pre>
    </Box>
  </Modal>
);

export default CheckModal;
