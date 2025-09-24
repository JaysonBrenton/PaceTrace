export type LogLevel = "debug" | "info" | "warn" | "error";

type LogEntry = {
  level: LogLevel;
  message: string;
  timestamp: string;
  metadata?: Record<string, unknown>;
};

const GLOBAL_KEY = "__PACE_TRACE_LOGGER__";

class Logger {
  private baseFields: Record<string, unknown>;

  constructor(baseFields: Record<string, unknown> = {}) {
    this.baseFields = baseFields;
  }

  child(fields: Record<string, unknown>) {
    return new Logger({ ...this.baseFields, ...fields });
  }

  debug(message: string, metadata?: Record<string, unknown>) {
    this.log("debug", message, metadata);
  }

  info(message: string, metadata?: Record<string, unknown>) {
    this.log("info", message, metadata);
  }

  warn(message: string, metadata?: Record<string, unknown>) {
    this.log("warn", message, metadata);
  }

  error(message: string, metadata?: Record<string, unknown>) {
    this.log("error", message, metadata);
  }

  private log(level: LogLevel, message: string, metadata?: Record<string, unknown>) {
    const entry: LogEntry = {
      level,
      message,
      timestamp: new Date().toISOString(),
      metadata: metadata ? { ...this.baseFields, ...metadata } : this.baseFields,
    };

    const line = JSON.stringify(entry);

    switch (level) {
      case "debug":
        if (process.env.NODE_ENV !== "production") {
          console.debug(line);
        }
        break;
      case "info":
        console.info(line);
        break;
      case "warn":
        console.warn(line);
        break;
      case "error":
        console.error(line);
        break;
      default:
        console.log(line);
    }
  }
}

export function getLogger() {
  const globalScope = globalThis as typeof globalThis & {
    [GLOBAL_KEY]?: Logger;
  };

  if (!globalScope[GLOBAL_KEY]) {
    globalScope[GLOBAL_KEY] = new Logger({ service: "pace-trace" });
  }

  return globalScope[GLOBAL_KEY];
}

export function withRequestLogger(context: Record<string, unknown>) {
  return getLogger().child(context);
}
