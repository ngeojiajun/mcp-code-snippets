import * as fs from 'fs/promises';
import * as path from 'path';
import { CodeSnippet } from "../types/snippets.js";
import { SnippetQuery, StorageBase } from "./storage_base.js";

export class LocalStorage implements StorageBase {
  private snippetsFilePath: string;
  private snippets: CodeSnippet[] = [];

  constructor() {
    this.snippetsFilePath = path.join(process.env.HOME || '', '.code-snippets.json');
  }

  async Initialize(): Promise<void> {
    try {
      await fs.access(this.snippetsFilePath);
    } catch {
      await fs.writeFile(this.snippetsFilePath, JSON.stringify([], null, 2));
    }
    await this.ReloadSnippets();
  }

  async ReloadSnippets(): Promise<void> {
    const rawData = await fs.readFile(this.snippetsFilePath, 'utf-8');
    this.snippets = JSON.parse(rawData);
  }

  async ListSnippets(query?: SnippetQuery): Promise<CodeSnippet[]> {
    // 単一のfilter関数で全フィルタリング条件を処理
    return this.snippets.filter(s => {
      if (query) {
        if (query.language && s.language.toLowerCase() !== query.language.toLowerCase()) {
          return false;
        }

        if (query.tag && !s.tags.some(t => t.toLowerCase() === query.tag!.toLowerCase())) {
          return false;
        }

        if (query.title && !s.title.toLowerCase().includes(query.title.toLowerCase() || '')) {
          return false;
        }
      }
      return true;
    });
  }

  async InsertSnippet(snippet: CodeSnippet): Promise<void> {
    // 既存のスニペットを上書きしないよう、IDが存在しない場合のみ追加
    if (!this.snippets.some(s => s.id === snippet.id)) {
      this.snippets.push(snippet);
      await this.saveSnippets();
    }
  }

  async DeleteSnippet(id: string): Promise<boolean> {
    const initialLength = this.snippets.length;
    this.snippets = this.snippets.filter(s => s.id !== id);

    if (this.snippets.length < initialLength) {
      await this.saveSnippets();
      return true;
    }
    return false;
  }

  private async saveSnippets(): Promise<void> {
    await fs.writeFile(this.snippetsFilePath, JSON.stringify(this.snippets, null, 2));
  }
}
