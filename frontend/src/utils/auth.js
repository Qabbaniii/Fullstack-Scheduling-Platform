export function decodeJwtUser(token, fallback = {}) {
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));

    return {
      id:
        payload.sub ?? payload.id ?? payload.userId ?? fallback.id ?? "unknown",
      fullName: payload.fullName ?? payload.name ?? fallback.fullName ?? "User",
      email: payload.email ?? fallback.email ?? "",
      role:
        payload.role ??
        payload[
          "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"
        ] ??
        fallback.role ??
        "Customer",
    };
  } catch {
    return {
      id: fallback.id ?? "unknown",
      fullName: fallback.fullName ?? "User",
      email: fallback.email ?? "",
      role: fallback.role ?? "Customer",
    };
  }
}
