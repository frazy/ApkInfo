export declare class AndroidManifest {
    static MAGIC_NUMBER: string;
    static CHUNK_TYPE_STRING: string;
    static CHUNK_TYPE_RESOURCE_ID: string;
    static CHUNK_TYPE_START_NAMESPACE: string;
    static CHUNK_TYPE_END_NAMESPACE: string;
    static CHUNK_TYPE_START_TAG: string;
    static CHUNK_TYPE_END_TAG: string;
    static CHUNK_TYPE_TEXT: string;
    magicNumber: string;
    fileSize: number;
    stringChunk: StringChunk;
    resourceIdChunk: ResourceIdChunk;
    xmlContentChunk: XmlContentChunk;
    attributes: TagAttribute[];
    label: TagAttribute;
    constructor(buffer: ArrayBuffer);
    getStringValue(index: number): string;
    getTagAttribute(name: string): TagAttribute;
    getTagAttributeValue(name: string): string;
    getLabelAttribute(): TagAttribute;
}
declare abstract class Chunk {
    chunkType: string;
    chunkSize: number;
}
declare class StringChunk {
    static UTF8_FLAG: number;
    chunkType: string;
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
declare class ResourceIdChunk {
    chunkType: string;
    chunkSize: number;
    resourceIds: number[];
    constructor(array: Uint8Array);
}
declare class XmlContentChunk {
    chunks: Chunk[];
}
export declare class TagAttribute {
    static ATTR_REFERENCE: number;
    static ATTR_ATTRIBUTE: number;
    static ATTR_STRING: number;
    namespaceUri: number;
    name: number;
    valueString: number;
    type: number;
    data: number;
    constructor(array: Uint8Array);
}
export {};
