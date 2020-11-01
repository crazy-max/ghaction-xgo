import fs = require('fs');
import * as installer from '../src/installer';

describe('installer', () => {
  it('acquires v0.3.1 version of xgo', async () => {
    const xgo = await installer.getXgo('v0.3.1');
    console.log(xgo);
    expect(fs.existsSync(xgo.path)).toBe(true);
  }, 100000);

  it('acquires latest version of xgo', async () => {
    const xgo = await installer.getXgo('latest');
    console.log(xgo);
    expect(fs.existsSync(xgo.path)).toBe(true);
  }, 100000);
});
