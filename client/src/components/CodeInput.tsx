import React from 'react';
import CodeMirror from "@uiw/react-codemirror";
import { python } from "@codemirror/lang-python";
import { githubLight } from "@uiw/codemirror-theme-github";
import { Box } from '@mui/material';

interface CodeInputProps {
    value: string;
    onChange: (value: string) => void;
    height?: string;
}

const CodeInput: React.FC<CodeInputProps> = ({ value, onChange, height = '400px' }) => (
    <Box sx={{ border: 'none', borderRadius: '4px', overflow: 'hidden' }}>
        <CodeMirror
            value={value}
            onChange={onChange}
            height={height}
            theme={githubLight}
            extensions={[python()]}
            placeholder="Write Python code here..."
        />
    </Box>
);

export default CodeInput;
