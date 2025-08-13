const fetch = require('node-fetch'); // node-fetch v2 を使用
const fs = require('fs');

// APIのURL
const url = 'https://api.syosetu.com/novelapi/api/?out=json&int=200&of=t-w-s';

fetch(url)
.then(res => {
    if (!res.ok) throw new Error(`HTTPエラー: ${res.status}`);
    return res.json();
})
.then(data => {
    // JSONとして保存（日本語を正しく表示するために ensure_ascii: false 相当）
    fs.writeFileSync('novel_info.json', JSON.stringify(data, null, 2), 'utf8');
    console.log('✅ データを "novel_info.json" に保存しました。');
})
.catch(err => {
    console.error('❌ エラー:', err);
});