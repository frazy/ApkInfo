import { AndroidManifest, TagAttribute } from './AndroidManifest';
import { ResourceTable } from './ResourceTable';
import * as util from './util';

export default class ApkInfo {
  manifest: AndroidManifest;
  resource: ResourceTable;

  constructor(buffer1: ArrayBuffer, buffer2: ArrayBuffer) {
    let magicNumber: string = util.uint8ArrayToHex(new Uint8Array(buffer1, 0, 4));
    if (magicNumber === AndroidManifest.MAGIC_NUMBER) {
      this.manifest = new AndroidManifest(buffer1);
      this.resource = new ResourceTable(buffer2);
    } else {
      this.manifest = new AndroidManifest(buffer2);
      this.resource = new ResourceTable(buffer1);
    }
  }

  public getPackage(): string {
    const attribute: TagAttribute = this.manifest.getTagAttribute('package');
    if (attribute) {
      if (attribute.type === TagAttribute.ATTR_STRING) {
        return this.manifest.getStringValue(attribute.valueString);
      } else if (attribute.type === TagAttribute.ATTR_REFERENCE) {
        return this.resource.getResource(attribute.data);
      }
    }
    return '';
  }
  public getVersionName(): string {
    const attribute: TagAttribute = this.manifest.getTagAttribute('versionName');
    if (attribute) {
      if (attribute.type === TagAttribute.ATTR_STRING) {
        return this.manifest.getStringValue(attribute.valueString);
      } else if (attribute.type === TagAttribute.ATTR_REFERENCE) {
        return this.resource.getResource(attribute.data);
      }
    }
    return '';
  }
  public getLabel(): string {
    const attribute: TagAttribute = this.manifest.getLabelAttribute();
    if (attribute) {
      if (attribute.type === TagAttribute.ATTR_STRING) {
        return this.manifest.getStringValue(attribute.valueString);
      } else if (attribute.type === TagAttribute.ATTR_REFERENCE) {
        return this.resource.getResource(attribute.data);
      }
    }
    return '';
  }

}