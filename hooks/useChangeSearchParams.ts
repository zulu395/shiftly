import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useCallback, useMemo } from "react";


export function useChangeSearchParams(path?: string) {
  const params = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const paramsObj = useMemo(() => Object.fromEntries(params.entries(),), [params]);
  // const params = useParams();

  const createQueryString = useCallback(
    (obj: Record<string, string | number>) => {
      const _params = new URLSearchParams(params.toString());
      for (const [key, value] of Object.entries(obj)) {
        _params.set(key, value.toString());
      }

      return _params.toString();
    },
    [params]
  );

  const pushParams = (
    obj: Record<string, string | number>
  ) => {

    router.push(
      (path ?? pathname) + "?" + createQueryString(obj)
    );
  };

  const replaceParams = (
    obj: Record<string, string | number>
  ) => {
    router.replace(
      (path ?? pathname) + "?" + createQueryString(obj)
    );
  };

  return { pushParams, replaceParams, params, paramsObj };
}