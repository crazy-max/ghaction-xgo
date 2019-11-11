import * as download from 'download';
import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';
import * as util from 'util';
import * as restm from 'typed-rest-client/RestClient';
import * as core from '@actions/core';

let osPlat: string = os.platform();
let osArch: string = os.arch();

export async function getXgo(version: string): Promise<string> {
  const selected = await determineVersion(version);
  if (selected) {
    version = selected;
  }

  core.info(`✅ xgo version found: ${version}`);
  const tmpdir = fs.mkdtempSync(path.join(os.tmpdir(), 'xgo-'));
  const fileName = getFileName();
  const downloadUrl = util.format('https://github.com/crazy-max/xgo/releases/download/%s/%s', version, fileName);

  core.info(`⬇️ Downloading ${downloadUrl}...`);
  await download.default(downloadUrl, tmpdir, {filename: fileName});

  fs.chmodSync(path.join(tmpdir, fileName), '755');
  return path.join(tmpdir, fileName);
}

function getFileName(): string {
  const platform: string = osPlat == 'win32' ? 'windows' : osPlat;
  const arch: string = osArch == 'x64' ? 'amd64' : '386';
  const ext: string = osPlat == 'win32' ? '.exe' : '';
  return util.format('xgo_%s_%s%s', platform, arch, ext);
}

interface GitHubRelease {
  tag_name: string;
}

async function determineVersion(version: string): Promise<string> {
  let rest: restm.RestClient = new restm.RestClient('ghaction-xgo', 'https://github.com', undefined, {
    headers: {
      Accept: 'application/json'
    }
  });

  let res: restm.IRestResponse<GitHubRelease> = await rest.get<GitHubRelease>(`/crazy-max/xgo/releases/${version}`);
  if (res.statusCode != 200 || res.result === null) {
    throw new Error(`Cannot find xgo ${version} release (http ${res.statusCode})`);
  }

  return res.result.tag_name;
}
