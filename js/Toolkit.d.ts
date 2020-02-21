declare namespace Toolkit {
    export function FinalPointer<T, V extends string>(thiz: T, propertie: V): T;
    export class Optional<T> {
        static of<T>(value: T): Optional<T>;
        static empty<T>(): Optional<T>;
        static ofNullable<T>(value: T): Optional<T>;
        get(): T;
        isPresent(): boolean;
        ifPresent(func: (value: T) => void): void;
        isEmpty(): boolean;
        ifPresentOrElse(func: (value: T) => void, emp: () => void): void;
        filter(filter: (value: T) => boolean): Optional<T>;
        map<V>(mapper: (value: T) => V): Optional<V>;
        orElseGet(func: () => T): T;
        orElse<O>(value: O): T | O;
        orElseThrow(func: () => Error): T;
    }
    export function ProxyMapping(source: any, proxy: any, properties: string[], onlyread?: boolean): void;
    export class JsonBuilder<T> {
        static create(): JsonBuilder<any>;
        static create(val: T): JsonBuilder<T>;
        name(name: string): JsonBuilder<T>;
        value(value: any): JsonBuilder<T>;
        beginArray(): JsonBuilder<T>;
        beginObject(): JsonBuilder<T>;
        end(): JsonBuilder<T> | T;
        endObject(): JsonBuilder<T> | T;
        endArray(): JsonBuilder<T> | T;
        finish(): T;
    }
}
declare class BBox<T extends HTMLElement>{
    constructor<O extends HTMLElement>(dom: O): BBox<O>;
    readonly dom: T;
    append(element: Node | BBox<any>): this;
    text(txt: string): this;
    html(htm: string): this;
    css<P extends keyof CSSStyleDeclaration>(prop: P, value: CSSStyleDeclaration[P]): this;
    create<K extends keyof HTMLElementTagNameMap>(tag: K, options?: ElementCreationOptions): BBox<HTMLElementTagNameMap[K]>;
    create<K extends keyof HTMLElementDeprecatedTagNameMap>(tag: K, options?: ElementCreationOptions): BBox<HTMLElementDeprecatedTagNameMap[K]>;
    create(tag: string): BBox<HTMLElement>;
    parent(): BBox<HTMLElement>;
    node(txt: string): this;
    span(txt: string): BBox<HTMLSpanElement>;
    on<K extends keyof HTMLElementEventMap>(type: K, listener: (this: HTMLElement, ev: HTMLElementEventMap[K]) => any, options?: boolean | AddEventListenerOptions): this;
    on(type: string, listener: EventListenerOrEventListenerObject, options?: boolean | AddEventListenerOptions): this;
    event<K extends keyof HTMLElementEventMap>(type: K, listener: (this: HTMLElement, ev: HTMLElementEventMap[K]) => any, options?: boolean | AddEventListenerOptions): this;
    event(type: string, listener: EventListenerOrEventListenerObject, options?: boolean | AddEventListenerOptions): this;
    prop<K extends keyof T>(key: K): T[K];
    propertie<K extends keyof T>(key: K, value: T[K]): this;
    propertie(key: string, value: any): this;
    attr(key: string, value: string): this;
    att(key: string): string;
    invoke(func: (dom: T, bbox?: BBox<T>) => void): this;
    newLink(href: string, text: string): this;
    newLink(href: string, text: string, returnLink: true): BBox<HTMLLinkElement>;
    newLink(href: string, text: string, returnLink: false): this;
    newLink(href: string, text: string, returnLink: boolean): this | BBox<HTMLLinkElement>;
    color(color: string): this;
    bg(background: string): this;
    classAppend(className: string): this;
    static create<K extends keyof HTMLElementTagNameMap>(tagName: K): BBox<HTMLElementTagNameMap[K]>;
    static create<K extends keyof HTMLElementDeprecatedTagNameMap>(tagName: K): BBox<HTMLElementDeprecatedTagNameMap[K]>;
    static create(tagName: string): BBox<HTMLElement>;
    static newLink(href: string, text: string): HTMLLinkElement;
    static newLine(href: string, text: string, returnLink: true): BBox<HTMLLinkElement>;
    static newLine(href: string, text: string, returnLink: false): HTMLLinkElement;
    static newLine(href: string, text: string, returnLink: boolean): HTMLLinkElement | BBox<HTMLLinkElement>;
}