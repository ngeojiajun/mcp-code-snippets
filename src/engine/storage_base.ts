import { CodeSnippet } from "../types/snippets.js";

export type SnippetQuery = {
  tag?: string,
  title?: string,
  language?: string
};

// StorageBase defines the storage engine that the server could use
export interface StorageBase {
  // Initialize the engine
  Initialize(): Promise<void>
  // Reload snippets
  ReloadSnippets(): Promise<void>
  ListSnippets(query?: SnippetQuery):Promise<CodeSnippet[]>
  // Insert a snippet
  InsertSnippet(snippet: CodeSnippet):Promise<void>
  DeleteSnippet(id: string):Promise<boolean>
};