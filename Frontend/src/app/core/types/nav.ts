export interface NavLeaf {
  labelKey: string;
  icon: string;
  path: string;
}

export interface NavSection {
  labelKey: string;
  icon: string;
  path?: string;
  children?: NavLeaf[];
}
