"use client";

import { Button } from "@/shared/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/shared/ui/popover";
import { Bell } from "lucide-react";
import { useReceivedInvitations } from "@/features/groups/subfeatures/invitations/hooks/use-received-invitations.hook";
import { useAcceptInvitation } from "@/features/groups/subfeatures/invitations/hooks/use-accept-invitation.hook";
import { useDeclineInvitation } from "@/features/groups/subfeatures/invitations/hooks/use-decline-invitation.hook";
import { Spinner } from "@/shared/ui/spinner";
import { useTranslation } from "react-i18next";

export function InvitationsBell() {
  const { t } = useTranslation("common");
  const { data: invitations, isLoading } = useReceivedInvitations();
  const { mutate: accept, isPending: isAccepting } = useAcceptInvitation();
  const { mutate: decline, isPending: isDeclining } = useDeclineInvitation();

  const invitationsCount = invitations?.data?.length ?? 0;

  if (!invitations) {
    return null;
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {invitationsCount > 0 && (
            <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
              {invitationsCount}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <div className="space-y-4">
          <h4 className="font-medium leading-none">
            {t("invitation.mainTitle")}
          </h4>
          {isLoading && <Spinner />}
          {invitationsCount > 0 ? (
            <ul className="space-y-2">
              {invitations.data.map((inv) => (
                <li key={inv.id} className="text-sm">
                  <p>
                    <b>{inv.invitedByUser.name}</b>{" "}
                    {t("invitation.notification.invitesYou")}{" "}
                    <b>{inv.group.name}</b>.
                  </p>
                  <div className="flex gap-2 mt-2">
                    <Button
                      size="sm"
                      onClick={() => accept({ invitationId: inv.id })}
                      disabled={isAccepting || isDeclining}
                    >
                      {t("accept")}
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => decline({ invitationId: inv.id })}
                      disabled={isAccepting || isDeclining}
                    >
                      {t("decline")}
                    </Button>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-muted-foreground">
              {t("invitation.notification.noInvitations")}
            </p>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
