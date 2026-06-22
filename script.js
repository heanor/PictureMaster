/* ==============================================================
   LocalMilestone · Landing Page script
   - timeline 节点顺推 / 逆推
   - ledger 日志流水追加动效
   - AI stream 逐字吐字
   - AI card canvas 粒子微光
   ============================================================== */

(function () {
  /* ========== 1. Hero timeline · 时间轴节点 ========== */
  const flow = document.getElementById('tlFlow');
  if (flow) {
    const N = 28;
    const nodes = [];
    for (let i = 0; i < N; i++) {
      const n = document.createElement('div');
      n.className = 'tl-node';
      n.style.left = (i / (N - 1)) * 100 + '%';
      const box = document.createElement('span');
      box.className = 'tn-box';
      box.textContent = 't' + i;
      const delta = document.createElement('span');
      delta.className = 'tn-delta';
      delta.textContent = i === 0 ? 'base' : '+Δ';
      n.appendChild(box);
      n.appendChild(delta);
      nodes.push(n);
      flow.appendChild(n);
    }
    let idx = 0;
    let dir = 1;
    const line = document.createElement('div');
    line.className = 'tl-line';
    flow.appendChild(line);

    setInterval(() => {
      nodes.forEach((n, i) => n.classList.toggle('active', i === idx));
      idx += dir;
      if (idx >= N) { idx = N - 2; dir = -1; }
      if (idx < 0) { idx = 1; dir = 1; }
    }, 650);
  }

  /* ========== 2. Ledger 流水滚动 ========== */
  const body = document.getElementById('ledgerBody');
  if (body) {
    const ops = [
      { cls: 'op-add', sym: '+ADD', path: 'src/app.tsx', size: '128B' },
      { cls: 'op-mod', sym: '~MOD', path: 'README.md', size: '44B' },
      { cls: 'op-del', sym: '-DEL', path: 'src/legacy.js', size: '0B' },
      { cls: 'op-mov', sym: '>MOV', path: 'assets/logo.svg → img/', size: '16B' },
      { cls: 'op-ren', sym: '=REN', path: 'config.yaml → config.prod.yaml', size: '12B' },
      { cls: 'op-add', sym: '+ADD', path: 'src/router.tsx', size: '96B' },
      { cls: 'op-mod', sym: '~MOD', path: 'src/components/Button.tsx', size: '28B' },
    ];
    let cursor = 0;
    setInterval(() => {
      const li = document.createElement('li');
      li.style.opacity = 0;
      li.style.transform = 'translateX(-8px)';
      const op = ops[cursor % ops.length];
      li.innerHTML = `<i class="${op.cls}">${op.sym}</i><code>${op.path}</code><span>${op.size}</span>`;
      body.appendChild(li);
      requestAnimationFrame(() => {
        li.style.transition = 'all .35s ease';
        li.style.opacity = 1;
        li.style.transform = 'translateX(0)';
      });
      while (body.children.length > 7) {
        body.removeChild(body.firstChild);
      }
      cursor++;
    }, 1300);
  }

  /* ========== 3. AI stream · 逐字吐字 ========== */
  const sb = document.getElementById('aiStreamBody');
  if (sb) {
    const tokens = [
      ['<span class="hl-kw">analysis</span> ', 'audit 15 commits across t₃₇ → t₅₂.'],
      ['<span class="hl-add">+ 新增</span> ', 'router.tsx 引入嵌套路由结构，解耦 /dashboard 与 /settings。'],
      ['<span class="hl-mod">~ 修改</span> ', 'Button.tsx 追加 data-state 属性，支持禁用态样式回退。'],
      ['<span class="hl-kw">全局变化</span> ', '文件总数 +2，删除冗余 legacy.js，整体代码行数 −84。'],
      ['<span class="hl-kw">建议</span> ', '可在 t₅₂ 直接建分支合入 release；旧文件已审计，可安全移除。'],
    ];
    let ti = 0, ci = 0, buf = '';
    const caret = '<span class="caret"></span>';

    function flush() { sb.innerHTML = buf + caret; }

    function tick() {
      if (ti >= tokens.length) {
        setTimeout(() => { buf = ''; ti = 0; ci = 0; flush(); tick(); }, 2200);
        return;
      }
      const [prefix, line] = tokens[ti];
      if (ci === 0) {
        if (buf) buf += '<br/>';
        buf += prefix;
        ci++;
        flush();
        setTimeout(tick, 380);
        return;
      }
      if (ci - 1 < line.length) {
        buf += line.charAt(ci - 1);
        ci++;
        flush();
        setTimeout(tick, 22 + Math.random() * 35);
        return;
      }
      ti++; ci = 0;
      setTimeout(tick, 500);
    }
    flush();
    setTimeout(tick, 700);
  }

  /* ========== 4. AI card canvas · 粒子微光 ========== */
  const aiCard = document.getElementById('aiCard');
  if (aiCard && typeof HTMLCanvasElement !== 'undefined') {
    const canvas = document.createElement('canvas');
    const frame = aiCard.querySelector('.ai-frame');
    frame.appendChild(canvas);
    const ctx = canvas.getContext('2d');

    function resize() {
      const r = frame.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = r.width * dpr;
      canvas.height = r.height * dpr;
      canvas.style.width = r.width + 'px';
      canvas.style.height = r.height + 'px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    window.addEventListener('resize', resize);
    setTimeout(resize, 50);

    const particles = [];
    for (let i = 0; i < 40; i++) {
      particles.push({
        x: Math.random() * 600,
        y: Math.random() * 500,
        vx: (Math.random() - 0.5) * 0.25,
        vy: (Math.random() - 0.5) * 0.25,
        r: Math.random() * 1.6 + 0.4,
        a: Math.random() * 0.5 + 0.15,
        hue: Math.random() < 0.5 ? '#36c5f0' : (Math.random() < 0.5 ? '#0058bc' : '#7c3aed'),
      });
    }

    function draw() {
      const w = canvas.clientWidth, h = canvas.clientHeight;
      ctx.clearRect(0, 0, w, h);
      // soft glow gradient
      const grd = ctx.createRadialGradient(w * 0.2, h * 0.3, 2, w * 0.2, h * 0.3, Math.max(w, h) * 0.5);
      grd.addColorStop(0, 'rgba(0,88,188,0.18)');
      grd.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = grd;
      ctx.fillRect(0, 0, w, h);

      for (const p of particles) {
        p.x += p.vx; p.y += p.vy;
        if (p.x < -10) p.x = w + 10;
        if (p.x > w + 10) p.x = -10;
        if (p.y < -10) p.y = h + 10;
        if (p.y > h + 10) p.y = -10;
        ctx.beginPath();
        ctx.fillStyle = p.hue;
        ctx.globalAlpha = p.a;
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      }
      // connect nearby
      ctx.globalAlpha = 0.12;
      ctx.strokeStyle = '#5aa8ff';
      ctx.lineWidth = 0.6;
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const a = particles[i], b = particles[j];
          const dx = a.x - b.x, dy = a.y - b.y, d = Math.hypot(dx, dy);
          if (d < 90) {
            ctx.globalAlpha = (1 - d / 90) * 0.22;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }
      ctx.globalAlpha = 1;
      requestAnimationFrame(draw);
    }
    requestAnimationFrame(draw);
  }
})();
