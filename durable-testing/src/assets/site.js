(function(){
  "use strict";
  var root = document.documentElement;
  var NS = "http://www.w3.org/2000/svg";

  /* ---------------- sketch engine (rough.js, with a plain-SVG fallback) ---------------- */
  var KEYS = ["ink","blue","green","red","orange","violet","muted"];
  function tokens(){
    var cs = getComputedStyle(root), t = {};
    KEYS.forEach(function(k){ t[k] = cs.getPropertyValue("--d-" + k).trim() || "#888"; });
    t.accent = cs.getPropertyValue("--accent").trim() || t.blue;
    t.blue = t.accent;
    return t;
  }
  function clean(o){ Object.keys(o).forEach(function(k){ if (o[k] === undefined) delete o[k]; }); return o; }
  function Pen(g, seed, t){ this.g = g; this.t = t; this.seed = seed; this.n = 0; this.rc = window.rough ? window.rough.svg(g.ownerSVGElement) : null; }
  var P = Pen.prototype;
  P.c = function(k){ return this.t[k] || k; };
  P.opt = function(o){
    o = o || {}; this.n++;
    return clean({
      roughness: o.r != null ? o.r : 1, bowing: o.bow != null ? o.bow : 1,
      strokeWidth: o.sw != null ? o.sw : 1.6, stroke: this.c(o.stroke || "ink"),
      seed: this.seed + this.n * 13,
      fill: o.fill ? this.c(o.fill) : undefined,
      fillStyle: o.fill ? (o.style || "hachure") : undefined,
      hachureGap: o.gap != null ? o.gap : 6, fillWeight: o.fw != null ? o.fw : 1.1,
      hachureAngle: o.angle != null ? o.angle : -41, strokeLineDash: o.dash
    });
  };
  P.put = function(node, o){
    o = o || {};
    if (o.fill && node.firstChild) node.firstChild.setAttribute("opacity", o.op != null ? o.op : 0.4);
    if (o.alpha != null) node.setAttribute("opacity", o.alpha);
    this.g.appendChild(node); return node;
  };
  P.el = function(tag, a){ var e = document.createElementNS(NS, tag); for (var k in a) e.setAttribute(k, a[k]); return e; };
  P.plain = function(tag, a, o){
    o = o || {}; var g = this.el("g", {});
    if (o.fill) g.appendChild(this.el(tag, Object.assign({}, a, { fill: this.c(o.fill), stroke: "none", opacity: (o.op != null ? o.op : 0.4) * 0.55 })));
    var s = this.el(tag, Object.assign({}, a, { fill: "none", stroke: this.c(o.stroke || "ink"), "stroke-width": o.sw != null ? o.sw : 1.6, "stroke-linecap": "round", "stroke-linejoin": "round" }));
    if (o.dash) s.setAttribute("stroke-dasharray", o.dash.join(" "));
    g.appendChild(s); if (o.alpha != null) g.setAttribute("opacity", o.alpha);
    this.g.appendChild(g); return g;
  };
  function pts(p){ return p.map(function(q){ return q.join(","); }).join(" "); }
  P.rect = function(x, y, w, h, o){ return this.rc ? this.put(this.rc.rectangle(x, y, w, h, this.opt(o)), o) : this.plain("rect", { x: x, y: y, width: w, height: h, rx: 5 }, o); };
  P.ellipse = function(cx, cy, w, h, o){ return this.rc ? this.put(this.rc.ellipse(cx, cy, w, h, this.opt(o)), o) : this.plain("ellipse", { cx: cx, cy: cy, rx: w / 2, ry: h / 2 }, o); };
  P.line = function(x1, y1, x2, y2, o){ return this.rc ? this.put(this.rc.line(x1, y1, x2, y2, this.opt(o)), o) : this.plain("line", { x1: x1, y1: y1, x2: x2, y2: y2 }, o); };
  P.poly = function(p, o){ return this.rc ? this.put(this.rc.polygon(p, this.opt(o)), o) : this.plain("polygon", { points: pts(p) }, o); };
  P.path = function(p, o){ return this.rc ? this.put(this.rc.linearPath(p, this.opt(o)), o) : this.plain("polyline", { points: pts(p) }, o); };
  P.curve = function(p, o){
    if (this.rc) return this.put(this.rc.curve(p, this.opt(o)), o);
    if (p.length === 3){ var cx = 2 * p[1][0] - (p[0][0] + p[2][0]) / 2, cy = 2 * p[1][1] - (p[0][1] + p[2][1]) / 2;
      return this.plain("path", { d: "M" + p[0] + " Q" + cx + "," + cy + " " + p[2] }, o); }
    return this.plain("polyline", { points: pts(p) }, o);
  };
  P.arrow = function(x1, y1, x2, y2, o){
    o = o || {}; var fx = x1, fy = y1;
    if (o.bend){
      var dx = x2 - x1, dy = y2 - y1, L = Math.hypot(dx, dy) || 1;
      var mx = (x1 + x2) / 2 + dy / L * o.bend, my = (y1 + y2) / 2 - dx / L * o.bend;
      this.curve([[x1, y1], [mx, my], [x2, y2]], o); fx = mx; fy = my;
    } else this.line(x1, y1, x2, y2, o);
    var a = Math.atan2(y2 - fy, x2 - fx), s = o.head || 10, sp = 0.45;
    this.path([[x2 - s * Math.cos(a - sp), y2 - s * Math.sin(a - sp)], [x2, y2], [x2 - s * Math.cos(a + sp), y2 - s * Math.sin(a + sp)]], { stroke: o.stroke, sw: o.sw, r: 0.6 });
  };
  P.text = function(x, y, str, o){
    o = o || {}; var size = o.size || 16, lines = String(str).split("\n"), lh = size * 1.18;
    var el = this.el("text", { x: x, y: y, fill: this.c(o.color || "ink"), "font-size": size, "text-anchor": o.anchor || "middle", "dominant-baseline": "central", "font-weight": o.weight || 400 });
    lines.forEach(function(ln, i){
      var ts = document.createElementNS(NS, "tspan"); ts.setAttribute("x", x);
      ts.setAttribute("dy", i === 0 ? -(lines.length - 1) * lh / 2 : lh); ts.textContent = ln; el.appendChild(ts);
    });
    if (o.rotate) el.setAttribute("transform", "rotate(" + o.rotate + " " + x + " " + y + ")");
    this.g.appendChild(el); return el;
  };
  P.bug = function(x, y, o){
    o = o || {}; var c = o.c || "red", s = o.s || 1;
    this.line(x - 2.5 * s, y - 4 * s, x - 6 * s, y - 9 * s, { stroke: c, sw: 1.2, r: 0.5 });
    this.line(x + 2.5 * s, y - 4 * s, x + 6 * s, y - 9 * s, { stroke: c, sw: 1.2, r: 0.5 });
    this.ellipse(x, y, 13 * s, 10 * s, { stroke: c, fill: c, style: "solid", op: o.op != null ? o.op : 0.85, sw: 1.3, r: 0.6 });
  };
  P.check = function(x, y, o){ this.path([[x - 6, y], [x - 1.5, y + 5], [x + 7, y - 6]], Object.assign({ stroke: "green", sw: 2.2, r: 0.5 }, o)); };
  P.box = function(cx, cy, w, h, label, o){
    o = o || {};
    this.rect(cx - w / 2, cy - h / 2, w, h, { stroke: o.c || "blue", fill: o.c || "blue", op: o.op != null ? o.op : 0.22, gap: o.gap || 7, sw: o.sw || 1.7 });
    this.text(cx, cy, label, { size: o.size || 16, color: "ink", weight: o.weight });
  };

  /* ---------------- drawings ---------------- */
  var D = {
    underline: function(d){
      d.curve([[4, 9], [80, 12], [170, 6], [296, 10]], { stroke: "accent", sw: 3.2, r: 1.4, bow: 2 });
      d.curve([[30, 13], [150, 10], [260, 13]], { stroke: "accent", sw: 1.6, r: 1.2, alpha: 0.6 });
    },
    ov1: function(d){
      var cs = ["blue","blue","green","red","violet","orange","red"];
      for (var i = 0; i < 7; i++){
        var row = i < 4 ? 0 : 1, col = row ? i - 4 : i;
        var x = row ? 66 + col * 54 : 39 + col * 54, y = row ? 100 : 42;
        d.ellipse(x, y, 42, 42, { stroke: cs[i], fill: cs[i], op: 0.22, gap: 5, sw: 1.8 });
        d.text(x, y + 1, String(i + 1), { size: 20, weight: 700, color: cs[i] });
      }
    },
    ov2: function(d){
      d.ellipse(120, 72, 212, 120, { stroke: "blue", sw: 1.9 });
      d.ellipse(120, 78, 120, 60, { stroke: "violet", fill: "violet", op: 0.2, gap: 6, sw: 1.9 });
      d.arrow(222, 66, 224, 82, { stroke: "blue", sw: 1.9, head: 9 });
      d.arrow(18, 80, 17, 64, { stroke: "blue", sw: 1.9, head: 9 });
      d.arrow(178, 72, 180, 84, { stroke: "violet", sw: 1.7, head: 8 });
      d.text(120, 30, "SDLC", { size: 17, weight: 700, color: "blue" });
      d.text(120, 79, "STLC", { size: 17, weight: 700, color: "violet" });
    },
    ov3: function(d){
      d.poly([[120, 12], [147, 52], [93, 52]], { stroke: "red", fill: "red", op: 0.28, gap: 5, sw: 1.8 });
      d.poly([[93, 52], [147, 52], [175, 94], [65, 94]], { stroke: "orange", fill: "orange", op: 0.24, gap: 6, sw: 1.8 });
      d.poly([[65, 94], [175, 94], [203, 134], [37, 134]], { stroke: "green", fill: "green", op: 0.22, gap: 7, sw: 1.8 });
      d.text(120, 40, "E2E", { size: 12 });
      d.text(120, 75, "Integration", { size: 14 });
      d.text(120, 115, "Unit", { size: 17, weight: 700 });
    },
    p1: function(d){
      d.rect(14, 14, 232, 120, { stroke: "muted", sw: 1.3 });
      d.text(26, 30, "your app", { size: 13, color: "muted", anchor: "start" });
      d.bug(190, 44, { c: "muted", op: 0.5 }); d.bug(218, 98, { c: "muted", op: 0.5 }); d.bug(168, 114, { c: "muted", op: 0.5 });
      d.text(200, 72, "?", { size: 18, color: "muted" });
      d.ellipse(90, 80, 80, 80, { stroke: "blue", sw: 2.3, fill: "blue", gap: 7, op: 0.22 });
      d.line(119, 109, 146, 134, { stroke: "blue", sw: 4.5, r: 0.6 });
      d.bug(80, 72); d.bug(101, 91);
    },
    p2: function(d){
      var hot = { 2: 1, 7: 1, 13: 1, 19: 1, 24: 1, 31: 1, 36: 1 };
      for (var r = 0; r < 4; r++) for (var c = 0; c < 10; c++){
        var i = r * 10 + c, x = 33 + c * 20, y = 18 + r * 20;
        d.rect(x, y, 14, 14, hot[i] ? { stroke: "green", fill: "green", op: 0.5, gap: 3.5, sw: 1.6, r: 0.8 } : { stroke: "muted", sw: 1, r: 0.8, alpha: 0.75 });
      }
      d.text(130, 115, "10 × 10 × 10 × 10 × 10", { size: 14 });
      d.text(130, 136, "= 100,000 combinations", { size: 14, color: "red", weight: 700 });
    },
    p3: function(d){
      d.line(30, 16, 30, 118, { stroke: "muted", sw: 1.3 }); d.line(30, 118, 248, 118, { stroke: "muted", sw: 1.3 });
      d.text(38, 18, "cost to fix", { size: 12, color: "muted", anchor: "start" });
      var hs = [6, 12, 24, 48, 90], cs = ["green", "green", "orange", "orange", "red"], ls = ["Req", "Design", "Code", "Test", "Prod"];
      hs.forEach(function(h, i){
        var x = 46 + i * 40;
        d.rect(x, 118 - h, 26, h, { stroke: cs[i], fill: cs[i], op: 0.5, gap: 4, sw: 1.5 });
        d.text(x + 13, 134, ls[i], { size: 12, color: "muted" });
      });
    },
    p4: function(d){
      var names = ["auth", "payments", "search", "profile", "cart", "admin"];
      for (var i = 0; i < 6; i++){
        var c = i % 3, r = Math.floor(i / 3), x = 22 + c * 76, y = 14 + r * 56;
        var hotm = i === 1;
        d.rect(x, y, 64, 44, hotm ? { stroke: "red", sw: 2.2, fill: "red", op: 0.14, gap: 6 } : { stroke: "muted", sw: 1.3 });
        d.text(x + 6, y + 11, names[i], { size: 11, color: hotm ? "red" : "muted", anchor: "start" });
      }
      [[114, 43], [131, 39], [148, 45], [122, 53], [140, 53]].forEach(function(p){ d.bug(p[0], p[1], { s: 0.75 }); });
      d.bug(205, 98, { s: 0.75 }); d.bug(60, 100, { s: 0.75 });
      d.text(130, 138, "most bugs live in a few modules", { size: 13 });
    },
    p5: function(d){
      var path = [[18, 112], [70, 66], [128, 92], [188, 48], [244, 74]];
      d.curve(path, { stroke: "blue", sw: 6, r: 0.4, alpha: 0.18 });
      d.curve(path, { stroke: "blue", sw: 2, r: 0.8 });
      d.curve(path.map(function(p){ return [p[0], p[1] + 4]; }), { stroke: "blue", sw: 1, r: 0.9, alpha: 0.5 });
      d.ellipse(18, 112, 9, 9, { stroke: "blue", fill: "blue", style: "solid", op: 0.9 });
      d.arrow(222, 66, 244, 74, { stroke: "blue", sw: 2, head: 8 });
      d.bug(64, 126); d.bug(100, 46); d.bug(166, 122); d.bug(226, 122);
      d.text(16, 22, "same route, run 500×", { size: 13, color: "blue", anchor: "start" });
    },
    p6: function(d){
      var items = [["medical\ndevice", 48, "red"], ["banking\nAPI", 34, "orange"], ["mobile\ngame", 20, "green"]];
      items.forEach(function(it, i){
        var x = 14 + i * 82;
        d.rect(x, 14, 70, 56, { stroke: "ink", sw: 1.4 });
        d.text(x + 35, 42, it[0], { size: 13 });
        d.rect(x + 25, 132 - it[1], 20, it[1], { stroke: it[2], fill: it[2], op: 0.5, gap: 4, sw: 1.5 });
      });
      d.line(10, 132, 252, 132, { stroke: "muted", sw: 1.2 });
      d.text(130, 144, "how much rigour", { size: 11, color: "muted" });
    },
    p7: function(d){
      d.rect(14, 28, 128, 96, { stroke: "ink", sw: 1.5 });
      d.text(78, 46, "release 2.4", { size: 12, color: "muted" });
      d.check(30, 72); d.text(44, 72, "312 tests pass", { size: 13, anchor: "start" });
      d.check(30, 100); d.text(44, 100, "0 open bugs", { size: 13, anchor: "start" });
      // user
      d.ellipse(206, 82, 18, 18, { stroke: "ink", sw: 1.6 });
      d.line(206, 91, 206, 118, { stroke: "ink" }); d.line(192, 102, 220, 100, { stroke: "ink" });
      d.line(206, 118, 196, 138, { stroke: "ink" }); d.line(206, 118, 216, 138, { stroke: "ink" });
      // bubble
      d.ellipse(204, 34, 104, 44, { stroke: "red", sw: 1.6, fill: "red", op: 0.1, gap: 7 });
      d.path([[196, 55], [202, 69], [210, 55]], { stroke: "red", sw: 1.6 });
      d.text(204, 34, "not what\nI needed", { size: 13, color: "red" });
    },
    sdlc: function(d){
      var nodes = [["Requirements", 320, 60], ["Design", 519, 130], ["Implementation", 519, 270], ["Testing", 320, 340], ["Deployment", 121, 270], ["Maintenance", 121, 130]];
      nodes.forEach(function(n, i){
        d.box(n[1], n[2], 150, 50, n[0], { c: i === 3 ? "green" : "blue", size: 17 });
        d.text(n[1] - 66, n[2] - 34, String(i + 1), { size: 13, color: "muted" });
      });
      var A = [[400, 58, 498, 100], [566, 160, 566, 240], [498, 300, 400, 338], [240, 338, 142, 300], [74, 240, 74, 160], [142, 100, 240, 58]];
      A.forEach(function(a){ d.arrow(a[0], a[1], a[2], a[3], { stroke: "ink", sw: 1.6, bend: 20 }); });
      d.text(320, 186, "SDLC", { size: 36, weight: 700 });
      d.text(320, 226, "one loop per release\nor per sprint", { size: 14, color: "muted" });
    },
    stlc: function(d){
      var labels = ["Requirement\nanalysis", "Test\nplanning", "Test case\ndevelopment", "Environment\nsetup", "Test\nexecution", "Test cycle\nclosure"];
      labels.forEach(function(l, i){
        var x = 12 + i * 146, c = i === 4 ? "orange" : "violet";
        d.rect(x, 74, 116, 66, { stroke: c, fill: c, op: 0.2, gap: 7, sw: 1.7 });
        d.text(x + 10, 87, String(i + 1), { size: 13, color: "muted", anchor: "start" });
        d.text(x + 58, 110, l, { size: 15 });
        if (i < 5) d.arrow(x + 120, 107, x + 142, 107, { sw: 1.6, head: 8 });
      });
      d.path([[306, 62], [306, 52], [570, 52], [570, 62]], { stroke: "muted", sw: 1.4 });
      d.text(438, 36, "often run in parallel", { size: 14, color: "muted" });
      // defect loop under execution (x 596..712)
      d.ellipse(654, 220, 120, 42, { stroke: "red", fill: "red", op: 0.14, gap: 7, sw: 1.7 });
      d.text(654, 220, "dev fixes", { size: 15, color: "red" });
      d.arrow(618, 144, 606, 204, { stroke: "red", sw: 1.6, bend: -14 });
      d.arrow(704, 204, 692, 144, { stroke: "red", sw: 1.6, bend: -14 });
      d.text(588, 172, "defect", { size: 14, color: "red", anchor: "end" });
      d.text(720, 172, "retest", { size: 14, color: "red", anchor: "start" });
    },
    vmodel: function(d){
      var L = [["Requirements", 30, 34], ["System design", 80, 114], ["Architecture design", 130, 194], ["Module design", 180, 274]];
      var R = [["Acceptance testing", 570, 34], ["System testing", 520, 114], ["Integration testing", 470, 194], ["Unit testing", 420, 274]];
      var plans = ["acceptance test plan", "system test plan", "integration test plan", "unit test plan"];
      for (var i = 0; i < 4; i++){
        var l = L[i], r = R[i], y = l[2] + 24;
        d.line(l[1] + 164, y, r[1] - 4, y, { stroke: "muted", sw: 1.3, dash: [6, 7], r: 0.6 });
        d.text((l[1] + 160 + r[1]) / 2, y - 11, plans[i], { size: 12, color: "muted" });
      }
      L.forEach(function(b){ d.box(b[1] + 80, b[2] + 24, 160, 48, b[0], { c: "blue", size: 15 }); });
      R.forEach(function(b){ d.box(b[1] + 80, b[2] + 24, 160, 48, b[0], { c: "green", size: 15 }); });
      d.box(380, 378, 150, 48, "Coding", { c: "orange", size: 16 });
      for (var j = 0; j < 3; j++){
        d.arrow(L[j][1] + 104, L[j][2] + 50, L[j + 1][1] + 70, L[j + 1][2] - 2, { sw: 1.5, head: 8 });
        d.arrow(R[j + 1][1] + 56, R[j + 1][2] - 2, R[j][1] + 90, R[j][2] + 50, { sw: 1.5, head: 8 });
      }
      d.arrow(L[3][1] + 120, L[3][2] + 50, 330, 352, { sw: 1.5, head: 8 });
      d.arrow(430, 352, R[3][1] + 40, R[3][2] + 50, { sw: 1.5, head: 8 });
      d.text(14, 190, "build · verification", { size: 14, color: "blue", rotate: -90 });
      d.text(748, 190, "test · validation", { size: 14, color: "green", rotate: 90 });
    },
    pyramid: function(d){
      d.poly([[270, 40], [331, 140], [209, 140]], { stroke: "red", fill: "red", op: 0.28, gap: 6, sw: 1.8 });
      d.poly([[209, 140], [331, 140], [396, 245], [144, 245]], { stroke: "orange", fill: "orange", op: 0.24, gap: 7, sw: 1.8 });
      d.poly([[144, 245], [396, 245], [460, 350], [80, 350]], { stroke: "green", fill: "green", op: 0.22, gap: 8, sw: 1.8 });
      d.text(270, 110, "UI / E2E", { size: 15 });
      d.text(270, 196, "Integration", { size: 19 });
      d.text(270, 300, "Unit", { size: 24, weight: 700 });
      d.text(330, 104, "few · ~10%", { size: 14, color: "red", anchor: "start" });
      d.text(384, 194, "some · ~20%", { size: 14, color: "orange", anchor: "start" });
      d.text(448, 298, "many · ~70%", { size: 14, color: "green", anchor: "start" });
      d.arrow(42, 332, 42, 72, { stroke: "muted", sw: 1.6 });
      d.text(28, 52, "slower · costlier · more realistic", { size: 13, color: "muted", anchor: "start" });
      d.text(28, 374, "faster · cheaper", { size: 13, color: "muted", anchor: "start" });
      d.text(270, 386, "Test pyramid", { size: 17, weight: 700 });
      // ice-cream cone
      d.poly([[615, 158], [825, 158], [779, 250], [661, 250]], { stroke: "orange", fill: "orange", op: 0.24, gap: 7, sw: 1.8 });
      d.poly([[661, 250], [779, 250], [720, 368]], { stroke: "green", fill: "green", op: 0.22, gap: 6, sw: 1.8 });
      d.ellipse(720, 104, 224, 116, { stroke: "red", fill: "red", op: 0.28, gap: 6, sw: 1.8 });
      d.ellipse(724, 38, 16, 16, { stroke: "red", fill: "red", style: "solid", op: 0.85 });
      d.text(720, 104, "Manual + E2E", { size: 19, weight: 700 });
      d.text(720, 202, "Integration", { size: 15 });
      d.text(720, 284, "Unit", { size: 14 });
      d.text(720, 386, "Ice-cream cone · anti-pattern", { size: 17, weight: 700, color: "red" });
    }
  };

  function hash(s){ var h = 7; for (var i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) % 100000; return h; }
  function render(){
    var t = tokens();
    document.querySelectorAll("svg[data-d]").forEach(function(svg){
      var fn = D[svg.getAttribute("data-d")]; if (!fn) return;
      var old = svg.querySelector("g.gen"); if (old) old.remove();
      var g = document.createElementNS(NS, "g"); g.setAttribute("class", "gen"); svg.appendChild(g);
      try { fn(new Pen(g, hash(svg.getAttribute("data-d")), t)); } catch (e) { console.error(e); }
    });
  }

  /* ---------------- theme ---------------- */
  var KEY = "durable-testing-theme";
  function load(k){ try { return localStorage.getItem(k); } catch (e) { return null; } }
  function store(k, v){ try { localStorage.setItem(k, v); } catch (e) {} }
  function mode(){ return root.getAttribute("data-theme") || "system"; }
  function sync(){ var m = mode(); document.querySelectorAll("[data-theme-set]").forEach(function(b){ b.setAttribute("aria-pressed", String(b.getAttribute("data-theme-set") === m)); }); }
  function applyTheme(m){ if (m === "light" || m === "dark") root.setAttribute("data-theme", m); else root.removeAttribute("data-theme"); sync(); }
  document.querySelectorAll("[data-theme-set]").forEach(function(b){
    b.addEventListener("click", function(){ var m = b.getAttribute("data-theme-set"); applyTheme(m); store(KEY, m); });
  });
  sync();
  new MutationObserver(function(){ sync(); render(); }).observe(root, { attributes: true, attributeFilter: ["data-theme", "data-accent"] });
  var mq = window.matchMedia("(prefers-color-scheme: dark)");
  if (mq.addEventListener) mq.addEventListener("change", render); else if (mq.addListener) mq.addListener(render);

  /* ---------------- accent palette ---------------- */
  var AKEY = "durable-testing-accent";
  function applyAccent(a){
    if (!a || a === "mono") root.removeAttribute("data-accent"); else root.setAttribute("data-accent", a);
    var cur = root.getAttribute("data-accent") || "mono";
    document.querySelectorAll("[data-accent-set]").forEach(function(b){ b.setAttribute("aria-pressed", String(b.getAttribute("data-accent-set") === cur)); });
  }
  applyAccent(root.getAttribute("data-accent"));

  /* ---------------- popovers (page menu + accent picker) ---------------- */
  var menu = document.getElementById("page-menu"), mt = document.getElementById("menu-toggle");
  var apop = document.getElementById("accent-pop"), atog = document.getElementById("accent-toggle");
  function setMenu(open){ menu.hidden = !open; mt.setAttribute("aria-expanded", String(open)); if (open) menu.querySelector("button, a").focus(); }
  function setAccentPop(open){ apop.hidden = !open; atog.setAttribute("aria-expanded", String(open)); if (open){ var p = apop.querySelector('[aria-pressed="true"]'); if (p) p.focus(); } }
  mt.addEventListener("click", function(e){ e.stopPropagation(); setAccentPop(false); setMenu(menu.hidden); });
  atog.addEventListener("click", function(e){ e.stopPropagation(); setMenu(false); setAccentPop(apop.hidden); });
  apop.addEventListener("click", function(e){
    e.stopPropagation(); var b = e.target.closest("[data-accent-set]"); if (!b) return;
    var a = b.getAttribute("data-accent-set"); applyAccent(a); store(AKEY, a);
  });
  menu.addEventListener("click", function(e){
    var b = e.target.closest("[role=menuitem]"); if (!b) return;
    var a = b.getAttribute("data-action"); setMenu(false);
    if (a === "copy-page") copy(md("page"), "Page", null);
    if (a === "copy-rules") copy(md("rules"), "Rules", null);
  });
  document.addEventListener("click", function(e){
    if (!menu.hidden && !menu.contains(e.target)) setMenu(false);
    if (!apop.hidden && !apop.contains(e.target)) setAccentPop(false);
  });
  document.addEventListener("keydown", function(e){
    if (e.key !== "Escape") return;
    if (!viewer.hidden) closeViewer();
    else if (!menu.hidden){ setMenu(false); mt.focus(); }
    else if (!apop.hidden){ setAccentPop(false); atog.focus(); }
  });

  /* ---------------- markdown + copy ---------------- */
  function md(id){ var el = document.getElementById("md-" + id); return el ? el.textContent.replace(/^\s*\n/, "").replace(/\s+$/, "") + "\n" : ""; }
  function pageRulesMd(){
    var title = document.querySelector(".page-head h1").textContent.trim();
    var items = Array.prototype.map.call(document.querySelectorAll(".checklist li"), function(li){ return "- " + li.textContent.trim(); });
    return "## Rules for agents: " + title + "\n\n" + items.join("\n") + "\n";
  }
  var toastEl = document.getElementById("toast"), toastTimer;
  function toast(msg){ toastEl.querySelector("span").textContent = msg; toastEl.classList.add("show"); clearTimeout(toastTimer); toastTimer = setTimeout(function(){ toastEl.classList.remove("show"); }, 2000); }
  function copy(text, label, btn){
    var ok = function(){
      toast(label + " copied");
      if (btn){ btn.classList.add("done"); setTimeout(function(){ btn.classList.remove("done"); }, 1600); }
    };
    var fail = function(){ openViewer(text); };
    try { if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(text).then(ok, fail); else fail(); } catch (e) { fail(); }
  }
  var viewer = document.getElementById("viewer"), vtext = document.getElementById("viewer-text"), lastFocus = null;
  function openViewer(text){
    lastFocus = document.activeElement;
    document.getElementById("viewer-sub").textContent = "Copying is blocked here. The text is selected: press Ctrl+C or ⌘C.";
    vtext.value = text; viewer.hidden = false; vtext.focus(); vtext.select(); vtext.scrollTop = 0;
  }
  function closeViewer(){ viewer.hidden = true; if (lastFocus) lastFocus.focus(); }
  document.getElementById("viewer-close").addEventListener("click", closeViewer);
  viewer.addEventListener("click", function(e){ if (e.target === viewer) closeViewer(); });

  document.getElementById("copy-page").addEventListener("click", function(){ copy(md("page"), "Page", null); });
  document.querySelectorAll("[data-copy-rules]").forEach(function(b){
    b.addEventListener("click", function(){
      var all = b.getAttribute("data-copy-rules") === "all";
      copy(all ? md("rules") : pageRulesMd(), "Rules", b);
    });
  });
  document.querySelectorAll("[data-copy-el]").forEach(function(b){
    b.addEventListener("click", function(){ var el = document.getElementById(b.getAttribute("data-copy-el")); copy(el.textContent.trim(), "Command", b); });
  });

  /* ---------------- nav: mobile copy + scroll spy ---------------- */
  var toc = document.getElementById("toc"), mtoc = document.getElementById("toc-mobile");
  mtoc.innerHTML = toc.innerHTML;
  mtoc.addEventListener("click", function(e){ if (e.target.closest("a")) mtoc.closest("details").open = false; });
  var here = location.pathname.replace(/\.html$/, "").replace(/\/$/, "") || "/";
  var spyLinks = Array.prototype.filter.call(toc.querySelectorAll("a.sub"), function(a){ return a.pathname.replace(/\.html$/, "") === here && a.hash; });
  var targets = spyLinks.map(function(a){ return document.getElementById(a.hash.slice(1)); });
  var ticking = false;
  function spy(){
    ticking = false; var cur = -1;
    targets.forEach(function(t, i){ if (t && t.getBoundingClientRect().top < 140) cur = i; });
    spyLinks.forEach(function(a, i){ a.classList.toggle("active", i === cur); });
  }
  if (spyLinks.length) window.addEventListener("scroll", function(){ if (!ticking){ ticking = true; requestAnimationFrame(spy); } }, { passive: true });

  var yr = document.getElementById("year"); if (yr) yr.textContent = String(new Date().getFullYear());
  render(); spy();
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(render);
})();
