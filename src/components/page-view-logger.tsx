"use client";

import { useEffect, useRef } from "react";

import { getLogger, withRequestLogger } from "@/lib/logging";
import { trackEvent } from "@/lib/telemetry";

type PageViewLoggerProps = {
  event: string;
  message: string;
  context?: Record<string, unknown>;
};

export function PageViewLogger({ event, message, context }: PageViewLoggerProps) {
  const hasLogged = useRef(false);

  useEffect(() => {
    if (hasLogged.current) {
      return;
    }

    hasLogged.current = true;

    const logger = context ? withRequestLogger(context) : getLogger();
    logger.info(message);
    trackEvent(event);
  }, [context, event, message]);

  return null;
}
