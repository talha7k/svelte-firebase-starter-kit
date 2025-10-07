export interface NavItem {
  title: string;
  url?: string;
  disabled?: boolean;
  external?: boolean;
  icon?: string;
  label?: string;
  items?: NavItem[];
}

export interface SocialLink {
  title: string;
  url: string;
  icon: keyof SocialIcons;
}

export interface SocialIcons {
  twitter: string;
  github: string;
  facebook: string;
  instagram: string;
  linkedin: string;
  youtube: string;
  tiktok: string;
  snapchat: string;
}

export interface SidebarNav {
  title: string;
  items: NavItem[];
}
