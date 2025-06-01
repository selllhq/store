import { Bricolage_Grotesque } from 'next/font/google';
import { getSubdomainFromHeaders } from '../lib/subdomain';
import StoreNotFound from '../components/store-not-found';

import './globals.css';

const bricolageGrotesque = Bricolage_Grotesque({
  variable: '--font-bricolage-grotesque',
  subsets: ['latin'],
});

async function getStore(subdomain: string | null) {
  if (!subdomain) {
    return null;
  }

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASEURL}/stores/${subdomain}`
  );

  if (!res.ok) {
    return null;
  }

  return res.json();
}

export const generateMetadata = async () => {
  const store = await getStore(await getSubdomainFromHeaders());

  if (!store) {
    return {
      title: 'Store not found',
      description: 'Store not found',
    };
  }

  return {
    icons: {
      icon: new URL(store.logo),
      apple: new URL(store.logo),
      shortcut: new URL(store.logo),
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
  const storeData = await getStore(await getSubdomainFromHeaders());

  return (
    <html lang="en">
      <body className={`${bricolageGrotesque.variable} antialiased`}>
        {!storeData ? <StoreNotFound /> : children}
      </body>
    </html>
  );
}
