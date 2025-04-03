import React from 'react';
import TextField from '@mui/material/TextField';

interface ConceptInputProps {
  value: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const ConceptInput: React.FC<ConceptInputProps> = ({ value, onChange }) => (
  <TextField
    id="prof-hints"
    multiline
    rows={4}
    value={value}
    onChange={onChange}
    placeholder="Enter the concepts here..."
    required
    variant="outlined"
    fullWidth
  />
);

export default ConceptInput;