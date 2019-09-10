/// <reference types="cheerio" />

declare namespace scrapeIt {
    export interface ScrapeOptions {
        [key: string]: string | ScrapeOptionList | ScrapeOptionElement;
    }

    export interface ScrapeOptionElement {
        selector?: string;
        convert?: (value: any) => any;
        how?: string | ((element: CheerioSelector) => any);
        attr?: string;
        trim?: boolean;
        closest?: string;
        eq?: number;
        texteq?: number;
    }

    export interface ScrapeOptionList {
        listItem: string;
        data?: ScrapeOptions;
        convert?: (value: any) => any;
    }

    export interface ScrapeResult<T> {
        data: T,
        $: Cheerio,
        response: any,
        body: string
    }

    export function scrapeHTML<T>(body: CheerioStatic | string, options: ScrapeOptions): T;
}

declare function scrapeIt<T>(url: string | object, opts: scrapeIt.ScrapeOptions): Promise<scrapeIt.ScrapeResult<T>>;

declare function scrapeIt<T>(url: string | object, opts: scrapeIt.ScrapeOptions, cb: (err: any, res: scrapeIt.ScrapeResult<T>) => void): void;
export = scrapeIt;
