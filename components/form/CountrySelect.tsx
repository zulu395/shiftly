"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useChangeSearchParams } from "@/hooks/useChangeSearchParams";
import { useCountries } from "@/hooks/useCountries";
import { FaSpinner } from "react-icons/fa6";
export default function Countryselect() {
  const countries = useCountries();
  const { params, pushParams } = useChangeSearchParams();

  return (
    <Select
      defaultValue={params.get("country") ?? ""}
      onValueChange={(country) => pushParams({ country: country.trim() })}
    >
      <SelectTrigger className=" !py-5 h-auto inline-flex text-primary rounded-3xl border-brand-primary">
        <SelectValue placeholder="Select Country" />
      </SelectTrigger>
      <SelectContent className="border-gray-100 bg-white ">
      <SelectItem value=" " >All Countries</SelectItem>
        {!countries ? (
          <FaSpinner className="animate-spin"></FaSpinner>
        ) : (
          countries.map((country, i) => (
            <SelectItem key={i} value={country.name}>
              {country.name}
            </SelectItem>
          ))
        )}
      </SelectContent>
    </Select>
  );
}
