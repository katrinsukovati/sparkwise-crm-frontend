import "./TextButton.scss";
function TextButton({ text, handleClick }) {
  return (
    <button className="text-btn" onClick={handleClick}>
      {text}
    </button>
  );
}

export default TextButton;
