import { BrowserManager } from "./BrowserManager";
import { HttpServer } from "./HttpServer";

export type ManagableObjects = HttpServer | BrowserManager;

export class ObjectManager {
  private static instance: ObjectManager = new ObjectManager();

  public static getInstance(): ObjectManager {
    return this.instance;
  }

  private objectTable: Map<string, ManagableObjects>;

  private constructor() {
    this.objectTable = new Map<string, ManagableObjects>();
  }

  public registerObjectIfNotExists(
    name: string,
    object: ManagableObjects
  ): void {
    if (this.objectTable.has(name)) return;
    this.registerObject(name, object);
  }

  public registerObject(name: string, object: ManagableObjects): void {
    this.objectTable.set(name, object);
  }

  public getObject(name: string): ManagableObjects | undefined {
    return this.objectTable.get(name);
  }
}
