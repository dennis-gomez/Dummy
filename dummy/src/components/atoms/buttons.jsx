function Button ({text, onClick, color}) {
    return (
        <button className="btn" onClick={onClick} color={color}>
            {text}
        </button>
    );
}
export default Button;