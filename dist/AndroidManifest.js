import * as util from './util';
var AndroidManifest = /** @class */ (function () {
    function AndroidManifest(buffer) {
        var _a;
        var _this = this;
        this.magicNumber = util.uint8ArrayToHex(new Uint8Array(buffer, 0, 4));
        this.fileSize = util.uint8ArrayToInt(new Uint8Array(buffer, 4, 4));
        // console.log(`magicNumber: ${this.magicNumber}, fileSize: ${this.fileSize}`);
        var chunkOffset = 8;
        var chunkSize = util.uint8ArrayToInt(new Uint8Array(buffer, chunkOffset + 4 * 1, 4));
        this.stringChunk = new StringChunk(new Uint8Array(buffer, chunkOffset, chunkSize));
        // console.log('stringChunk', this.stringChunk);
        chunkOffset += chunkSize;
        chunkSize = util.uint8ArrayToInt(new Uint8Array(buffer, chunkOffset + 4 * 1, 4));
        this.resourceIdChunk = new ResourceIdChunk(new Uint8Array(buffer, chunkOffset, chunkSize));
        // console.log('resourceIdChunk', this.resourceIdChunk);
        var chunkType = '';
        chunkOffset += chunkSize;
        var chunks = [];
        var startTagChunk = null;
        this.attributes = [];
        for (; chunkOffset < this.fileSize;) {
            chunkType = util.uint8ArrayToHex(new Uint8Array(buffer, chunkOffset + 4 * 0, 4));
            chunkSize = util.uint8ArrayToInt(new Uint8Array(buffer, chunkOffset + 4 * 1, 4));
            if (chunkSize <= 0) {
                break;
            }
            if (chunkType === AndroidManifest.CHUNK_TYPE_START_NAMESPACE) {
                chunks.push(new StartNamespaceChunk(new Uint8Array(buffer, chunkOffset, chunkSize)));
            }
            else if (chunkType === AndroidManifest.CHUNK_TYPE_END_NAMESPACE) {
                chunks.push(new EndNamespaceChunk(new Uint8Array(buffer, chunkOffset, chunkSize)));
            }
            else if (chunkType === AndroidManifest.CHUNK_TYPE_START_TAG) {
                startTagChunk = new StartTagChunk(new Uint8Array(buffer, chunkOffset, chunkSize));
                chunks.push(startTagChunk);
                (_a = this.attributes).push.apply(_a, startTagChunk.attributes);
                if (this.stringChunk.stringPool[startTagChunk.name] === 'application') {
                    var attribute = startTagChunk.attributes.find(function (e) { return _this.stringChunk.stringPool[e.name] === 'label'; });
                    // console.log('atrribute', attribute)
                    this.label = attribute;
                }
            }
            else if (chunkType === AndroidManifest.CHUNK_TYPE_END_TAG) {
                chunks.push(new EndTagChunk(new Uint8Array(buffer, chunkOffset, chunkSize)));
            }
            else if (chunkType === AndroidManifest.CHUNK_TYPE_TEXT) {
                chunks.push(new TextChunk(new Uint8Array(buffer, chunkOffset, chunkSize)));
            }
            // next loop
            chunkOffset += chunkSize;
        }
        this.xmlContentChunk = new XmlContentChunk();
        this.xmlContentChunk.chunks = chunks;
        // console.log(this);
    }
    AndroidManifest.prototype.getStringValue = function (index) {
        return this.stringChunk.stringPool[index];
    };
    AndroidManifest.prototype.getTagAttribute = function (name) {
        var _this = this;
        return this.attributes.find(function (e) { return _this.stringChunk.stringPool[e.name] === name && e.valueString > 0; });
    };
    AndroidManifest.prototype.getTagAttributeValue = function (name) {
        var atrribute = this.getTagAttribute(name);
        return atrribute ? this.stringChunk.stringPool[atrribute.valueString] : '';
    };
    AndroidManifest.prototype.getLabelAttribute = function () {
        return this.label;
    };
    AndroidManifest.MAGIC_NUMBER = '00080003';
    AndroidManifest.CHUNK_TYPE_STRING = '001c0001';
    AndroidManifest.CHUNK_TYPE_RESOURCE_ID = '00080180';
    AndroidManifest.CHUNK_TYPE_START_NAMESPACE = '00100100';
    AndroidManifest.CHUNK_TYPE_END_NAMESPACE = '00100101';
    AndroidManifest.CHUNK_TYPE_START_TAG = '00100102';
    AndroidManifest.CHUNK_TYPE_END_TAG = '00100103';
    AndroidManifest.CHUNK_TYPE_TEXT = '00100104';
    return AndroidManifest;
}());
export { AndroidManifest };
var Chunk = /** @class */ (function () {
    function Chunk() {
    }
    return Chunk;
}());
var StringChunk = /** @class */ (function () {
    function StringChunk(array) {
        // super();
        this.chunkType = util.uint8ArrayToHex(array.subarray(4 * 0, 4 * 1));
        this.chunkSize = util.uint8ArrayToInt(array.subarray(4 * 1, 4 * 2));
        this.stringCount = util.uint8ArrayToInt(array.subarray(4 * 2, 4 * 3));
        this.styleCount = util.uint8ArrayToInt(array.subarray(4 * 3, 4 * 4));
        this.flags = util.uint8ArrayToInt(array.subarray(4 * 4, 4 * 5));
        this.stringPoolOffset = util.uint8ArrayToInt(array.subarray(4 * 5, 4 * 6));
        this.stylePoolOffset = util.uint8ArrayToInt(array.subarray(4 * 6, 4 * 7));
        var utf8 = (this.flags & StringChunk.UTF8_FLAG) != 0;
        // console.log('flags', this.flags, 'utf8', utf8);
        // stringOffsets
        this.stringOffsets = [];
        var offset = 0;
        for (var i = 0; i < this.stringCount; i++) {
            offset = util.uint8ArrayToInt(array.subarray(4 * (7 + i), 4 * (8 + i)));
            this.stringOffsets.push(offset);
        }
        // styleOffsets
        this.styleOffsets = [];
        // TODO
        // stringPool
        this.stringPool = [];
        var str = '';
        var length = 0;
        // offset = this.stringPoolOffset;
        for (var i = 0; i < this.stringCount; i++) {
            offset = this.stringPoolOffset + this.stringOffsets[i];
            if (utf8) {
                length = array[offset + 1] & 0x7F; // 头2位的最后1个字节表示字符串长度
            }
            else {
                length = util.uint8ArrayToShort(array.subarray(offset, offset + 2)) * 2; // 头2位表示字符串长度，并且一个字符占2个字节
            }
            str = util.uint8ArrayToStr(array.subarray(offset + 2, offset + 2 + length), utf8);
            // console.log('index=',i,'length=',length,'str=',str);
            this.stringPool.push(str);
            // offset += length + 4;
        }
        // stylePool
        this.stylePool = [];
        // TODO
    }
    StringChunk.UTF8_FLAG = 1 << 8;
    return StringChunk;
}());
var ResourceIdChunk = /** @class */ (function () {
    function ResourceIdChunk(array) {
        // super();
        this.chunkType = util.uint8ArrayToHex(array.subarray(4 * 0, 4 * 1));
        this.chunkSize = util.uint8ArrayToInt(array.subarray(4 * 1, 4 * 2));
        // resourceIds
        this.resourceIds = [];
        var offset = 0;
        var id = 0;
        var size = this.chunkSize / 4 - 2;
        for (var i = 0; i < size; i++) {
            offset = 4 * 2 + 4 * i;
            id = util.uint8ArrayToInt(array.subarray(offset, offset + 4));
            // console.log('index=',i,'id=',id);
            this.resourceIds.push(id);
        }
    }
    return ResourceIdChunk;
}());
var XmlContentChunk = /** @class */ (function () {
    function XmlContentChunk() {
    }
    return XmlContentChunk;
}());
var StartNamespaceChunk = /** @class */ (function () {
    function StartNamespaceChunk(array) {
        // super();
        this.chunkType = util.uint8ArrayToHex(array.subarray(4 * 0, 4 * 1));
        this.chunkSize = util.uint8ArrayToInt(array.subarray(4 * 1, 4 * 2));
        this.lineNumber = util.uint8ArrayToInt(array.subarray(4 * 2, 4 * 3));
        this.unknown = util.uint8ArrayToHex(array.subarray(4 * 3, 4 * 4));
        this.prefix = util.uint8ArrayToInt(array.subarray(4 * 4, 4 * 5));
        this.uri = util.uint8ArrayToInt(array.subarray(4 * 5, 4 * 6));
    }
    return StartNamespaceChunk;
}());
var EndNamespaceChunk = /** @class */ (function () {
    function EndNamespaceChunk(array) {
        // super();
        this.chunkType = util.uint8ArrayToHex(array.subarray(4 * 0, 4 * 1));
        this.chunkSize = util.uint8ArrayToInt(array.subarray(4 * 1, 4 * 2));
        this.lineNumber = util.uint8ArrayToInt(array.subarray(4 * 2, 4 * 3));
        this.unknown = util.uint8ArrayToHex(array.subarray(4 * 3, 4 * 4));
        this.prefix = util.uint8ArrayToInt(array.subarray(4 * 4, 4 * 5));
        this.uri = util.uint8ArrayToInt(array.subarray(4 * 5, 4 * 6));
    }
    return EndNamespaceChunk;
}());
var StartTagChunk = /** @class */ (function () {
    function StartTagChunk(array) {
        // super();
        this.chunkType = util.uint8ArrayToHex(array.subarray(4 * 0, 4 * 1));
        this.chunkSize = util.uint8ArrayToInt(array.subarray(4 * 1, 4 * 2));
        this.lineNumber = util.uint8ArrayToInt(array.subarray(4 * 2, 4 * 3));
        this.unknown = util.uint8ArrayToHex(array.subarray(4 * 3, 4 * 4));
        this.namespaceUri = util.uint8ArrayToInt(array.subarray(4 * 4, 4 * 5));
        this.name = util.uint8ArrayToInt(array.subarray(4 * 5, 4 * 6));
        this.flags = util.uint8ArrayToHex(array.subarray(4 * 6, 4 * 7));
        this.attributeCount = util.uint8ArrayToInt(array.subarray(4 * 7, 4 * 8));
        this.classAtrribute = util.uint8ArrayToHex(array.subarray(4 * 8, 4 * 9));
        // atrributes
        this.attributes = [];
        var offset = 0;
        for (var i = 0; i < this.attributeCount; i++) {
            offset = 4 * 9 + 4 * 5 * i;
            this.attributes.push(new TagAttribute(array.subarray(offset + 4 * 0, offset + 4 * 5)));
            // console.log('index=',i,'atrribute=',this.atrributes[i]);
        }
    }
    return StartTagChunk;
}());
var EndTagChunk = /** @class */ (function () {
    function EndTagChunk(array) {
        // super();
        this.chunkType = util.uint8ArrayToHex(array.subarray(4 * 0, 4 * 1));
        this.chunkSize = util.uint8ArrayToInt(array.subarray(4 * 1, 4 * 2));
        this.lineNumber = util.uint8ArrayToInt(array.subarray(4 * 2, 4 * 3));
        this.unknown = util.uint8ArrayToHex(array.subarray(4 * 3, 4 * 4));
        this.namespaceUri = util.uint8ArrayToInt(array.subarray(4 * 4, 4 * 5));
        this.name = util.uint8ArrayToInt(array.subarray(4 * 5, 4 * 6));
    }
    return EndTagChunk;
}());
var TextChunk = /** @class */ (function () {
    function TextChunk(array) {
        // super();
        this.chunkType = util.uint8ArrayToHex(array.subarray(4 * 0, 4 * 1));
        this.chunkSize = util.uint8ArrayToInt(array.subarray(4 * 1, 4 * 2));
        this.lineNumber = util.uint8ArrayToInt(array.subarray(4 * 2, 4 * 3));
        this.unknown1 = util.uint8ArrayToHex(array.subarray(4 * 3, 4 * 4));
        this.name = util.uint8ArrayToInt(array.subarray(4 * 4, 4 * 5));
        this.unknown2 = util.uint8ArrayToHex(array.subarray(4 * 5, 4 * 6));
        this.unknown3 = util.uint8ArrayToHex(array.subarray(4 * 6, 4 * 7));
    }
    return TextChunk;
}());
var TagAttribute = /** @class */ (function () {
    function TagAttribute(array) {
        this.namespaceUri = util.uint8ArrayToInt(array.subarray(4 * 0, 4 * 1));
        this.name = util.uint8ArrayToInt(array.subarray(4 * 1, 4 * 2));
        this.valueString = util.uint8ArrayToInt(array.subarray(4 * 2, 4 * 3));
        this.type = util.uint8ArrayToInt(array.subarray(4 * 3, 4 * 4)) >> 24; // 在获取到type值的时候需要右移24位
        this.data = util.uint8ArrayToInt(array.subarray(4 * 4, 4 * 5));
    }
    TagAttribute.ATTR_REFERENCE = 1;
    TagAttribute.ATTR_ATTRIBUTE = 2;
    TagAttribute.ATTR_STRING = 3;
    return TagAttribute;
}());
export { TagAttribute };
//# sourceMappingURL=AndroidManifest.js.map