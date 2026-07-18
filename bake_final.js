// 用章节树分类结果烘焙最终题库
const fs = require('fs');
const zlib = require('zlib');
const DATA = JSON.parse(zlib.gunzipSync(fs.readFileSync('/tmp/all_questions.json.gz.orig.bak')).toString('utf8'));
const map = JSON.parse(fs.readFileSync('/tmp/seg_chapter_map.json', 'utf8'));

function strip(topic, subj) {
  let t = String(topic || '').trim();
  if (subj && t.indexOf(subj + '.') === 0) t = t.slice(subj.length + 1).trim();
  return t.split(/[；;，,。\n]/)[0].trim();
}

let toOther = 0, kept = 0;
const chapterCount = {};
for (const q of DATA) {
  const s = q.lawName || '';
  const seg = strip(q.topic, s);
  const key = s + '\u0000' + (seg || '');
  const ch = map[key];
  if (ch && ch !== '其他') {
    q.topic = ch;
    kept++;
    chapterCount[ch] = (chapterCount[ch] || 0) + 1;
  } else {
    q.topic = '其他';
    toOther++;
  }
}
const out = zlib.gzipSync(Buffer.from(JSON.stringify(DATA), 'utf8'));
fs.writeFileSync('all_questions.json.gz', out);
fs.writeFileSync('android/app/src/main/assets/all_questions.json.gz', out);
const chapters = Object.keys(chapterCount).filter(c => c !== '其他').sort();
console.log('烘焙完成: 总题', DATA.length, ' 归章', kept, ' 其他', toOther, ' (' + (toOther / DATA.length * 100).toFixed(1) + '%)');
console.log('唯一章节名(不含其他):', chapters.length);
console.log('题数最多的 15 个章节:');
Object.entries(chapterCount).sort((a, b) => b[1] - a[1]).slice(0, 15).forEach(([c, n]) => console.log('  ' + String(n).padStart(5), c));
// 列出含"·"前缀的章节（分则）数量
const withPrefix = chapters.filter(c => c.includes('·')).length;
console.log('含「分则·」等前缀的章节数:', withPrefix);
