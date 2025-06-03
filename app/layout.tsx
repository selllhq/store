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

export const generateMetadata = async () => {
  const store = await getStore();

  if (!store) {
    return {
      title: 'Store not found',
      description: 'Store not found',
    };
  }

  return {
    icons: {
      icon: store.logo ? new URL(store.logo) : new URL('https://zero.leafphp.dev/assets/img/logo.png'),
      apple: store.logo ? new URL(store.logo) : new URL('https://zero.leafphp.dev/assets/img/logo.png'),
      shortcut: store.logo ? new URL(store.logo) : new URL('https://zero.leafphp.dev/assets/img/logo.png'),
    },
    title: `${store.name} | Shop Online`,
    description: store.description,
    openGraph: {
      title: `${store.name} | Shop Online`,
      description: store.description,
      images: [
        {
          url: store.logo,
          width: 672,
          height: 346,
        },
      ],
    },
  };
};

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
            <BagProvider>
              <TopNav />
              {children}
            </BagProvider>
          </StoreProvider>
        )}
      </body>
    </html>
  );
}
