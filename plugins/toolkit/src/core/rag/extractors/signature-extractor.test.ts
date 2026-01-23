/**
 * Tests for Signature Extractor
 *
 * @module core/rag/extractors/signature-extractor.test
 */

import { Project } from 'ts-morph';
import {
  buildFunctionSignature,
  buildClassSignature,
  buildMethodSignature,
} from './signature-extractor.js';

describe('Signature Extractor', () => {
  let project: Project;

  beforeEach(() => {
    project = new Project({
      useInMemoryFileSystem: true,
      compilerOptions: {
        allowJs: true,
        checkJs: false,
      },
    });
  });

  afterEach(() => {
    project = null as unknown as Project;
  });

  describe('buildFunctionSignature', () => {
    it('should extract function signature', () => {
      const sourceFile = project.createSourceFile(
        'test.ts',
        `export function testFunction(a: string, b: number): boolean { return true; }`
      );
      const func = sourceFile.getFunctions()[0];
      const signature = buildFunctionSignature(func);

      expect(signature).toContain('function testFunction');
      expect(signature).toContain('a: string');
      expect(signature).toContain('b: number');
      expect(signature).toContain('boolean');
      expect(signature).toContain('export');
    });

    it('should extract async function signature', () => {
      const sourceFile = project.createSourceFile(
        'test.ts',
        `export async function asyncFunction(): Promise<void> {}`
      );
      const func = sourceFile.getFunctions()[0];
      const signature = buildFunctionSignature(func);

      expect(signature).toContain('async');
      expect(signature).toContain('asyncFunction');
    });

    it('should return null for invalid functions', () => {
      const signature = buildFunctionSignature(null as unknown as any);
      expect(signature).toBeNull();
    });
  });

  describe('buildClassSignature', () => {
    it('should extract class signature', () => {
      const sourceFile = project.createSourceFile(
        'test.ts',
        `export class MyClass {}`
      );
      const cls = sourceFile.getClasses()[0];
      const signature = buildClassSignature(cls);

      expect(signature).toContain('class MyClass');
      expect(signature).toContain('export');
      expect(signature).toContain('{');
    });

    it('should extract class with extends', () => {
      const sourceFile = project.createSourceFile(
        'test.ts',
        `export class Child extends Parent {}`
      );
      const cls = sourceFile.getClasses()[0];
      const signature = buildClassSignature(cls);

      expect(signature).toContain('extends Parent');
    });

    it('should extract abstract class signature', () => {
      const sourceFile = project.createSourceFile(
        'test.ts',
        `export abstract class AbstractClass {}`
      );
      const cls = sourceFile.getClasses()[0];
      const signature = buildClassSignature(cls);

      expect(signature).toContain('abstract');
    });
  });

  describe('buildMethodSignature', () => {
    it('should extract method signature', () => {
      const sourceFile = project.createSourceFile(
        'test.ts',
        `class MyClass {
          public myMethod(x: string): number { return 0; }
        }`
      );
      const cls = sourceFile.getClasses()[0];
      const method = cls.getMethods()[0];
      const signature = buildMethodSignature(method);

      expect(signature).toContain('myMethod');
      expect(signature).toContain('x: string');
      expect(signature).toContain('number');
    });

    it('should extract static method signature', () => {
      const sourceFile = project.createSourceFile(
        'test.ts',
        `class MyClass {
          static staticMethod(): void {}
        }`
      );
      const cls = sourceFile.getClasses()[0];
      const method = cls.getMethods()[0];
      const signature = buildMethodSignature(method);

      expect(signature).toContain('static');
    });

    it('should extract async method signature', () => {
      const sourceFile = project.createSourceFile(
        'test.ts',
        `class MyClass {
          async asyncMethod(): Promise<void> {}
        }`
      );
      const cls = sourceFile.getClasses()[0];
      const method = cls.getMethods()[0];
      const signature = buildMethodSignature(method);

      expect(signature).toContain('async');
    });
  });
});
