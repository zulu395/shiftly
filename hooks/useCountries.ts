import { Country, ICountry, State, IState } from "country-state-city";
import { useEffect, useMemo, useState } from "react";

let countries: ICountry[];

export function useCountries() {
  if (!countries) countries = Country.getAllCountries();
  return countries;
}

export function useCountriesAndStates(defaultCountry?: string) {
  const [states, setStates] = useState<IState[]>([]);
  const [_country, setCountry] = useState<string>(defaultCountry ?? "");
  const countries = useCountries();
  const country = useMemo(() => {
    if (!_country) return null;
    const c = countries.find((c) => c.name === _country);
    if (!c) return null;
    return c;
  }, [_country, countries]);

  useEffect(() => {
    if (country) {
      const states = State.getStatesOfCountry(country.isoCode);
      requestAnimationFrame(() => setStates(states));
    } else {
      requestAnimationFrame(() => setStates([]));
    }
  }, [country]);

  useEffect(() => {
    if (!defaultCountry) return;
    requestAnimationFrame(() => setCountry(defaultCountry));
  }, [defaultCountry]);

  return {
    countries,
    states,
    setCountry,
  };
}
