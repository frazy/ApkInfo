export declare class ResourceTable {
    tableType: string;
    headerSize: number;
    fileSize: number;
    packageCount: number;
    stringPool: StringPool;
    package: Package;
    constructor(buffer: ArrayBuffer);
    getResource(resourceId: number): string;
}
declare class StringPool {
    static UTF8_FLAG: number;
    chunkType: string;
    chunkHeaderSize: number;
    chunkSize: number;
    stringCount: number;
    styleCount: number;
    flags: number;
    stringPoolOffset: number;
    stylePoolOffset: number;
    stringOffsets: number[];
    styleOffsets: number[];
    stringPool: string[];
    stylePool: string[];
    constructor(array: Uint8Array);
}
declare class Package {
    static TYPE: string;
    static TYPE_SPEC: string;
    chunkType: string;
    chunkHeaderSize: number;
    chunkSize: number;
    id: number;
    name: string;
    typeOffset: number;
    lastType: number;
    keyOffset: number;
    lastKey: number;
    typePool: StringPool;
    keyPool: StringPool;
    typeSpecArray: TypeSpec[];
    typeArray: Type[];
    constructor(array: Uint8Array);
}
declare class TypeSpec {
    chunkType: string;
    chunkHeaderSize: number;
    chunkSize: number;
    id: number;
    entryCount: number;
    entryArray: number[];
    constructor(array: Uint8Array);
}
declare class Type {
    chunkType: string;
    chunkHeaderSize: number;
    chunkSize: number;
    id: number;
    entryCount: number;
    entryPoolOffset: number;
    entryOffsets: number[];
    entryArray: Entry[];
    constructor(array: Uint8Array);
}
declare class Entry {
    static FLAG_COMPLEX: number;
    size: number;
    flags: number;
    index: number;
    dataSize: number;
    dataType: number;
    dataValue: number;
    constructor(array: Uint8Array);
}
export {};
