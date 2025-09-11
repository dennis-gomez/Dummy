function Button ({text, onClick, color}) {
    return (
        <button className="btn" onClick={onClick}>
            {text}
        </button>
    );
}
export default Button;