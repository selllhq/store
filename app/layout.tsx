import { Bricolage_Grotesque } from 'next/font/google';

import './globals.css';
import { getStore } from '@/lib/http';
import { StoreProvider } from '@/context/store-context';
import TopNav from '@/components/store/topnav';
import { BagProvider } from '@/context/bag-context';
import StoreNotFound from '@/components/store/store-not-found';

const bricolageGrotesque = Bricolage_Grotesque({
  variable: '--font-bricolage',
  subsets: ['latin'],
});

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const storeData = await getStore();

  return (
    <html lang="en">
      <body className={`${bricolageGrotesque.variable} antialiased`}>
        {!storeData ? (
          <StoreNotFound />
        ) : (
          <StoreProvider store={storeData}>
            <BagProvider store={storeData}>
              <TopNav />
              {children}
            </BagProvider>
          </StoreProvider>
        )}
      </body>
    </html>
  );
}
