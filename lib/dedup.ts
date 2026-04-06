/**
 * Deduplication Utility — external_id pattern
 *
 * Prevents processing the same item twice by tracking external IDs.
 * Uses an in-memory Set by default, with optional persistence callback.
 *
 * @module dedup
 */

export interface DedupStore {
  /** Check if an ID has been seen before */
  has(externalId: string): Promise<boolean>;
  /** Mark an ID as processed */
  add(externalId: string): Promise<void>;
  /** Get count of tracked IDs */
  size(): Promise<number>;
}

/**
 * In-memory dedup store. Fast, but lost on restart.
 * Good for single-run scripts and short-lived processes.
 */
export class InMemoryDedupStore implements DedupStore {
  private seen = new Set<string>();

  async has(externalId: string): Promise<boolean> {
    return this.seen.has(externalId);
  }

  async add(externalId: string): Promise<void> {
    this.seen.add(externalId);
  }

  async size(): Promise<number> {
    return this.seen.size;
  }
}

/**
 * File-based dedup store. Persists across restarts.
 * Stores one external_id per line in a text file.
 */
export class FileDedupStore implements DedupStore {
  private seen = new Set<string>();
  private filePath: string;
  private loaded = false;

  constructor(filePath: string) {
    this.filePath = filePath;
  }

  private async load(): Promise<void> {
    if (this.loaded) return;
    try {
      const fs = await import("node:fs/promises");
      const content = await fs.readFile(this.filePath, "utf-8");
      for (const line of content.split("\n")) {
        const trimmed = line.trim();
        if (trimmed) this.seen.add(trimmed);
      }
    } catch {
      // File doesn't exist yet — start empty
    }
    this.loaded = true;
  }

  async has(externalId: string): Promise<boolean> {
    await this.load();
    return this.seen.has(externalId);
  }

  async add(externalId: string): Promise<void> {
    await this.load();
    if (this.seen.has(externalId)) return;
    this.seen.add(externalId);
    const fs = await import("node:fs/promises");
    await fs.appendFile(this.filePath, externalId + "\n");
  }

  async size(): Promise<number> {
    await this.load();
    return this.seen.size;
  }
}

/**
 * Process items with deduplication.
 *
 * @param items - Items to process
 * @param getId - Function to extract external ID from an item
 * @param processor - Async function to process each new item
 * @param store - Dedup store (defaults to in-memory)
 * @returns Object with counts of processed and skipped items
 *
 * @example
 * ```typescript
 * const videos = [{ id: "abc123", title: "..." }, { id: "def456", title: "..." }];
 * const result = await processWithDedup(
 *   videos,
 *   (v) => v.id,
 *   async (v) => { console.log("Processing:", v.title); }
 * );
 * console.log(result); // { processed: 2, skipped: 0 }
 * ```
 */
export async function processWithDedup<T>(
  items: T[],
  getId: (item: T) => string,
  processor: (item: T) => Promise<void>,
  store: DedupStore = new InMemoryDedupStore()
): Promise<{ processed: number; skipped: number }> {
  let processed = 0;
  let skipped = 0;

  for (const item of items) {
    const externalId = getId(item);

    if (await store.has(externalId)) {
      skipped++;
      continue;
    }

    await processor(item);
    await store.add(externalId);
    processed++;
  }

  return { processed, skipped };
}
