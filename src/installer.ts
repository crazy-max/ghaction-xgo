import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';
import * as semver from 'semver';
import * as util from 'util';
import * as core from '@actions/core';
import * as httpm from '@actions/http-client';
import * as tc from '@actions/tool-cache';

const osPlat: string = os.platform();
const osArch: string = os.arch();

export interface Xgo {
  path: string;
  version: string;
}

export interface GitHubRelease {
  id: number;
  tag_name: string;
  html_url: string;
  assets: Array<string>;
}

export const getRelease = async (version: string): Promise<GitHubRelease> => {
  const url = `https://raw.githubusercontent.com/crazy-max/ghaction-xgo/master/.github/xgo-releases.json`;
  const http: httpm.HttpClient = new httpm.HttpClient('ghaction-xgo');
  const resp: httpm.HttpClientResponse = await http.get(url);
  const body = await resp.readBody();
  const statusCode = resp.message.statusCode || 500;
  if (statusCode >= 400) {
    throw new Error(`Failed to get Xgo release ${version} from ${url} with status code ${statusCode}: ${body}`);
  }
  const releases = <Record<string, GitHubRelease>>JSON.parse(body);
  if (!releases[version]) {
    throw new Error(`Cannot find Xgo release ${version} in ${url}`);
  }
  return releases[version];
};

export async function getXgo(version: string): Promise<Xgo> {
  const release: GitHubRelease = await getRelease(version);
  const fullversion: string = release.tag_name.replace(/^v/, '');
  core.debug(`Release found: ${release.tag_name}`);

  const filename = getFilename(fullversion);
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

  const cachePath: string = await tc.cacheDir(extPath, 'ghaction-xgo', fullversion);
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

const getFilename = (version: string): string => {
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
      arch = semver.satisfies(version, '>=0.24.0') ? 'amd64' : 'x86_64';
      break;
    }
    case 'x32': {
      arch = semver.satisfies(version, '>=0.24.0') ? '386' : 'i386';
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
  return util.format('xgo_%s_%s_%s%s', version, platform, arch, ext);
};
