# Code Snippet Server

## Overview

Code Snippet Server is a Model Context Protocol (MCP) server designed to manage and store code snippets across different programming languages. It provides a flexible and extensible way to create, list, and delete code snippets using a standardized server interface.

## Features

- Create code snippets with title, language, and code
- List snippets with optional filtering by language or tag
- Delete snippets by their unique ID
- Localization support
- Persistent local storage

## Prerequisites

- Node.js (18.x, 20.x, or 22.x)
- npm

## Installation

```bash
git clone git@github.com:ngeojiajun-deriv/mcp-code-snippets.git
npm run build
npm link
```

## Usage

The server exposes three primary tools:

### 1. Create Snippet

Create a new code snippet with a title, language, and code.

Parameters:
- `title` (required): Name of the snippet
- `language` (required): Programming language
- `code` (required): The actual code snippet
- `tags` (optional): Array of tags for categorization

### 2. List Snippets

Retrieve a list of snippets with optional filtering.

Parameters:
- `language` (optional): Filter snippets by programming language
- `tag` (optional): Filter snippets by tag

### 3. Delete Snippet

Remove a snippet from storage.

Parameters:
- `id` (required): Unique identifier of the snippet to delete

## Development

### Build

```bash
npm run build
```

### Lint

```bash
npm run lint
```

## Contributing

Any PRs are welcome
