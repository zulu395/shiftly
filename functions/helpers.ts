import { ANY } from "@/types";

export function formDataToObject<T = ANY>(formData: FormData): T {
  return Object.fromEntries(formData.entries()) as T;
}
