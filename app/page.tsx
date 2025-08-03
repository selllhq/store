import { getStore } from '@/lib/http';
import { HomeContent } from '@/components/home';

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
      icon: store.logo
        ? new URL(store.logo)
        : new URL('https://zero.leafphp.dev/assets/img/logo.png'),
      apple: store.logo
        ? new URL(store.logo)
        : new URL('https://zero.leafphp.dev/assets/img/logo.png'),
      shortcut: store.logo
        ? new URL(store.logo)
        : new URL('https://zero.leafphp.dev/assets/img/logo.png'),
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

export default function Home() {
  return (
    <HomeContent />
  );
}
