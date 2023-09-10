import {describe, expect, it} from '@jest/globals';
import * as fs from 'fs';
import * as installer from '../src/installer';

describe('getRelease', () => {
  it('returns latest buildx GitHub release', async () => {
    const release = await installer.getRelease('latest');
    expect(release).not.toBeNull();
    expect(release?.tag_name).not.toEqual('');
  });

  it('returns v0.24.0 buildx GitHub release', async () => {
    const release = await installer.getRelease('v0.24.0');
    expect(release).not.toBeNull();
    expect(release?.id).toEqual(88251102);
    expect(release?.tag_name).toEqual('v0.24.0');
    expect(release?.html_url).toEqual('https://github.com/crazy-max/xgo/releases/tag/v0.24.0');
  });

  it('unknown release', async () => {
    await expect(installer.getRelease('foo')).rejects.toThrow(new Error('Cannot find Xgo release foo in https://raw.githubusercontent.com/crazy-max/ghaction-xgo/master/.github/xgo-releases.json'));
  });
});

describe('installer', () => {
  it('acquires v0.6.0 version of xgo', async () => {
    const xgo = await installer.getXgo('v0.6.0');
    expect(fs.existsSync(xgo.path)).toBe(true);
  }, 100000);

  it('acquires latest version of xgo', async () => {
    const xgo = await installer.getXgo('latest');
    expect(fs.existsSync(xgo.path)).toBe(true);
  }, 100000);
});
