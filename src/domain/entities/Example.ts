import { BaseEntity } from '@kernelsoftware/shared';

class Example extends BaseEntity {
  text: string;

  toDatabase() {
    return {
      id: this.uuid,
      text: this.text,
      created_at: new Date(this.created_at).toISOString(),
      updated_at: new Date().toISOString(),
    };
  }

  static fromDatabaseToDomain(data: Record<string, unknown>): Example {
    return Example.fromPlain(Example, data);
  }
}

export { Example };
