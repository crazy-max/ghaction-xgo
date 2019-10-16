"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const download = __importStar(require("download"));
const fs = __importStar(require("fs"));
const os = __importStar(require("os"));
const path = __importStar(require("path"));
const util = __importStar(require("util"));
const restm = __importStar(require("typed-rest-client/RestClient"));
const core = __importStar(require("@actions/core"));
let osPlat = os.platform();
let osArch = os.arch();
function getXgo(version) {
    return __awaiter(this, void 0, void 0, function* () {
        const selected = yield determineVersion(version);
        if (selected) {
            version = selected;
        }
        core.info(`✅ xgo version found: ${version}`);
        const tmpdir = fs.mkdtempSync(path.join(os.tmpdir(), 'xgo-'));
        const fileName = getFileName();
        const downloadUrl = util.format('https://github.com/crazy-max/xgo/releases/download/%s/%s', version, fileName);
        core.info(`⬇️ Downloading ${downloadUrl}...`);
        yield download.default(downloadUrl, tmpdir, { filename: fileName });
        return path.join(tmpdir, fileName);
    });
}
exports.getXgo = getXgo;
function getFileName() {
    const platform = osPlat == 'win32' ? 'windows' : osPlat;
    const arch = osArch == 'x64' ? 'amd64' : '386';
    const ext = osPlat == 'win32' ? '.exe' : '';
    return util.format('xgo_%s_%s%s', platform, arch, ext);
}
function determineVersion(version) {
    return __awaiter(this, void 0, void 0, function* () {
        let rest = new restm.RestClient('ghaction-xgo', 'https://github.com', undefined, {
            headers: {
                Accept: 'application/json'
            }
        });
        let res = yield rest.get(`/crazy-max/xgo/releases/${version}`);
        if (res.statusCode != 200 || res.result === null) {
            throw new Error(`Cannot find xgo ${version} release (http ${res.statusCode})`);
        }
        return res.result.tag_name;
    });
}
