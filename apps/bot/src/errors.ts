export class UnknownError extends Error {
  constructor(error: unknown) {
    const cause = error instanceof Error ? error : undefined
    const message = error instanceof Error ? error.message : 'Unknown'

    super(message, { cause })

    this.name = 'UnknownError'
  }
}
