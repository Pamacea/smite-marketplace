declare module "better-sqlite3" {
  interface Database {
    prepare(sql: string): Statement;
    exec(sql: string): void;
    close(): void;
  }

  interface Statement {
    run(...params: unknown[]): void;
    get(...params: unknown[]): { total: number } | undefined;
  }

  class DatabaseClass {
    constructor(path: string);
    prepare(sql: string): Statement;
    exec(sql: string): void;
    close(): void;
  }

  export default DatabaseClass;
}
