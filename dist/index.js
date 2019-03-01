import { AndroidManifest, TagAttribute } from './AndroidManifest';
import { ResourceTable } from './ResourceTable';
import * as util from './util';
var ApkInfo = /** @class */ (function () {
    function ApkInfo(buffer1, buffer2) {
        var magicNumber = util.uint8ArrayToHex(new Uint8Array(buffer1, 0, 4));
        if (magicNumber === AndroidManifest.MAGIC_NUMBER) {
            this.manifest = new AndroidManifest(buffer1);
            this.resource = new ResourceTable(buffer2);
        }
        else {
            this.manifest = new AndroidManifest(buffer2);
            this.resource = new ResourceTable(buffer1);
        }
    }
    ApkInfo.prototype.getPackage = function () {
        var attribute = this.manifest.getTagAttribute('package');
        if (attribute) {
            if (attribute.type === TagAttribute.ATTR_STRING) {
                return this.manifest.getStringValue(attribute.valueString);
            }
            else if (attribute.type === TagAttribute.ATTR_REFERENCE) {
                return this.resource.getResource(attribute.data);
            }
        }
        return '';
    };
    ApkInfo.prototype.getVersionName = function () {
        var attribute = this.manifest.getTagAttribute('versionName');
        if (attribute) {
            if (attribute.type === TagAttribute.ATTR_STRING) {
                return this.manifest.getStringValue(attribute.valueString);
            }
            else if (attribute.type === TagAttribute.ATTR_REFERENCE) {
                return this.resource.getResource(attribute.data);
            }
        }
        return '';
    };
    ApkInfo.prototype.getLabel = function () {
        var attribute = this.manifest.getLabelAttribute();
        if (attribute) {
            if (attribute.type === TagAttribute.ATTR_STRING) {
                return this.manifest.getStringValue(attribute.valueString);
            }
            else if (attribute.type === TagAttribute.ATTR_REFERENCE) {
                return this.resource.getResource(attribute.data);
            }
        }
        return '';
    };
    return ApkInfo;
}());
export default ApkInfo;
//# sourceMappingURL=index.js.map