import { useState } from "react";
import { AuthProvider } from "./auth/AuthContext";
import { useAuth } from "./auth/useAuth";
import { useToast } from "./hooks/useToast";
import { ToastContainer } from "./components/ui/ToastContainer";
import { Layout } from "./components/layout/Layout";
import { AuthPage } from "./features/auth/AuthPage";
import { ServicesPage } from "./features/services/ServicesPage";
import { AvailabilityPage } from "./features/availability/AvailabilityPage";
import { BookingsPage } from "./features/bookings/BookingsPage";

function Inner({ toast }) {
  const { user } = useAuth();
  const [page, setPage] = useState("services");

  if (!user) {
    return <AuthPage toastFn={toast} />;
  }

  const pages = {
    services: <ServicesPage toast={toast} />,
    availability: <AvailabilityPage toast={toast} />,
    bookings: <BookingsPage toast={toast} />,
  };

  return (
    <Layout currentPage={page} setCurrentPage={setPage}>
      {pages[page] || pages.services}
    </Layout>
  );
}

export default function App() {
  const { toasts, toast } = useToast();

  return (
    <AuthProvider>
      <ToastContainer toasts={toasts} />
      <Inner toast={toast} />
    </AuthProvider>
  );
}
