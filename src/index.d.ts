declare module 'graphql-crunch' {
  export function crunch(data: object | object[]): any[]

  export function uncrunch(data: any[]): object | object[]
}
