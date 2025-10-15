function Button({ text, onClick, disabled = false, sx = {} }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={sx} // Aplicamos el estilo opcional
      className={`
        px-5 py-2 rounded-md font-semibold text-white transition 
        focus:outline-none focus:ring-4 focus:ring-blue-300
        active:outline-none active:ring-0
        ${disabled 
          ? "bg-blue-600 opacity-50 cursor-not-allowed" 
          : "bg-blue-600 hover:bg-blue-700 cursor-pointer"
        }
      `}
      onMouseDown={(e) => e.preventDefault()}
    >
      {text}
    </button>
  );
}

export default Button;
