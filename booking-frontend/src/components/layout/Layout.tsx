import Head from 'next/head';
import Header from './Header';

interface LayoutProps {
  children: React.ReactNode;
  title?: string;
}

const Layout: React.FC<LayoutProps> = ({ children, title = 'Booking App' }) => {
  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content="Book time slots and sync with Google Calendar" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-grow bg-gray-50 py-6">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            {children}
          </div>
        </main>
        <footer className="bg-white py-4 text-center text-sm text-gray-500">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <p>&copy; {new Date().getFullYear()} Booking App. All rights reserved.</p>
          </div>
        </footer>
      </div>
    </>
  );
};

export default Layout;