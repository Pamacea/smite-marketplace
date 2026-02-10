/**
 * DOT Generator - SMITE v1.6.0
 */

import { PRD, prdToDOT, DOTOptions } from './prd-to-dot';

export type DOTTheme = 'default' | 'dark' | 'modern' | 'minimal';

export class DOTGenerator {
  constructor(private theme: DOTTheme = 'default') {}

  generate(prd: PRD, options: DOTOptions = {}): string {
    return this.applyTheme(prdToDOT(prd, options));
  }

  private applyTheme(dot: string): string {
    if (this.theme === 'dark') {
      return dot.replace(/fillcolor="lightblue"/g, 'fillcolor="#4a90d9"');
    }
    if (this.theme === 'modern') {
      return dot.replace(/\[shape=box\]/g, '[shape=box, style="rounded,filled"]');
    }
    if (this.theme === 'minimal') {
      return dot.replace(/style="filled"/g, '').replace(/fillcolor="[^"]*"/g, '');
    }
    return dot;
  }
}

export function generateDOT(prd: PRD, theme: DOTTheme = 'default'): string {
  return new DOTGenerator(theme).generate(prd);
}
