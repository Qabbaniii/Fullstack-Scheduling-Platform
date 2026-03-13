import { Spinner } from "./Spinner";

export function Btn({
  children,
  variant = "primary",
  loading,
  size = "md",
  style,
  ...props
}) {
  const styles = {
    primary: { background: "var(--amber)", color: "#0e0f13", border: "none" },
    secondary: {
      background: "transparent",
      color: "var(--text)",
      border: "1px solid var(--border2)",
    },
    danger: {
      background: "transparent",
      color: "var(--red)",
      border: "1px solid var(--red-dim)",
    },
    ghost: { background: "transparent", color: "var(--text2)", border: "none" },
  };

  const sizes = {
    sm: { padding: "7px 14px", fontSize: 13 },
    md: { padding: "10px 20px", fontSize: 14 },
    lg: { padding: "13px 28px", fontSize: 15 },
  };

  return (
    <button
      {...props}
      disabled={loading || props.disabled}
      style={{
        ...styles[variant],
        ...sizes[size],
        borderRadius: "var(--radius-sm)",
        fontWeight: 600,
        display: "inline-flex",
        alignItems: "center",
        gap: 8,
        opacity: loading || props.disabled ? 0.6 : 1,
        cursor: loading || props.disabled ? "not-allowed" : "pointer",
        ...style,
      }}
    >
      {loading && <Spinner size={15} />}
      {children}
    </button>
  );
}
