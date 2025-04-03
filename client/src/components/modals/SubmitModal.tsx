import React from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from "@mui/material";
import "./RankerModal.css";
import { Typography, Box } from "@mui/material";

interface SubmitModalProps {
  isOpen: boolean;
  onRequestClose: () => void;
  score: number;
}

const SubmitModal: React.FC<SubmitModalProps> = ({ isOpen, onRequestClose, score }) => (
  <Dialog
    open={isOpen}
    onClose={onRequestClose}
    aria-labelledby="ranker-modal-title"
    maxWidth="md"
    fullWidth
  >
    <DialogTitle id="ranker-modal-title">
      Code has been submitted successfully!
      <Button 
        className="close-button" 
        onClick={onRequestClose}
        aria-label="Close"
        style={{ float: 'right' }}
      >
        &times;
      </Button>
    </DialogTitle>
    <DialogContent dividers>
      <Box display="flex" justifyContent="center" alignItems="center" flexDirection="column">
        <Typography variant="h6" gutterBottom>
          Your Score
        </Typography>
        <Typography variant="h4" color="primary">
          {score}
        </Typography>
      </Box>
    </DialogContent>
    <DialogActions>
      <Button onClick={onRequestClose} color="primary">
        Close
      </Button>
    </DialogActions>
  </Dialog>
);

export default SubmitModal;
