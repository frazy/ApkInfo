import { AndroidManifest } from './AndroidManifest';
import { ResourceTable } from './ResourceTable';
export default class ApkInfo {
    manifest: AndroidManifest;
    resource: ResourceTable;
    constructor(buffer1: ArrayBuffer, buffer2: ArrayBuffer);
    getPackage(): string;
    getVersionName(): string;
    getLabel(): string;
}
