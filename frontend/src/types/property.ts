export type PropertyItem = {
  id: number;
  title: string;
  area: string;
  bedrooms: number;
  parkingSpaces: number;
  price: string;
  images: string[];
};

export type NegotiationItem = {
  id: number;
  name: string;
  stage: string;
  avatar: number;
  progress: number;
  color: "cyan" | "red";
};

export type VisitItem = {
  id: number;
  title: string;
  time: string;
  color: "violet" | "emerald";
};