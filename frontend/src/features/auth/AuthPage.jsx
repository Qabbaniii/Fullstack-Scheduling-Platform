import { useState } from "react";
import { API } from "../../api/client";
import { useAuth } from "../../auth/useAuth";
import { decodeJwtUser } from "../../utils/auth";
import { Btn } from "../../components/ui/Btn";
import { Card } from "../../components/ui/Card";
import { Input } from "../../components/ui/Input";
import { Select } from "../../components/ui/Select";

export function AuthPage({ toastFn }) {
  const { login } = useAuth();

  const [tab, setTab] = useState("login");
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: "",
    role: "Customer",
  });

  const [errors, setErrors] = useState({});

  const update = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const validateRegister = () => {
    const nextErrors = {};

    if (!form.fullName.trim()) {
      nextErrors.fullName = "Full name is required";
    }

    if (!form.email.trim() || !form.email.includes("@")) {
      nextErrors.email = "Valid email is required";
    }

    if (!form.password || form.password.length < 6) {
      nextErrors.password = "Password must be at least 8 characters";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    try {
      const data = await API.login({
        email: form.email,
        password: form.password,
      });

      const token = data.token ?? data.accessToken ?? data;
      const user = data.user ?? decodeJwtUser(token, form);

      login(token, user);
      toastFn(`Welcome back, ${user.fullName}!`, "success");
    } catch (err) {
      toastFn(err.message || "Login failed", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    if (!validateRegister()) return;

    setLoading(true);

    try {
      const data = await API.register(form);
      const token = data.token ?? data.accessToken ?? data;
      const user = data.user ?? decodeJwtUser(token, form);

      login(token, user);
      toastFn(`Welcome, ${user.fullName}!`, "success");
    } catch (err) {
      toastFn(err.message || "Registration failed", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 20,
        background:
          "radial-gradient(ellipse at 30% 20%, rgba(212,168,83,0.05) 0%, transparent 60%), var(--bg)",
      }}
    >
      <div className="fade-in" style={{ width: "100%", maxWidth: 460 }}>
        <div style={{ textAlign: "center", marginBottom: 30 }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 10,
              marginBottom: 14,
            }}
          >
            <div
              style={{
                width: 38,
                height: 38,
                borderRadius: 10,
                background: "var(--amber)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#0e0f13",
                fontWeight: 700,
                flexShrink: 0,
              }}
            >
              ◈
            </div>
            <span
              style={{
                fontFamily: "Playfair Display, serif",
                fontSize: 24,
                fontWeight: 700,
              }}
            >
              Schedulr
            </span>
          </div>

          <p
            style={{
              color: "var(--text3)",
              fontSize: 14,
            }}
          >
            Professional scheduling, simplified
          </p>
        </div>

        <Card style={{ padding: 28 }}>
          <div
            style={{
              display: "flex",
              background: "var(--surface2)",
              borderRadius: "var(--radius-sm)",
              padding: 4,
              marginBottom: 24,
            }}
          >
            {["login", "register"].map((item) => {
              const active = tab === item;

              return (
                <button
                  key={item}
                  type="button"
                  onClick={() => setTab(item)}
                  style={{
                    flex: 1,
                    padding: "10px 12px",
                    background: active ? "var(--amber)" : "transparent",
                    color: active ? "#0e0f13" : "var(--text2)",
                    border: "none",
                    borderRadius: 6,
                    fontSize: 14,
                    fontWeight: 600,
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                    textTransform: "capitalize",
                  }}
                >
                  {item}
                </button>
              );
            })}
          </div>

          {tab === "login" ? (
            <form
              onSubmit={handleLogin}
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 18,
              }}
            >
              <Input
                label="Email"
                type="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={(e) => update("email", e.target.value)}
              />

              <Input
                label="Password"
                type="password"
                placeholder="••••••••"
                value={form.password}
                onChange={(e) => update("password", e.target.value)}
              />

              <Btn
                type="submit"
                loading={loading}
                size="lg"
                style={{
                  width: "100%",
                  justifyContent: "center",
                  marginTop: 4,
                }}
              >
                Sign In
              </Btn>
            </form>
          ) : (
            <form
              onSubmit={handleRegister}
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 18,
              }}
            >
              <Input
                label="Full Name"
                placeholder="Abdullah Qabbani"
                value={form.fullName}
                onChange={(e) => update("fullName", e.target.value)}
                error={errors.fullName}
              />

              <Input
                label="Email"
                type="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={(e) => update("email", e.target.value)}
                error={errors.email}
              />

              <Input
                label="Password"
                type="password"
                placeholder="Min. 6 characters"
                value={form.password}
                onChange={(e) => update("password", e.target.value)}
                error={errors.password}
              />

              <Select
                label="Role"
                value={form.role}
                onChange={(e) => update("role", e.target.value)}
                options={[
                  {
                    value: "Customer",
                    label: "Customer — I want to book services",
                  },
                  { value: "Provider", label: "Provider — I offer services" },
                ]}
              />

              <Btn
                type="submit"
                loading={loading}
                size="lg"
                style={{
                  width: "100%",
                  justifyContent: "center",
                  marginTop: 4,
                }}
              >
                Create Account
              </Btn>
            </form>
          )}
        </Card>
      </div>
    </div>
  );
}
