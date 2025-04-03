const ConceptInput = ({ value, onChange }) => (
    <textarea
      id="prof-hints"
      rows="4"
      value={value}
      onChange={onChange}
      placeholder="Enter the concepts here..."
      required
    />
  );
  
  export default ConceptInput;
  