import { toast } from "sonner";
import i18next from "@/shared/lib/i18n/client";
import { TRPCClientError } from "@trpc/client";

type HandleErrorOptions = {
  error: unknown;
  showToast?: boolean;
};

export function handleError({ error, showToast = true }: HandleErrorOptions) {
  let messageKey = "response:error.generic";
  let messageValues = {};

  if (error instanceof TRPCClientError) {
    try {
      const parsed = JSON.parse(error.message);
      messageKey = parsed.key || messageKey;
      messageValues = parsed.values || {};
    } catch (e) {
      messageKey = error.message;
    }
  } else if (error instanceof Error) {
    messageKey = error.message;
  }

  console.error("An error occurred:", error);

  if (showToast) {
    const translatedMessage = i18next.t(messageKey, messageValues);
    toast.error(translatedMessage);
  }
}
