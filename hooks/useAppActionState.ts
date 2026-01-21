import { ActionResponse } from "@/types";
import { useActionState, useEffect, useState } from "react";

export type ServerAction = (_: ActionResponse, formData: FormData) => Promise<ActionResponse>;

export type AppActionStateParams = {
  moreFields?: { [key: string]: string | null | undefined };
  onSuccess?: (res: ActionResponse) => void;
  onResponse?: (res: ActionResponse) => void;
  onError?: (res: ActionResponse) => void;
  closeOnSuccess?: boolean;
};

export function useAppActionState(
  serverAction: ServerAction,
  { closeOnSuccess = true, ...params }: AppActionStateParams = {
    closeOnSuccess: true,
  }
) {
  const [formKey, setFormKey] = useState("-");
  const [open, onOpenChange] = useState(false);
  const [state, _action, submitting] = useActionState(serverAction, {});


  async function action(formData: FormData) {
    for (const key in params.moreFields) {
      if (Object.prototype.hasOwnProperty.call(params.moreFields, key)) {
        const element = params.moreFields[key];
        if (typeof element === "string") formData.append(key, element);
      }
    }

    return await _action(formData)
  }

  useEffect(() => {
    if (state.success) {
      // console.log("successful");
      if (closeOnSuccess)
        onOpenChange(false);

      params.onSuccess?.(state);
      setFormKey((v) => v + "-");
    }
    if (state.error) params.onError?.(state);
    params.onResponse?.(state);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);

  // console.log({ open });
  const modalProps = {
    open, onOpenChange
  }


  return {
    state, action, submitting, formKey, modalProps
  };
}