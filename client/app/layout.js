import { AuthProvider } from '../context/AuthContext';
import './globals.css';

export const metadata = {
  title: 'LuxeHR | Production-Ready Offer Letter Management',
  description: 'Advanced HR automation with e-signatures and workflow tracking.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
