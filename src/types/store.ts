export interface Store {
  id: string;
  name: string;
  description?: string;
  logo?: string;
  banner?: string;
  customDomain?: string;
  currency?: string;
  config?: string;
  theme?: StoreTheme;
}

export interface StoreTheme {
  primaryColor: string;
  secondaryColor: string;
  backgroundColor: string;
  textColor: string;
}
