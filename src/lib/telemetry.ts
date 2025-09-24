import { getLogger } from "./logging";

type TelemetryPayload = Record<string, unknown>;

function getBuffer() {
  const globalScope = globalThis as typeof globalThis & {
    __PACE_TRACE_TELEMETRY__?: TelemetryPayload[];
  };

  if (!globalScope.__PACE_TRACE_TELEMETRY__) {
    globalScope.__PACE_TRACE_TELEMETRY__ = [];
  }

  return globalScope.__PACE_TRACE_TELEMETRY__;
}

export function trackEvent(event: string, payload: TelemetryPayload = {}) {
  const enriched = {
    event,
    ...payload,
    timestamp: new Date().toISOString(),
  } satisfies TelemetryPayload;

  getBuffer().push(enriched);
  getLogger().info("telemetry.event", enriched);
}

export function flushEvents() {
  const buffer = getBuffer();
  buffer.length = 0;
}

export function trackAuthEvent(event: string, payload: TelemetryPayload = {}) {
  trackEvent(`auth.${event}`, payload);
}

export function trackUiEvent(event: string, payload: TelemetryPayload = {}) {
  trackEvent(`ui.${event}`, payload);
}
