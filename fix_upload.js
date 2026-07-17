const https = require('https');
const fs = require('fs');
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
const token = 'REPLACED_TOKEN';

function api(method, path, body) {
    return new Promise((resolve, reject) => {
        const opts = {
            hostname: 'api.github.com', path: path, method: method,
            headers: { 'User-Agent': 'msa', 'Authorization': 'Bearer ' + token, 'Accept': 'application/vnd.github.v3+json', 'Content-Type': 'application/json' },
            rejectUnauthorized: false
        };
        const req = https.request(opts, res => {
            let d = '';
            res.on('data', c => d += c);
            res.on('end', () => {
                if (res.statusCode === 204) resolve(null);
                try {
                    if (res.statusCode >= 200 && res.statusCode < 300) resolve(JSON.parse(d));
                    else reject(new Error(res.statusCode + ' ' + d.substring(0,200)));
                } catch(e) { reject(new Error(res.statusCode + ' resp')); }
            });
        });
        req.on('error', reject);
        if (body) req.write(JSON.stringify(body));
        req.end();
    });
}

function uploadAsset(uploadUrl, assetPath, assetName, contentType) {
    return new Promise((resolve, reject) => {
        const fileContent = fs.readFileSync(assetPath);
        const url = new URL(uploadUrl.replace('{?name,label}', '?name=' + assetName));
        const opts = {
            hostname: 'uploads.github.com', path: url.pathname + url.search, method: 'POST',
            headers: { 'User-Agent': 'msa', 'Authorization': 'Bearer ' + token, 'Accept': 'application/vnd.github.v3+json', 'Content-Type': contentType || 'application/octet-stream', 'Content-Length': fileContent.length },
            rejectUnauthorized: false
        };
        const req = https.request(opts, res => {
            let d = '';
            res.on('data', c => d += c);
            res.on('end', () => {
                try {
                    if (res.statusCode >= 200 && res.statusCode < 300) resolve(JSON.parse(d));
                    else reject(new Error(res.statusCode + ' ' + d.substring(0,200)));
                } catch(e) { reject(new Error(res.statusCode + ' resp')); }
            });
        });
        req.on('error', reject);
        req.write(fileContent);
        req.end();
    });
}

async function main() {
    try {
        const release = await api('GET', '/repos/leafss1022/msa/releases/tags/v0.4.4.0');
        console.log('Release: ' + release.tag_name + ' assets: ' + release.assets.length);
        
        for (const a of release.assets) {
            console.log('Delete: ' + a.name);
            await api('DELETE', '/repos/leafss1022/msa/releases/assets/' + a.id);
        }
        
        const a1 = await uploadAsset(release.upload_url, 'C:/Users/44853/Documents/MSM/msa-main/dist/msa-linux-amd64', 'msa-linux-amd64', 'application/octet-stream');
        console.log('Uploaded: ' + a1.name + ' (' + a1.size + ' B)');
        
        console.log('OK');
    } catch(e) { console.error('Err: ' + e.message); }
}
main();
