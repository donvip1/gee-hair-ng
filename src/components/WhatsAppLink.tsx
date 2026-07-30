"use client";

import type { AnchorHTMLAttributes, ReactNode } from "react";
import type { CommerceEvent } from "@/lib/analytics";
import { trackCommerceEvent } from "@/lib/analytics";

type Props = AnchorHTMLAttributes<HTMLAnchorElement> & {
  children: ReactNode;
  eventName: CommerceEvent;
  eventData?: Record<string, string | number | boolean>;
};

export function WhatsAppLink({ children, eventName, eventData, onClick, ...props }: Props) {
  return (
    <a
      {...props}
      target="_blank"
      rel="noreferrer"
      onClick={(event) => {
        trackCommerceEvent(eventName, eventData);
        onClick?.(event);
      }}
    >
      {children}
    </a>
  );
}
