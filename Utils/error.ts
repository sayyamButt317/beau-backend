

export const getErrorMessage = (err: unknown): string =>
    err instanceof Error ? err.message : "Internal server error";