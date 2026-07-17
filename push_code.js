const https = require('https');
const fs = require('fs');
const path = require('path');
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
                try {
                    if (res.statusCode >= 200 && res.statusCode < 300) resolve(JSON.parse(d));
                    else reject(new Error(res.statusCode + ' ' + d.substring(0,200)));
                } catch(e) { reject(new Error('Parse: ' + d.substring(0,100))); }
            });
        });
        req.on('error', reject);
        if (body) req.write(JSON.stringify(body));
        req.end();
    });
}

async function main() {
    try {
        const ref = await api('GET', '/repos/leafss1022/msa/git/ref/heads/main');
        const baseSha = ref.object.sha;
        console.log('Base: ' + baseSha);
        
        const baseCommit = await api('GET', '/repos/leafss1022/msa/git/commits/' + baseSha);
        const baseTree = baseCommit.tree.sha;
        
        const root = 'C:/Users/44853/Documents/MSM/msa-main';
        const files = [
            'web/src/app/settings/SettingsClient.tsx',
            'ca_profile.xml',
            'packaging/unraid/build-unraid.sh',
            'packaging/unraid/ca/msa.xml',
            'packaging/unraid/msa.plg.in'
        ];
        
        const items = [];
        for (const f of files) {
            const full = path.join(root, f.replace(/\//g, path.sep));
            const content = fs.readFileSync(full, 'utf8');
            items.push({ path: f, mode: '100644', type: 'blob', content: content });
            console.log('  + ' + f);
        }
        
        const tree = await api('POST', '/repos/leafss1022/msa/git/trees', {
            base_tree: baseTree,
            tree: items
        });
        
        const commit = await api('POST', '/repos/leafss1022/msa/git/commits', {
            message: 'fix: replace remaining scoltzero refs in frontend and packaging',
            tree: tree.sha,
            parents: [baseSha]
        });
        
        await api('PATCH', '/repos/leafss1022/msa/git/refs/heads/main', { sha: commit.sha, force: false });
        console.log('Pushed: ' + commit.sha);
        console.log('OK');
    } catch(e) { console.error('Err: ' + e.message); }
}
main();
