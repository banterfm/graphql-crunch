declare module 'graphql-crunch' {
  export type CrunchedData = Array<
    | null
    | number
    | string
    | boolean
    | { [key: string]: number }
    | number[]
  >

  export function crunch(data: any): CrunchedData

  export function uncrunch(data: CrunchedData): any
}
