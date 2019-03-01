/* utils */
export var uint8ArrayToHex = function (arr) {
    return Array.prototype.map.call(arr.slice().reverse(), function (x) { return ('00'.concat(x.toString(16))).slice(-2); }).join('');
};
export var uint8ArrayToInt = function (arr) {
    return (arr[0] & 0xff) | ((arr[1] << 8) & 0xff00)
        | ((arr[2] << 24) >>> 8) | (arr[3] << 24);
    // return Buffer.from(arr.slice().reverse()).readIntBE(0, arr.length);
};
export var uint8ArrayToShort = function (arr) {
    // return Buffer.from(arr.slice().reverse()).readIntBE(0, arr.length);
    var s0 = (arr[0] & 0xff);
    var s1 = (arr[1] & 0xff);
    s1 <<= 8;
    return (s0 | s1);
};
export var uint8ArrayToStr = function (array, utf8) {
    if (utf8 === void 0) { utf8 = false; }
    return new TextDecoder(utf8 ? 'utf-8' : 'utf-16').decode(array);
};
export var utf8ArrayToStr = function (array) {
    var out, i, len, c;
    var char2, char3;
    out = "";
    len = array.length;
    i = 0;
    while (i < len) {
        c = array[i++];
        switch (c >> 4) {
            case 0:
                // trim 0
                break;
            case 1:
            case 2:
            case 3:
            case 4:
            case 5:
            case 6:
            case 7:
                // 0xxxxxxx
                out += String.fromCharCode(c);
                break;
            case 12:
            case 13:
                // 110x xxxx   10xx xxxx
                char2 = array[i++];
                out += String.fromCharCode(((c & 0x1F) << 6) | (char2 & 0x3F));
                break;
            case 14:
                // 1110 xxxx  10xx xxxx  10xx xxxx
                char2 = array[i++];
                char3 = array[i++];
                out += String.fromCharCode(((c & 0x0F) << 12) |
                    ((char2 & 0x3F) << 6) |
                    ((char3 & 0x3F) << 0));
                break;
            default:
                ;
        }
    }
    return out;
};
export var decodeUTF16LE = function (binaryStr) {
    var cp = [];
    for (var i = 0; i < binaryStr.length; i += 2) {
        cp.push(binaryStr.charCodeAt(i) |
            (binaryStr.charCodeAt(i + 1) << 8));
    }
    return String.fromCharCode.apply(String, cp);
};
//# sourceMappingURL=util.js.map