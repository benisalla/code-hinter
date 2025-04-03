import CodeMirror from "@uiw/react-codemirror";
import { python } from "@codemirror/lang-python";
import { githubLight } from "@uiw/codemirror-theme-github";

const CodeInput = ({ value, onChange }) => (
    <CodeMirror
        value={value}
        onChange={onChange}
        height="200px"
        theme={githubLight}
        extensions={[python()]}
        placeholder="Write Python code here..."
    />
);

export default CodeInput;
