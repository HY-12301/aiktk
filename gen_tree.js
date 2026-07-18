// 从题库提取唯一 topic，更新 chapter_tree.json
// 规则：保留旧树顺序（仅保留仍存在于题库的章），再把题库新增章（含子章）追加，保证父章在子章前
const fs=require('fs'),zlib=require('zlib');
const DATA=JSON.parse(zlib.gunzipSync(fs.readFileSync('all_questions.json.gz')).toString('utf8'));
const tree=JSON.parse(fs.readFileSync('chapter_tree.json'));

const byLaw={};
for(const q of DATA){ (byLaw[q.lawName]=byLaw[q.lawName]||new Set()).add(q.topic); }

function depth(t){ return t.split('·').length; }

for(const law in tree){
  const set=byLaw[law]||new Set();
  const oldArr=tree[law];
  const present=new Set();
  const newArr=[];
  // 1) 保留旧树中仍存在的章（维持原顺序）
  for(const item of oldArr){ if(set.has(item) && !present.has(item)){ newArr.push(item); present.add(item); } }
  // 2) 题库新增章，按 父章优先 + 字母序 插入
  const fresh=[...set].filter(t=>!present.has(t)).sort((a,b)=> depth(a)-depth(b) || (a<b?-1:1));
  for(const t of fresh){ newArr.push(t); present.add(t); }
  tree[law]=newArr;
}
fs.writeFileSync('chapter_tree.json', JSON.stringify(tree,null,2)+'\n');
let total=0; for(const k in tree) total+=tree[k].length;
console.log('chapter_tree.json 已更新，总章节数: '+total);
