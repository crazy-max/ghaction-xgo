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
    throw new Error(`Cannot find xgo ${version} release`);
  }
  const semver: string = release.tag_name.replace(/^v/, '');
  core.debug(`Release found: ${release.tag_name}`);

  const filename = getFilename(semver);
  const downloadUrl: string = util.format('https://github.com/crazy-max/xgo/releases/download/%s/%s', release.tag_name, filename);

  core.info(`Downloading ${downloadUrl}`);
  const downloadPath: string = await tc.downloadTool(downloadUrl);
  core.debug(`Downloaded to ${downloadPath}`);

  let extPath: string;
  if (osPlat == 'win32') {
    extPath = await tc.extractZip(downloadPath);
  } else {
    extPath = await tc.extractTar(downloadPath);
  }
  core.debug(`Extracted to ${extPath}`);

  const cachePath: string = await tc.cacheDir(extPath, 'ghaction-xgo', semver);
  core.debug(`Cached to ${cachePath}`);

  const exePath: string = path.join(cachePath, osPlat == 'win32' ? 'xgo.exe' : 'xgo');
  core.debug(`Exe path is ${exePath}`);

  core.info('Fixing perms');
  fs.chmodSync(exePath, '0755');

  return {
    path: exePath,
    version: release.tag_name
  };
}

const getFilename = (semver: string): string => {
  let platform, arch: string;
  switch (osPlat) {
    case 'win32': {
      platform = 'windows';
      break;
    }
    default: {
      platform = osPlat;
      break;
    }
  }
  switch (osArch) {
    case 'x64': {
      arch = 'x86_64';
      break;
    }
    case 'x32': {
      arch = 'i386';
      break;
    }
    case 'arm': {
      const arm_version = (process.config.variables as any).arm_version;
      arch = arm_version ? 'armv' + arm_version : 'arm';
      break;
    }
    default: {
      arch = osArch;
      break;
    }
  }
  const ext: string = osPlat == 'win32' ? '.zip' : '.tar.gz';
  return util.format('xgo_%s_%s_%s%s', semver, platform, arch, ext);
};
