export function ToastContainer({ toasts }) {
  return (
    <div className="toast-container">
      {toasts.map((t) => {
        const borderColor =
          t.type === "success"
            ? "var(--green)"
            : t.type === "error"
              ? "var(--red)"
              : "var(--amber)";

        return (
          <div
            key={t.id}
            className="toast-item"
            style={{
              border: `1px solid ${borderColor}`,
              color: "var(--text)",
            }}
          >
            {t.msg}
          </div>
        );
      })}
    </div>
  );
}
