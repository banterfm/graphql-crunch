declare module 'graphql-crunch' {
  export type Uncrunched =
    | { [key: string]: any }
    | Array<{ [key: string]: any }>

  export type Crunched = Array<
    | null
    | number
    | string
    | boolean
    | { [key: string]: number }
    | number[]
  >

  export function crunch(data: Uncrunched): Crunched

  export function uncrunch(data: Crunched): Uncrunched
}
