// src/@types/hunspell-spellchecker.d.ts

declare module 'hunspell-spellchecker' {
    export interface Dictionary {
        aff: string;
        dic: string;
        // Add any other properties you find necessary based on your usage
    }

    export default class Hunspell {
        constructor();
        use(dictionary: Dictionary): void;
        check(word: string): boolean;
        suggest(word: string): string[];
    }
}
