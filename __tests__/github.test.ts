import {describe, expect, it} from '@jest/globals';
import * as github from '../src/github';

describe('github', () => {
  it('returns latest xgo GitHub release', async () => {
    const release = await github.getRelease('latest');
    expect(release).not.toBeNull();
    expect(release?.tag_name).not.toEqual('');
  });

  it('returns v0.3.1 xgo GitHub release', async () => {
    const release = await github.getRelease('v0.3.1');
    expect(release).not.toBeNull();
    expect(release?.tag_name).toEqual('v0.3.1');
  });
});
