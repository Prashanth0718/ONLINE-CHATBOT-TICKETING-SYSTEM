declare module 'emoji-dictionary' {
    export function getUnicode(name: string): string;
    export function getName(unicode: string): string;
    export function names(): string[];
  }
  