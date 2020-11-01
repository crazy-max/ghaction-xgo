import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';
import * as util from 'util';
import * as github from './github';
import * as core from '@actions/core';
import * as tc from '@actions/tool-cache';

const osPlat: string = os.platform();
const osArch: string = os.arch();

export interface Xgo {
  path: string;
  version: string;
}

export async function getXgo(version: string): Promise<Xgo> {
  const release: github.GitHubRelease | null = await github.getRelease(version);
  if (!release) {
    throw new Error(`Cannot find Mage ${version} release`);
  }
  const semver: string = release.tag_name.replace(/^v/, '');

  core.info(`✅ xgo version found: ${release.tag_name}`);
  const filename = getFilename();
  const downloadUrl: string = util.format('https://github.com/crazy-max/xgo/releases/download/%s/%s', release.tag_name, filename);

  core.info(`⬇️ Downloading ${downloadUrl}...`);
  const downloadPath: string = await tc.downloadTool(downloadUrl);
  core.debug(`Downloaded to ${downloadPath}`);

  core.info('🔨 Fixing perms...');
  fs.chmodSync(downloadPath, '0755');

  const exeFile: string = osPlat == 'win32' ? 'xgo.exe' : 'xgo';
  const cachePath: string = await tc.cacheFile(downloadPath, exeFile, 'ghaction-xgo', semver);
  core.debug(`Cached to ${cachePath}`);

  return {
    path: path.join(cachePath, exeFile),
    version: release.tag_name
  };
}

const getFilename = (): string => {
  const platform: string = osPlat == 'win32' ? 'windows' : osPlat;
  const arch: string = osArch == 'x64' ? 'amd64' : '386';
  const ext: string = osPlat == 'win32' ? '.exe' : '';
  return util.format('xgo_%s_%s%s', platform, arch, ext);
};
