import type { Metadata } from "next";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "../context/AuthContext";

export const metadata: Metadata = {
  title: "Booking App",
  description: "Book time slots and sync with Google Calendar",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          {children}
          <Toaster position="top-right" />
        </AuthProvider>
      </body>
    </html>
  );
}