// Types used for transports

export type GenericMCPResponseContent = {
  type: "text",
  text: string
} ;

export type GenericMCPResponse = {
  content: GenericMCPResponseContent[]
};