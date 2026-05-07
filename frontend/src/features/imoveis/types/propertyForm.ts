import type { PropertyItem } from "../../../types/property";

export type PropertyFormData = Omit<PropertyItem, "id" | "images"> & {
  images: File[];
};