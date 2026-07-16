// Cloudflare Worker：转发 GitHub Gist API
// 用途：解决国内浏览器无法直接访问 api.github.com 导致 gist 同步失败（badge 显示“离线/仅本机”）的问题。
//       前端把“同步代理地址”指向这个 Worker 域名，Worker 在服务端（可直连 GitHub）转发请求并加 CORS 头。
//
// 部署步骤：
//   1. 打开 https://dash.cloudflare.com → 左侧 “Workers & Pages” → “Create” → “Create Worker”
//   2. 把默认代码全删，粘贴本文件 → “Deploy”
//   3. 部署完成后复制分配的地址，形如 https://aiktk-sync.<你的子域>.workers.dev
//   4. 回到网页「云端同步设置」，把该地址填入“同步代理地址”，保存即可。
//
// 安全说明：本 Worker 仅做纯转发（透传前端带来的 Authorization 头），不做鉴权。
//   因此任何人知道你的 Worker 地址 + 抓到前端 PAT 都能读写你的 gist——这与原方案“PAT 存于浏览器 localStorage”的安全模型一致，
//   并未额外放大风险。若需更严格，可把 PAT 存为 Worker 的 Secret 并在代码里注入（需自行加访问口令），此处为单用户自用最简版。

export default {
  async fetch(request) {
    // 预检请求直接回应，不转发到 GitHub，避免多余往返
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        status: 204,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, PATCH, DELETE, OPTIONS',
          'Access-Control-Allow-Headers': 'Authorization, Content-Type, Accept'
        }
      });
    }
    const url = new URL(request.url);
    // 把 worker 路径 /gists/xxx 转发到 https://api.github.com/gists/xxx
    const target = 'https://api.github.com' + url.pathname + url.search;
    const init = {
      method: request.method,
      headers: request.headers,   // 透传前端带来的 Authorization（PAT）
      redirect: 'follow'
    };
    if (request.method !== 'GET' && request.method !== 'HEAD') {
      init.body = request.body;
    }
    const resp = await fetch(target, init);
    // 加 CORS 头，使浏览器跨域请求被允许
    const cors = new Response(resp.body, resp);
    cors.headers.set('Access-Control-Allow-Origin', '*');
    cors.headers.set('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE, OPTIONS');
    cors.headers.set('Access-Control-Allow-Headers', 'Authorization, Content-Type, Accept');
    return cors;
  }
};
