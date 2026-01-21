import { $getAccountFromSession } from "@/actions/account/account";
import { AppError } from "@/utils/appError";
import { useQuery } from "@tanstack/react-query";

export function useAccountQuery() {
  const q = useQuery({
    queryKey: ["account"],
    queryFn: () => $getAccountFromSession(),
    staleTime: 60 * 60 * 1000, // 1 hour
  });

  console.log({ is: q.data, lo: q.isLoading });

  const account = !!q.data && !(q.data instanceof AppError) ? q.data : null;
  const error = !!q.data && q.data instanceof AppError ? q.data : null;

  return { ...q, account, error };
}
