
Parse the AndroidManifest.xml and resources.arsc file in the apk package (apk already has zipjs unpacked)
see:
https://blog.csdn.net/jiangwei0910410003/article/details/50568487
https://blog.csdn.net/jiangwei0910410003/article/details/50628894

eg:
import JSZip from 'jszip';
import ApkInfo from '../../../components/AndroidManifest';

JSZip.loadAsync(file)
  .then(zip => {
    zip.file("AndroidManifest.xml").async("arraybuffer").then(buffer => {
      JSZip.loadAsync(file).then(zip2 => {
        zip2.file("resources.arsc").async("arraybuffer").then(buffer2 => {
          const apkInfo = new ApkInfo(buffer, buffer2);
          console.log(`解析成功！包名：${apkInfo.getPackage()}，version：${apkInfo.getVersionName()}, label: ${apkInfo.getLabel()}`);
        });
      });
    });
  }, e => {
  console.log(`解析apk失败：${e.message}`);
});


由于jszip^3.1.5版本存在bug，see：
https://github.com/Stuk/jszip/issues/543
fork了一份代码，修改后publish到了npm，所以请：
npm install jszip-issue-543 --save
import JSZip from 'jszip-issue-543';
