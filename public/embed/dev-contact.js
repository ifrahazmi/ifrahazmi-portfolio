/*!
 * Developer contact widget — drop-in, dependency-free, Shadow-DOM isolated.
 * v1.1.0
 *
 * Usage:
 *   <script src="https://your-domain.com/embed/dev-contact.js"
 *           data-endpoint="https://your-domain.com/api/dev-contact"></script>
 *   <a href="#" data-dev-contact>Designed & developed by Ifrahuddin Azmi</a>
 */
(function () {
  "use strict";

  if (window.DevContact && window.DevContact.version) return;

  var script =
    document.currentScript ||
    (function () {
      var all = document.querySelectorAll('script[src*="dev-contact"]');
      return all[all.length - 1] || null;
    })();

  var scriptUrl = script && script.src ? new URL(script.src, location.href) : null;
  var origin = scriptUrl ? scriptUrl.origin : location.origin;

  var config = {
    endpoint: (script && script.getAttribute("data-endpoint")) || origin + "/api/dev-contact",
    name: (script && script.getAttribute("data-name")) || "Ifrahuddin Azmi",
    role:
      (script && script.getAttribute("data-role")) ||
      "Web Design + Developer | AI/ML Engineer | Automation",
    email: (script && script.getAttribute("data-email")) || "info@hikmahsphere.site",
    source: (script && script.getAttribute("data-source")) || "",
    mode: (script && script.getAttribute("data-mode")) || "modal",
    target: (script && script.getAttribute("data-target")) || "[data-dev-contact-inline]",
    autoOpen: Boolean(script && script.hasAttribute("data-auto-open")),
    accent: (script && script.getAttribute("data-accent")) || "#38bdf8",
  };

  var esc = function (value) {
    return String(value == null ? "" : value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  };

  var CSS = [
    "*,*::before,*::after{box-sizing:border-box}",
    "[hidden]{display:none!important}",
    ":host{all:initial}",
    ".dc-root{--accent:" + config.accent + ";--ink:#e8eef9;--muted:#93a4c3;--faint:#64748b;--line:#1e2a44;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;color:var(--ink);-webkit-font-smoothing:antialiased;text-rendering:optimizeLegibility}",

    /* overlay */
    ".dc-wrap{position:fixed;inset:0;z-index:2147483000;display:flex;align-items:center;justify-content:center;padding:24px}",
    ".dc-scrim{position:absolute;inset:0;background:radial-gradient(900px 520px at 12% -10%,rgba(56,189,248,.16),transparent 68%),radial-gradient(760px 520px at 92% 108%,rgba(168,85,247,.2),transparent 70%),rgba(4,6,13,.84);-webkit-backdrop-filter:blur(16px) saturate(130%);backdrop-filter:blur(16px) saturate(130%);animation:dcFade .32s ease both}",
    ".dc-scrim::before{content:'';position:absolute;inset:0;background-image:linear-gradient(rgba(148,163,184,.055) 1px,transparent 1px),linear-gradient(90deg,rgba(148,163,184,.055) 1px,transparent 1px);background-size:46px 46px;-webkit-mask-image:radial-gradient(circle at 50% 38%,#000 0%,transparent 72%);mask-image:radial-gradient(circle at 50% 38%,#000 0%,transparent 72%)}",
    ".dc-aura{position:absolute;border-radius:50%;filter:blur(60px);opacity:.5;pointer-events:none}",
    ".dc-aura-a{width:320px;height:320px;left:6%;top:8%;background:rgba(56,189,248,.22);animation:dcDriftA 14s ease-in-out infinite alternate}",
    ".dc-aura-b{width:360px;height:360px;right:4%;bottom:2%;background:rgba(168,85,247,.2);animation:dcDriftB 18s ease-in-out infinite alternate}",

    /* shell + rotating border */
    ".dc-shell{position:relative;width:min(548px,100%);max-height:calc(100vh - 48px);border-radius:24px;isolation:isolate;animation:dcPop .45s cubic-bezier(.16,.9,.24,1) both}",
    ".dc-shell::before{content:'';position:absolute;inset:-1px;border-radius:25px;padding:1px;background:linear-gradient(135deg,rgba(56,189,248,.9),rgba(99,102,241,.25) 34%,rgba(168,85,247,.8) 62%,rgba(56,189,248,.45) 82%,rgba(129,140,248,.75));-webkit-mask:linear-gradient(#000 0 0) content-box,linear-gradient(#000 0 0);-webkit-mask-composite:xor;mask-composite:exclude;animation:dcBorder 7s ease-in-out infinite;opacity:.85;pointer-events:none}",
    ".dc-shell::after{content:'';position:absolute;inset:-14px;border-radius:32px;pointer-events:none;background:radial-gradient(60% 50% at 50% 0%,rgba(56,189,248,.18),transparent 72%);filter:blur(10px);z-index:-1}",
    ".dc-card{position:relative;display:flex;flex-direction:column;max-height:inherit;border-radius:23px;background:linear-gradient(180deg,#0c1424 0%,#080d17 55%,#060a12 100%);box-shadow:0 50px 110px -40px rgba(0,0,0,.95),0 0 0 1px rgba(148,163,184,.06) inset;overflow:hidden}",
    ".dc-card::after{content:'';position:absolute;inset:0;border-radius:inherit;pointer-events:none;opacity:0;transition:opacity .45s ease;background:radial-gradient(430px circle at var(--mx,50%) var(--my,0%),rgba(56,189,248,.1),transparent 62%)}",
    ".dc-card:hover::after{opacity:1}",

    /* header */
    ".dc-top{display:flex;align-items:center;gap:12px;padding:22px 60px 0 24px}",
    ".dc-mark{position:relative;width:42px;height:42px;flex:none;border-radius:13px;display:grid;place-items:center;font-weight:800;font-size:13.5px;letter-spacing:.02em;color:#05070d;background:linear-gradient(135deg,var(--accent),#6366f1 55%,#a855f7);box-shadow:0 0 0 1px rgba(255,255,255,.16) inset,0 14px 30px -12px var(--accent)}",
    ".dc-mark::after{content:'';position:absolute;inset:-4px;border-radius:16px;border:1px solid rgba(56,189,248,.28);animation:dcRing 3.4s ease-out infinite}",
    ".dc-ident{min-width:0}",
    ".dc-name{font-size:13.5px;font-weight:700;letter-spacing:.01em;line-height:1.3;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}",
    ".dc-role{font-size:10px;font-weight:600;letter-spacing:.11em;line-height:1.55;text-transform:uppercase;color:var(--faint);margin-top:3px}",
    ".dc-close{position:absolute;top:16px;right:16px;z-index:3;width:32px;height:32px;display:grid;place-items:center;border-radius:10px;border:1px solid transparent;background:transparent;color:#7f8ba3;cursor:pointer;transition:background .2s,color .2s,border-color .2s}",
    ".dc-close:hover{background:rgba(148,163,184,.09);border-color:rgba(148,163,184,.14);color:#e8eef9}",
    ".dc-close svg{width:14px;height:14px}",

    /* body */
    ".dc-body{overflow-y:auto;overscroll-behavior:contain;padding:22px 24px 24px}",
    ".dc-body::-webkit-scrollbar{width:8px}",
    ".dc-body::-webkit-scrollbar-thumb{background:rgba(148,163,184,.16);border-radius:8px}",
    ".dc-badge{display:inline-flex;align-items:center;gap:7px;padding:5px 10px;border:1px solid rgba(52,211,153,.26);border-radius:999px;background:rgba(52,211,153,.08);font-size:9.5px;font-weight:700;letter-spacing:.14em;text-transform:uppercase;color:#34d399}",
    ".dc-dot{width:6px;height:6px;border-radius:50%;background:#34d399;box-shadow:0 0 0 0 rgba(52,211,153,.55);animation:dcBlink 2.4s ease-out infinite}",
    ".dc-h1{margin:14px 0 0;font-size:27px;line-height:1.18;letter-spacing:-.025em;font-weight:700}",
    ".dc-grad{background:linear-gradient(96deg,var(--accent),#818cf8 52%,#c084fc);-webkit-background-clip:text;background-clip:text;color:transparent;-webkit-text-fill-color:transparent}",
    ".dc-sub{margin:8px 0 0;font-size:12.5px;line-height:1.6;color:var(--muted);max-width:42ch}",
    ".dc-meter{position:relative;height:2px;margin:18px 0 2px;border-radius:2px;background:rgba(148,163,184,.12);overflow:hidden}",
    ".dc-meter i{position:absolute;inset:0;width:4%;border-radius:2px;background:linear-gradient(90deg,var(--accent),#818cf8,#c084fc);transition:width .45s cubic-bezier(.2,.8,.2,1);box-shadow:0 0 12px var(--accent)}",
    ".dc-meter-note{display:flex;justify-content:space-between;margin-top:7px;font-size:9.5px;letter-spacing:.12em;text-transform:uppercase;color:#52607a;font-weight:600}",

    /* form */
    ".dc-form{display:block;margin-top:14px}",
    ".dc-field{margin-bottom:14px}",
    ".dc-label{display:flex;align-items:baseline;justify-content:space-between;gap:8px;margin-bottom:7px;font-size:9.5px;font-weight:700;letter-spacing:.16em;text-transform:uppercase;color:#7d8db0}",
    ".dc-opt{font-size:8.5px;letter-spacing:.14em;color:#4d5b74;font-weight:600}",
    ".dc-input,.dc-area{display:block;width:100%;border-radius:11px;border:1px solid #1f2b45;background:rgba(8,13,24,.78);color:var(--ink);font-family:inherit;font-size:13.5px;line-height:1.5;padding:12px 13px;transition:border-color .2s,box-shadow .2s,background .2s}",
    ".dc-area{min-height:92px;resize:vertical}",
    ".dc-input::placeholder,.dc-area::placeholder{color:#4c5a73}",
    ".dc-input:focus,.dc-area:focus{outline:none;border-color:rgba(56,189,248,.62);background:rgba(10,17,30,.95);box-shadow:0 0 0 3px rgba(56,189,248,.11),0 0 30px -10px rgba(56,189,248,.55)}",
    ".dc-input[aria-invalid='true'],.dc-area[aria-invalid='true']{border-color:rgba(248,113,113,.55);box-shadow:0 0 0 3px rgba(248,113,113,.08)}",
    ".dc-input:focus-visible,.dc-area:focus-visible{outline:none}",
    ".dc-seg{display:grid;grid-template-columns:1fr 1fr;gap:4px;padding:4px;border:1px solid #1f2b45;border-radius:11px;background:rgba(8,13,24,.78)}",
    ".dc-seg-btn{appearance:none;border:0;background:transparent;border-radius:8px;padding:9px 10px;color:#8b9bb8;font-family:inherit;font-size:12px;font-weight:650;letter-spacing:.02em;cursor:pointer;transition:background .18s,color .18s,box-shadow .18s}",
    ".dc-seg-btn:hover{color:#c8d5ea}",
    ".dc-seg-btn[aria-checked='true']{background:linear-gradient(135deg,rgba(56,189,248,.2),rgba(129,140,248,.16));color:#e8eef9;box-shadow:inset 0 0 0 1px rgba(56,189,248,.34)}",
    ".dc-seg-btn:focus-visible{outline:2px solid rgba(56,189,248,.6);outline-offset:1px}",
    ".dc-select{position:relative}",
    ".dc-select-input{appearance:none;-webkit-appearance:none;padding-right:38px;cursor:pointer;color-scheme:dark}",
    ".dc-select svg{position:absolute;right:13px;top:50%;width:13px;height:13px;color:#64748b;transform:translateY(-50%);pointer-events:none}",
    ".dc-phone{display:flex;align-items:stretch;border:1px solid #1f2b45;border-radius:11px;background:rgba(8,13,24,.78);transition:border-color .2s,box-shadow .2s,background .2s}",
    ".dc-phone:focus-within{border-color:rgba(56,189,248,.62);background:rgba(10,17,30,.95);box-shadow:0 0 0 3px rgba(56,189,248,.11),0 0 30px -10px rgba(56,189,248,.55)}",
    ".dc-phone:has(.dc-phone-input[aria-invalid='true']){border-color:rgba(248,113,113,.55);box-shadow:0 0 0 3px rgba(248,113,113,.08)}",
    ".dc-prefix{display:flex;align-items:center;padding:0 11px;border-right:1px solid #1f2b45;background:rgba(148,163,184,.05);color:#93a4c3;font-size:12.5px;font-weight:600}",
    ".dc-phone .dc-phone-input{border:0;border-radius:0;background:transparent;box-shadow:none;padding:12px 13px;letter-spacing:.03em}",
    ".dc-phone .dc-phone-input:focus{box-shadow:none;border:0;background:transparent}",
    ".dc-row{display:grid;grid-template-columns:1fr 1fr;gap:12px}",
    ".dc-err{margin:6px 0 0;font-size:11px;line-height:1.4;color:#f87171;min-height:0}",
    ".dc-err:empty{display:none}",
    ".dc-chips{display:flex;flex-wrap:wrap;gap:7px}",
    ".dc-chip{appearance:none;padding:7px 11px;border-radius:8px;border:1px solid #22304d;background:rgba(12,20,34,.72);color:#93a4c3;font-family:inherit;font-size:11.5px;font-weight:600;cursor:pointer;transition:border-color .18s,background .18s,color .18s,box-shadow .18s,transform .18s}",
    ".dc-chip:hover{border-color:#2f4064;color:#c8d5ea;transform:translateY(-1px)}",
    ".dc-chip[aria-checked='true']{border-color:rgba(56,189,248,.55);background:rgba(56,189,248,.13);color:#e8eef9;box-shadow:0 0 20px -9px var(--accent)}",
    ".dc-chip:focus-visible{outline:2px solid rgba(56,189,248,.6);outline-offset:2px}",

    /* optional details */
    ".dc-more{margin:2px 0 16px;border:1px solid #1b2740;border-radius:11px;background:rgba(9,15,26,.55);overflow:hidden}",
    ".dc-more summary{list-style:none;cursor:pointer;display:flex;align-items:center;gap:8px;padding:11px 13px;font-size:11.5px;font-weight:600;color:#9fb0ca;transition:color .2s,background .2s}",
    ".dc-more summary::-webkit-details-marker{display:none}",
    ".dc-more summary:hover{color:#e8eef9;background:rgba(148,163,184,.04)}",
    ".dc-more summary .dc-plus{width:14px;height:14px;flex:none;color:#64748b;transition:transform .25s ease}",
    ".dc-more[open] summary .dc-plus{transform:rotate(45deg)}",
    ".dc-more summary span{margin-left:auto;font-size:9.5px;letter-spacing:.1em;text-transform:uppercase;color:#4d5b74;font-weight:600}",
    ".dc-more-body{padding:2px 13px 13px}",

    /* budget + timeline, revealed once a project category is chosen */
    ".dc-gate{animation:dcFadeUp .26s cubic-bezier(.2,.9,.2,1) both}",

    /* attachment: a closed opt-in row until the visitor asks for it */
    ".dc-attach-toggle{display:flex;align-items:center;gap:8px;width:100%;padding:11px 12px;border:1px dashed #22304d;border-radius:11px;background:rgba(9,15,26,.5);color:#9fb0ca;font-family:inherit;font-size:11.5px;font-weight:650;text-align:left;cursor:pointer;transition:border-color .2s,background .2s,color .2s}",
    ".dc-attach-toggle:hover{border-color:rgba(56,189,248,.45);background:rgba(56,189,248,.06);color:#e8eef9}",
    ".dc-attach-toggle:focus-visible{outline:2px solid rgba(56,189,248,.65);outline-offset:2px}",
    ".dc-attach-toggle svg{width:13px;height:13px;flex:none;color:#5c6a82;transition:color .2s}",
    ".dc-attach-toggle:hover svg{color:var(--accent)}",
    ".dc-attach-toggle-hint{margin-left:auto;font-size:9.5px;letter-spacing:.1em;text-transform:uppercase;color:#4d5b74;font-weight:600}",
    ".dc-file{position:relative;display:flex;align-items:center;gap:9px;padding:8px;border:1px dashed #22304d;border-radius:11px;background:rgba(8,13,24,.62);transition:border-color .2s,background .2s;animation:dcFadeUp .22s ease both}",
    ".dc-file:hover{border-color:rgba(56,189,248,.45);background:rgba(56,189,248,.05)}",
    ".dc-file[data-filled='true']{border-style:solid;border-color:rgba(56,189,248,.34);background:rgba(56,189,248,.06)}",
    ".dc-file input{position:absolute;width:1px;height:1px;opacity:0;clip-path:inset(50%);overflow:hidden;border:0;padding:0;margin:0;white-space:nowrap}",
    ".dc-file-btn{flex:none;padding:7px 11px;border-radius:8px;border:1px solid #2a3a5c;background:rgba(56,189,248,.12);color:#cfe3ff;font-size:11.5px;font-weight:650;letter-spacing:.01em;cursor:pointer;transition:border-color .18s,background .18s,color .18s}",
    ".dc-file-btn:hover{border-color:rgba(56,189,248,.55);background:rgba(56,189,248,.2);color:#e8eef9}",
    ".dc-file input:focus-visible ~ .dc-file-btn{outline:2px solid rgba(56,189,248,.7);outline-offset:2px}",
    ".dc-file-name{min-width:0;flex:1;font-size:11.5px;line-height:1.45;color:#6b7a95;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}",
    ".dc-file[data-filled='true'] .dc-file-name{color:#dbe6f7}",
    ".dc-file-remove{flex:none;width:26px;height:26px;display:grid;place-items:center;border:0;border-radius:7px;background:transparent;color:#7f8ba3;cursor:pointer;font-family:inherit;transition:background .18s,color .18s}",
    ".dc-file-remove:hover{background:rgba(248,113,113,.14);color:#fca5a5}",
    ".dc-file-remove svg{width:12px;height:12px}",

    /* banner */
    ".dc-banner{display:none;margin:0 0 14px;padding:10px 12px;border-radius:10px;border:1px solid rgba(248,113,113,.32);background:rgba(248,113,113,.08);color:#fca5a5;font-size:12px;line-height:1.5}",
    ".dc-banner[data-show='true']{display:block;animation:dcShake .4s ease}",

    /* submit */
    ".dc-submit{position:relative;display:flex;align-items:center;justify-content:center;gap:9px;width:100%;height:47px;border:0;border-radius:12px;cursor:pointer;overflow:hidden;font-family:inherit;font-size:13.5px;font-weight:750;letter-spacing:.01em;color:#05070d;background:linear-gradient(100deg,var(--accent),#6366f1 58%,#a855f7);box-shadow:0 18px 42px -18px var(--accent);transition:transform .2s,box-shadow .2s,filter .2s}",
    ".dc-submit:hover{transform:translateY(-1px);filter:brightness(1.06);box-shadow:0 22px 48px -18px var(--accent)}",
    ".dc-submit:active{transform:translateY(0)}",
    ".dc-submit:focus-visible{outline:2px solid #c7d2fe;outline-offset:2px}",
    ".dc-submit::after{content:'';position:absolute;inset:0;background:linear-gradient(110deg,transparent 22%,rgba(255,255,255,.4) 46%,transparent 64%);transform:translateX(-130%);transition:transform .75s ease;pointer-events:none}",
    ".dc-submit:hover::after{transform:translateX(130%)}",
    ".dc-submit[disabled]{opacity:.72;cursor:progress;transform:none}",
    ".dc-arrow{width:16px;height:16px;transition:transform .25s ease}",
    ".dc-submit:hover .dc-arrow{transform:translateX(3px)}",
    ".dc-spin{width:15px;height:15px;border-radius:50%;border:2px solid rgba(5,7,13,.22);border-top-color:#05070d;animation:dcRot .7s linear infinite}",
    ".dc-foot{display:flex;align-items:center;justify-content:center;gap:6px;margin:11px 0 0;font-size:10.5px;line-height:1.5;color:#5c6a82;text-align:center}",
    ".dc-foot svg{width:11px;height:11px;flex:none;color:#4c5a73}",
    ".dc-hp{position:absolute!important;left:-9999px!important;top:auto!important;width:1px!important;height:1px!important;opacity:0!important;pointer-events:none!important}",

    /* success */
    ".dc-success{display:none;text-align:center;padding:16px 4px 8px}",
    ".dc-card[data-state='success'] .dc-badge,.dc-card[data-state='success'] .dc-h1,.dc-card[data-state='success'] .dc-sub,.dc-card[data-state='success'] .dc-meter,.dc-card[data-state='success'] .dc-meter-note{display:none}",
    ".dc-card[data-state='success'] .dc-success{padding-top:26px}",
    ".dc-success[data-show='true']{display:block;animation:dcFadeUp .45s cubic-bezier(.2,.9,.2,1) both}",
    ".dc-ring{width:74px;height:74px;margin:0 auto 18px;position:relative;display:grid;place-items:center}",
    ".dc-ring::before{content:'';position:absolute;inset:0;border-radius:50%;border:1px solid rgba(52,211,153,.3);animation:dcRing 2.8s ease-out infinite}",
    ".dc-ring::after{content:'';position:absolute;inset:-10px;border-radius:50%;background:radial-gradient(circle,rgba(52,211,153,.16),transparent 65%)}",
    ".dc-ring svg{width:74px;height:74px;position:relative}",
    ".dc-ring-circle{fill:none;stroke:rgba(52,211,153,.28);stroke-width:2}",
    ".dc-ring-check{fill:none;stroke:#34d399;stroke-width:3;stroke-linecap:round;stroke-linejoin:round;stroke-dasharray:44;stroke-dashoffset:44;animation:dcDraw .55s .18s cubic-bezier(.2,.8,.2,1) forwards}",
    ".dc-success h2{margin:0;font-size:22px;letter-spacing:-.02em;font-weight:700}",
    ".dc-success p{margin:9px auto 0;max-width:39ch;font-size:12.5px;line-height:1.65;color:var(--muted)}",
    ".dc-success .dc-succ-meta{display:inline-flex;align-items:center;gap:7px;margin-top:16px;padding:7px 12px;border-radius:999px;border:1px solid #1f2b45;background:rgba(9,15,26,.7);font-size:10.5px;color:#93a4c3}",
    ".dc-ghost{margin-top:22px;padding:10px 18px;border-radius:10px;border:1px solid #22304d;background:transparent;color:#c8d5ea;font-family:inherit;font-size:12px;font-weight:600;cursor:pointer;transition:background .2s,border-color .2s}",
    ".dc-ghost:hover{background:rgba(148,163,184,.07);border-color:#2f4064}",
    ".dc-ghost:focus-visible,.dc-close:focus-visible{outline:2px solid rgba(56,189,248,.75);outline-offset:2px}",

    /* inline variant */
    ".dc-inline{width:100%;display:flex;justify-content:center}",
    ".dc-inline .dc-shell{width:100%;max-width:548px;max-height:none;animation:none}",
    ".dc-inline .dc-shell::before{animation:none;opacity:.55}",
    ".dc-inline .dc-body{overflow:visible}",
    ".dc-inline .dc-close{display:none}",

    /* animations */
    "@keyframes dcFade{from{opacity:0}to{opacity:1}}",
    "@keyframes dcPop{from{opacity:0;transform:translateY(16px) scale(.975)}to{opacity:1;transform:none}}",
    "@keyframes dcFadeUp{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:none}}",
    "@keyframes dcSheetUp{from{transform:translateY(100%)}to{transform:none}}",
    "@keyframes dcBorder{0%,100%{opacity:.55}50%{opacity:.95}}",
    "@keyframes dcRot{to{transform:rotate(360deg)}}",
    "@keyframes dcRing{0%{transform:scale(.96);opacity:.75}70%{transform:scale(1.18);opacity:0}100%{transform:scale(1.18);opacity:0}}",
    "@keyframes dcBlink{0%{box-shadow:0 0 0 0 rgba(52,211,153,.5)}70%{box-shadow:0 0 0 7px rgba(52,211,153,0)}100%{box-shadow:0 0 0 0 rgba(52,211,153,0)}}",
    "@keyframes dcDriftA{from{transform:translate3d(0,0,0)}to{transform:translate3d(40px,26px,0)}}",
    "@keyframes dcDriftB{from{transform:translate3d(0,0,0)}to{transform:translate3d(-34px,-24px,0)}}",
    "@keyframes dcDraw{to{stroke-dashoffset:0}}",
    "@keyframes dcShake{0%,100%{transform:translateX(0)}25%{transform:translateX(-4px)}75%{transform:translateX(4px)}}",

    "@media (max-width:600px){",
    ".dc-wrap{padding:0;align-items:flex-end}",
    ".dc-shell{width:100%;max-height:94vh;border-radius:24px 24px 0 0;animation:dcSheetUp .42s cubic-bezier(.16,.9,.24,1) both}",
    ".dc-shell::before{border-radius:25px 25px 0 0}",
    ".dc-card{border-radius:23px 23px 0 0}",
    ".dc-top{padding:20px 58px 0 20px}",
    ".dc-body{padding:20px 20px calc(22px + env(safe-area-inset-bottom,0px))}",
    ".dc-h1{font-size:24px}",
    ".dc-row{grid-template-columns:1fr}",
    "}",
    "@media (prefers-reduced-motion:reduce){",
    ".dc-scrim,.dc-shell,.dc-success[data-show='true'],.dc-banner[data-show='true'],.dc-card,.dc-aura,.dc-mark::after,.dc-ring::before{animation:none!important}",
    ".dc-shell::before,.dc-meter i,.dc-submit,.dc-chip,.dc-arrow,.dc-submit::after{transition:none!important;animation:none!important}",
    "}",
  ].join("");

  var ICONS = {
    close:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M6 6l12 12M18 6L6 18"/></svg>',
    arrow:
      '<svg class="dc-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h13"/><path d="M12 5l7 7-7 7"/></svg>',
    plus:
      '<svg class="dc-plus" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M12 5v14M5 12h14"/></svg>',
    lock:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><rect x="4" y="10" width="16" height="10" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/></svg>',
    chevron:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9l6 6 6-6"/></svg>',
    paperclip:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 11.05l-9.19 9.19a5 5 0 0 1-7.07-7.07l9.19-9.19a3.5 3.5 0 0 1 4.95 4.95l-9.19 9.19a2 2 0 0 1-2.83-2.83l8.49-8.49"/></svg>',
  };

  // Mirrors src/lib/service-catalog.ts. Labels are cosmetic; ids are the API
  // contract, so keep them identical when adding a service.
  var CATEGORIES = [
    {
      id: "general",
      label: "General inquiry",
      hint: "What would you like to ask? A sentence is enough.",
      services: [
        ["question", "Just a question"],
        ["hiring", "Full-time / hiring"],
        ["partnership", "Collaboration or partnership"],
        ["other-general", "Something else"],
      ],
    },
    {
      id: "website",
      label: "Website & web app",
      hint: "What should the site do? Pages, goals, references — anything helps.",
      services: [
        ["business-website", "Business website"],
        ["web-app", "Web app / dashboard"],
        ["ecommerce", "Online store"],
        ["redesign", "Website redesign"],
      ],
    },
    {
      id: "mobile",
      label: "Mobile app",
      hint: "Tell me about the app: platform, core screens, who uses it.",
      services: [
        ["android", "Android app"],
        ["ios", "iOS app"],
        ["cross-platform", "Cross-platform app"],
      ],
    },
    {
      id: "software",
      label: "Software & APIs",
      hint: "Describe the system, the integrations and what must be automated.",
      services: [
        ["microservices", "Microservices / backend API"],
        ["saas", "SaaS product build"],
        ["automation", "Automation / internal tools"],
        ["ai-integration", "AI integration / agents"],
      ],
    },
    {
      id: "design",
      label: "Design & branding",
      hint: "What are we designing, and what should it feel like?",
      services: [
        ["ui-ux", "UI/UX design"],
        ["logo-brand", "Logo & brand identity"],
        ["design-system", "Design system"],
      ],
    },
    {
      id: "marketing",
      label: "Growth & marketing",
      hint: "What are you promoting, and what does success look like?",
      services: [
        ["seo", "SEO"],
        ["ads", "Digital marketing / ads"],
        ["content", "Content & copywriting"],
      ],
    },
    {
      id: "cloud",
      label: "Cloud & deployment",
      hint: "What is running today, and where should it end up — Vercel, AWS, VPS?",
      services: [
        ["deploy-devops", "App deployment / DevOps"],
        ["domain-email", "Domain, DNS & business email"],
        ["audit", "Performance & security audit"],
      ],
    },
    {
      id: "other",
      label: "Something else",
      hint: "Tell me what you have in mind — I read every message.",
      services: [["custom", "Custom project"]],
    },
  ];

  var BUDGETS = ["Under ₹25k", "₹25k – ₹1L", "₹1L – ₹5L", "₹5L+", "Not sure yet"];
  var TIMELINES = ["ASAP", "2–4 weeks", "1–3 months", "Flexible"];
  var REQUIREMENTS = ["name", "contact", "service", "requirement"];

  // One optional attachment travels as base64 inside the JSON payload, so the
  // endpoint stays a plain POST and the encoded body still clears the 4.5 MB
  // serverless request limit with room for the brief itself.
  var MAX_ATTACHMENT_BYTES = 2.5 * 1024 * 1024;
  var ATTACHMENT_EXTS = [
    "pdf",
    "png",
    "jpg",
    "jpeg",
    "webp",
    "gif",
    "doc",
    "docx",
    "xls",
    "xlsx",
    "txt",
    "zip",
  ];
  var ATTACHMENT_ACCEPT =
    ".pdf,.png,.jpg,.jpeg,.webp,.gif,.doc,.docx,.xls,.xlsx,.txt,.zip,application/pdf,image/*";
  var MIME_BY_EXT = {
    pdf: "application/pdf",
    png: "image/png",
    jpg: "image/jpeg",
    jpeg: "image/jpeg",
    webp: "image/webp",
    gif: "image/gif",
    doc: "application/msword",
    docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    xls: "application/vnd.ms-excel",
    xlsx: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    txt: "text/plain",
    zip: "application/zip",
  };

  function extensionOf(filename) {
    var parts = String(filename || "").toLowerCase().split(".");
    return parts.length > 1 ? parts.pop() : "";
  }

  function formatBytes(bytes) {
    if (bytes >= 1024 * 1024) {
      return (bytes / (1024 * 1024)).toFixed(bytes >= 10 * 1024 * 1024 ? 0 : 1) + " MB";
    }
    return Math.max(1, Math.round(bytes / 1024)) + " KB";
  }

  function findCategory(id) {
    for (var i = 0; i < CATEGORIES.length; i += 1) {
      if (CATEGORIES[i].id === id) return CATEGORIES[i];
    }
    return null;
  }

  var initials = config.name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map(function (part) {
      return part.charAt(0);
    })
    .join("")
    .toUpperCase();

  function chip(group, value, label) {
    return (
      '<button type="button" class="dc-chip" role="radio" aria-checked="false" data-group="' +
      group +
      '" data-value="' +
      esc(value) +
      '">' +
      esc(label) +
      "</button>"
    );
  }

  function cardMarkup() {
    return [
      '<div class="dc-card" role="document">',
      '<button class="dc-close" type="button" data-close aria-label="Close contact form">' + ICONS.close + '</button>',
      '<div class="dc-top">',
      '<div class="dc-mark" aria-hidden="true">' + esc(initials) + '</div>',
      '<div class="dc-ident">',
      '<div class="dc-name">' + esc(config.name) + '</div>',
      '<div class="dc-role">' + esc(config.role) + '</div>',
      '</div>',
      '</div>',
      '<div class="dc-body">',
      '<span class="dc-badge"><span class="dc-dot"></span>Open to new projects</span>',
      '<h1 class="dc-h1" id="dc-title">Tell me what you\'re <span class="dc-grad">building</span>.</h1>',
      '<p class="dc-sub">One short brief is enough. I read every message myself and reply within a working day.</p>',
      '<div class="dc-meter" aria-hidden="true"><i></i></div>',
      '<div class="dc-meter-note"><span>Project brief</span><span class="dc-meter-label">0 / 4</span></div>',
      '<form class="dc-form" novalidate>',
      '<div class="dc-banner" role="alert"></div>',
      '<div class="dc-field">',
      '<label class="dc-label" for="dc-name">Your name</label>',
      '<input class="dc-input" id="dc-name" name="name" type="text" autocomplete="name" placeholder="Ada Lovelace" maxlength="80" required />',
      '<p class="dc-err" data-err="name"></p>',
      '</div>',
      '<div class="dc-field">',
      '<span class="dc-label">How should I reach you?<span class="dc-opt">Choose one</span></span>',
      '<div class="dc-seg" role="radiogroup" aria-label="Preferred contact method">',
      '<button type="button" class="dc-seg-btn" data-method="email" aria-checked="true">Email</button>',
      '<button type="button" class="dc-seg-btn" data-method="phone" aria-checked="false">Mobile</button>',
      '</div>',
      '</div>',
      '<div class="dc-field" data-contact="email">',
      '<label class="dc-label" for="dc-email">Email<span class="dc-opt">Required</span></label>',
      '<input class="dc-input" id="dc-email" name="email" type="email" inputmode="email" autocomplete="email" placeholder="you@company.com" maxlength="160" />',
      '<p class="dc-err" data-err="email"></p>',
      '</div>',
      '<div class="dc-field" data-contact="phone" hidden>',
      '<label class="dc-label" for="dc-phone">Mobile number<span class="dc-opt">+91 · 10 digits</span></label>',
      '<div class="dc-phone">',
      '<span class="dc-prefix" aria-hidden="true">+91</span>',
      '<input class="dc-input dc-phone-input" id="dc-phone" name="phone" type="tel" inputmode="numeric" autocomplete="tel-national" placeholder="98765 43210" maxlength="10" />',
      '</div>',
      '<p class="dc-err" data-err="phone"></p>',
      '</div>',
      '<div class="dc-field">',
      '<label class="dc-label" for="dc-category">What do you need?<span class="dc-opt">Required</span></label>',
      '<div class="dc-select">',
      '<select class="dc-input dc-select-input" id="dc-category" name="category">',
      '<option value="">Select a service…</option>',
      CATEGORIES.map(function (item) {
        return '<option value="' + esc(item.id) + '">' + esc(item.label) + "</option>";
      }).join(""),
      '</select>',
      ICONS.chevron,
      '</div>',
      '<p class="dc-err" data-err="category"></p>',
      '</div>',
      '<div class="dc-field" data-service-field hidden>',
      '<span class="dc-label">Service<span class="dc-opt">Pick the closest</span></span>',
      '<div class="dc-chips" role="radiogroup" aria-label="Service" data-service-list></div>',
      '<p class="dc-err" data-err="service"></p>',
      '</div>',
      '<div class="dc-field">',
      '<label class="dc-label" for="dc-requirement">Project details<span class="dc-opt">Required</span></label>',
      '<textarea class="dc-area" id="dc-requirement" name="requirement" placeholder="A website, an online store, an app…" maxlength="5000"></textarea>',
      '<p class="dc-err" data-err="requirement"></p>',
      '</div>',
      '<div class="dc-field">',
      '<button class="dc-attach-toggle" type="button" data-attach-toggle aria-expanded="false" aria-controls="dc-file-row">' +
        ICONS.paperclip +
        '<span>Add attachment</span>' +
        '<span class="dc-attach-toggle-hint">PDF · doc · max 2.5 MB</span>' +
        '</button>',
      '<div class="dc-file" id="dc-file-row" data-file data-filled="false" hidden>',
      '<input id="dc-attachment" name="attachment" type="file" accept="' +
        ATTACHMENT_ACCEPT +
        '" />',
      '<label class="dc-file-btn" for="dc-attachment">Choose file</label>',
      '<span class="dc-file-name" data-file-name>No file selected</span>',
      '<button class="dc-file-remove" type="button" data-file-remove aria-label="Close attachment picker">' +
        ICONS.close +
        '</button>',
      '</div>',
      '<p class="dc-err" data-err="attachment"></p>',
      '</div>',
      '<div class="dc-field" data-gate="budget" hidden>',
      '<span class="dc-label">Budget<span class="dc-opt">Optional</span></span>',
      '<div class="dc-chips" role="radiogroup" aria-label="Budget">',
      BUDGETS.map(function (option) { return chip("budget", option, option); }).join(""),
      '</div>',
      '</div>',
      '<div class="dc-field" data-gate="timeline" hidden>',
      '<span class="dc-label">Timeline<span class="dc-opt">Optional</span></span>',
      '<div class="dc-chips" role="radiogroup" aria-label="Timeline">',
      TIMELINES.map(function (option) { return chip("timeline", option, option); }).join(""),
      '</div>',
      '</div>',
      '<details class="dc-more">',
      '<summary>' + ICONS.plus + 'Add context<span>Company · link</span></summary>',
      '<div class="dc-more-body">',
      '<div class="dc-field">',
      '<label class="dc-label" for="dc-company">Company<span class="dc-opt">Optional</span></label>',
      '<input class="dc-input" id="dc-company" name="company" type="text" autocomplete="organization" placeholder="Acme Labs" maxlength="120" />',
      '</div>',
      '<div class="dc-field" style="margin-bottom:0">',
      '<label class="dc-label" for="dc-link">Reference<span class="dc-opt">Optional</span></label>',
      '<input class="dc-input" id="dc-link" name="link" type="url" inputmode="url" placeholder="https://existing-site.com" maxlength="500" />',
      '<p class="dc-err" data-err="link"></p>',
      '</div>',
      '</div>',
      '</details>',
      '<input class="dc-hp" type="text" name="botcheck" tabindex="-1" autocomplete="off" aria-hidden="true" />',
      '<button class="dc-submit" type="submit">',
      '<span>Send project brief</span>' + ICONS.arrow,
      '</button>',
      '<p class="dc-foot">' + ICONS.lock + 'Goes straight to my inbox. No lists, no spam.</p>',
      '</form>',
      '<div class="dc-success" role="status" aria-live="polite">',
      '<div class="dc-ring" aria-hidden="true">',
      '<svg viewBox="0 0 74 74"><circle class="dc-ring-circle" cx="37" cy="37" r="35"/>',
      '<path class="dc-ring-check" d="M23 38.5l9.5 9.5L51 29"/></svg>',
      '</div>',
      '<h2>Brief received.</h2>',
      '<p>Thanks <strong data-succ-name>there</strong> — <span data-succ-verb>I\'ll reply to</span> <strong data-succ-contact>your inbox</strong> within a working day.</p>',
      '<div class="dc-succ-meta"><span class="dc-dot"></span>' + esc(config.email) + '</div>',
      '<div><button class="dc-ghost" type="button" data-close>Close</button></div>',
      '</div>',
      '</div>',
      '</div>',
    ].join("");
  }

  function createSurface(inline) {
    var host = document.createElement("div");
    host.setAttribute("data-dc-host", inline ? "inline" : "modal");
    var shadow = host.attachShadow({ mode: "open" });
    var wrapper = inline
      ? '<div class="dc-root dc-inline"><div class="dc-shell">' + cardMarkup() + "</div></div>"
      : '<div class="dc-root dc-wrap">' +
        '<div class="dc-scrim" data-close></div>' +
        '<div class="dc-aura dc-aura-a"></div>' +
        '<div class="dc-aura dc-aura-b"></div>' +
        '<div class="dc-shell" role="dialog" aria-modal="true" aria-labelledby="dc-title">' +
        cardMarkup() +
        "</div></div>";

    shadow.innerHTML = "<style>" + CSS + "</style>" + wrapper;

    var card = shadow.querySelector(".dc-card");
    var body = shadow.querySelector(".dc-body");
    var form = shadow.querySelector(".dc-form");
    var banner = shadow.querySelector(".dc-banner");
    var success = shadow.querySelector(".dc-success");
    var meter = shadow.querySelector(".dc-meter i");
    var meterLabel = shadow.querySelector(".dc-meter-label");
    var submit = shadow.querySelector(".dc-submit");
    var honeypot = shadow.querySelector(".dc-hp");
    var serviceField = shadow.querySelector("[data-service-field]");
    var serviceList = shadow.querySelector("[data-service-list]");
    var gateFields = shadow.querySelectorAll("[data-gate]");
    var attachToggle = shadow.querySelector("[data-attach-toggle]");
    var attachmentInput = shadow.querySelector("#dc-attachment");
    var attachmentRow = shadow.querySelector("[data-file]");
    var attachmentLabel = shadow.querySelector("[data-file-name]");
    var attachmentRemove = shadow.querySelector("[data-file-remove]");
    var fields = {
      name: shadow.querySelector("#dc-name"),
      email: shadow.querySelector("#dc-email"),
      phone: shadow.querySelector("#dc-phone"),
      category: shadow.querySelector("#dc-category"),
      requirement: shadow.querySelector("#dc-requirement"),
      company: shadow.querySelector("#dc-company"),
      link: shadow.querySelector("#dc-link"),
    };
    var values = { budget: "", timeline: "", service: "" };
    var attachment = null;
    var contactMethod = "email";
    var context = { source: "" };
    var previousFocus = null;
    var previousOverflow = "";

    if (!inline) host.hidden = true;

    function checkField(key) {
      if (key === "name") {
        var name = fields.name.value.trim();
        return name.length >= 2 ? "" : "Please share your name.";
      }
      if (key === "contact") {
        if (contactMethod === "phone") {
          return /^[6-9]\d{9}$/.test(fields.phone.value.trim())
            ? ""
            : "Enter a valid 10-digit mobile number.";
        }
        return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(fields.email.value.trim())
          ? ""
          : "Enter a valid email address.";
      }
      if (key === "service") {
        return fields.category.value && values.service ? "" : "Choose a service.";
      }
      if (key === "requirement") {
        return fields.requirement.value.trim().length >= 10
          ? ""
          : "A sentence or two is enough (10+ characters).";
      }
      if (key === "link" && fields.link.value.trim()) {
        return /^https?:\/\/\S+$/i.test(fields.link.value.trim())
          ? ""
          : "Use a full link starting with https://";
      }
      return "";
    }

    function setError(key, message) {
      var input = fields[key];
      var target = shadow.querySelector('[data-err="' + key + '"]');

      // Email and phone share one "contact" requirement: only the visible one
      // carries the error, and switching methods clears the other.
      if (key === "contact") {
        var activeKey = contactMethod === "phone" ? "phone" : "email";
        var inactiveKey = activeKey === "phone" ? "email" : "phone";
        input = fields[activeKey];
        target = shadow.querySelector('[data-err="' + activeKey + '"]');
        if (fields[inactiveKey]) fields[inactiveKey].setAttribute("aria-invalid", "false");
        var inactiveTarget = shadow.querySelector('[data-err="' + inactiveKey + '"]');
        if (inactiveTarget) inactiveTarget.textContent = "";
      }

      if (input) input.setAttribute("aria-invalid", message ? "true" : "false");
      if (target) target.textContent = message || "";
    }

    function renderServices() {
      var category = findCategory(fields.category.value);
      values.service = "";
      serviceField.hidden = !category;
      serviceList.innerHTML = category
        ? category.services
            .map(function (item) {
              return chip("service", item[0], item[1]);
            })
            .join("")
        : "";
      fields.requirement.placeholder = category
        ? category.hint
        : "A website, an online store, an app…";
      setError("service", "");
      renderGates(category);
      refreshMeter();
    }

    // Budget and timeline are only meaningful for an actual project, so they
    // stay locked until a project category is picked. A general enquiry keeps
    // the form short, and anything already chosen is dropped when they hide.
    function renderGates(category) {
      var show = Boolean(category) && category.id !== "general";
      Array.prototype.forEach.call(gateFields, function (node) {
        node.hidden = !show;
      });
      if (show) return;
      values.budget = "";
      values.timeline = "";
      Array.prototype.forEach.call(
        shadow.querySelectorAll('[data-group="budget"], [data-group="timeline"]'),
        function (node) {
          node.setAttribute("aria-checked", "false");
        },
      );
    }

    function setAttachOpen(open) {
      attachmentRow.hidden = !open;
      attachToggle.hidden = open;
      attachToggle.setAttribute("aria-expanded", open ? "true" : "false");
    }

    function renderAttachment() {
      var filled = Boolean(attachment);
      attachmentRow.setAttribute("data-filled", filled ? "true" : "false");
      attachmentRemove.setAttribute(
        "aria-label",
        filled ? "Remove attachment" : "Close attachment picker",
      );
      attachmentLabel.textContent = filled
        ? attachment.name + " · " + formatBytes(attachment.size)
        : "No file selected";
    }

    function clearAttachment() {
      attachment = null;
      if (attachmentInput) attachmentInput.value = "";
      renderAttachment();
      setError("attachment", "");
    }

    function readAttachment(event) {
      var file = event.target.files && event.target.files[0];
      if (!file) return;
      var ext = extensionOf(file.name);

      if (ATTACHMENT_EXTS.indexOf(ext) === -1) {
        clearAttachment();
        setError("attachment", "Attach a PDF, image, Word/Excel, TXT or ZIP file.");
        return;
      }

      if (file.size > MAX_ATTACHMENT_BYTES) {
        var tooBig = formatBytes(file.size);
        clearAttachment();
        setError(
          "attachment",
          "That file is " + tooBig + " — the limit is 2.5 MB. Send a link instead.",
        );
        return;
      }

      var reader = new FileReader();
      reader.onload = function () {
        var result = String(reader.result || "");
        var comma = result.indexOf(",");
        if (comma < 0) {
          clearAttachment();
          setError("attachment", "That file could not be read. Try another one.");
          return;
        }
        attachment = {
          name: file.name.slice(0, 160),
          type: file.type || MIME_BY_EXT[ext] || "application/octet-stream",
          size: file.size,
          data: result.slice(comma + 1),
        };
        setError("attachment", "");
        renderAttachment();
      };
      reader.onerror = function () {
        clearAttachment();
        setError("attachment", "That file could not be read. Try another one.");
      };
      reader.readAsDataURL(file);
    }

    function setMethod(method, focusActive) {
      contactMethod = method === "phone" ? "phone" : "email";
      Array.prototype.forEach.call(shadow.querySelectorAll("[data-method]"), function (button) {
        button.setAttribute(
          "aria-checked",
          button.getAttribute("data-method") === contactMethod ? "true" : "false",
        );
      });
      shadow.querySelector('[data-contact="email"]').hidden = contactMethod !== "email";
      shadow.querySelector('[data-contact="phone"]').hidden = contactMethod !== "phone";
      ["email", "phone"].forEach(function (key) {
        if (fields[key]) fields[key].setAttribute("aria-invalid", "false");
        var target = shadow.querySelector('[data-err="' + key + '"]');
        if (target) target.textContent = "";
      });
      refreshMeter();
      if (focusActive) {
        var active = contactMethod === "phone" ? fields.phone : fields.email;
        if (active) active.focus({ preventScroll: true });
      }
    }

    function refreshMeter() {
      var done = 0;
      REQUIREMENTS.forEach(function (key) {
        if (!checkField(key)) done += 1;
      });
      meter.style.width = Math.max(4, (done / REQUIREMENTS.length) * 100) + "%";
      meterLabel.textContent = done + " / " + REQUIREMENTS.length;
    }

    function setLoading(loading) {
      submit.disabled = loading;
      submit.setAttribute("aria-busy", loading ? "true" : "false");
      submit.innerHTML = loading
        ? '<span class="dc-spin" aria-hidden="true"></span><span>Sending…</span>'
        : '<span>Send project brief</span>' + ICONS.arrow;
    }

    function reset() {
      card.removeAttribute("data-state");
      form.reset();
      values.budget = "";
      values.timeline = "";
      values.service = "";
      Array.prototype.forEach.call(shadow.querySelectorAll("[data-group]"), function (node) {
        node.setAttribute("aria-checked", "false");
      });
      setMethod("email", false);
      clearAttachment();
      setAttachOpen(false);
      renderServices();
      ["name", "contact", "category", "service", "requirement", "link", "attachment"].forEach(
        function (key) {
          setError(key, "");
        },
      );
      banner.textContent = "";
      banner.setAttribute("data-show", "false");
      success.setAttribute("data-show", "false");
      form.style.display = "";
      setLoading(false);
      refreshMeter();
      body.scrollTop = 0;
    }

    function showSuccess(payload) {
      card.setAttribute("data-state", "success");
      body.scrollTop = 0;
      var nameSlot = shadow.querySelector("[data-succ-name]");
      var verbSlot = shadow.querySelector("[data-succ-verb]");
      var contactSlot = shadow.querySelector("[data-succ-contact]");
      var byPhone = payload.contactMethod === "phone";
      if (nameSlot) nameSlot.textContent = payload.name.trim().split(/\s+/)[0];
      if (verbSlot) verbSlot.textContent = byPhone ? "I'll call you back on" : "I'll reply to";
      if (contactSlot) contactSlot.textContent = byPhone ? "+91 " + payload.phone : payload.email;
      form.style.display = "none";
      success.setAttribute("data-show", "true");
      var closeButton = success.querySelector("[data-close]");
      if (closeButton) closeButton.focus({ preventScroll: true });
      if (window.parent !== window) {
        window.parent.postMessage({ type: "dev-contact:success" }, "*");
      }
      try {
        document.dispatchEvent(
          new CustomEvent("dev-contact:success", {
            detail: {
              name: payload.name,
              email: payload.email,
              phone: payload.phone,
              contactMethod: payload.contactMethod,
            },
          }),
        );
      } catch (error) {
        /* CustomEvent is unavailable only on very old engines. */
      }
    }

    function submitForm(event) {
      event.preventDefault();
      banner.textContent = "";
      banner.setAttribute("data-show", "false");

      var firstInvalid = null;
      REQUIREMENTS.forEach(function (key) {
        var message = checkField(key);
        setError(key, message);
        if (message && !firstInvalid) {
          firstInvalid =
            key === "contact"
              ? contactMethod === "phone"
                ? fields.phone
                : fields.email
              : key === "service"
                ? fields.category
                : fields[key];
        }
      });

      var categoryError = fields.category.value ? "" : "Choose what you need.";
      setError("category", categoryError);
      if (categoryError && !firstInvalid) firstInvalid = fields.category;

      var serviceError =
        fields.category.value && !values.service ? "Pick the closest service." : "";
      setError("service", serviceError);
      if (serviceError && !firstInvalid) firstInvalid = fields.category;

      var linkError = checkField("link");
      setError("link", linkError);
      if (linkError && !firstInvalid) firstInvalid = fields.link;
      refreshMeter();

      if (attachment && !attachment.data) {
        setError("attachment", "That file could not be read. Try another one.");
        return;
      }

      if (firstInvalid) {
        firstInvalid.focus({ preventScroll: false });
        return;
      }

      var payload = {
        name: fields.name.value.trim(),
        email: contactMethod === "email" ? fields.email.value.trim() : "",
        phone: contactMethod === "phone" ? fields.phone.value.trim() : "",
        contactMethod: contactMethod,
        category: fields.category.value,
        service: values.service,
        requirement: fields.requirement.value.trim(),
        company: fields.company.value.trim(),
        budget: values.budget,
        timeline: values.timeline,
        link: fields.link.value.trim(),
        attachment: attachment
          ? {
              name: attachment.name,
              type: attachment.type,
              size: attachment.size,
              data: attachment.data,
            }
          : undefined,
        botcheck: honeypot.value,
        source: context.source || config.source || location.href,
        pageUrl: location.href,
        referrer: document.referrer || undefined,
      };

      setLoading(true);

      fetch(config.endpoint, {
        method: "POST",
        mode: "cors",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })
        .then(function (response) {
          return response
            .json()
            .catch(function () {
              return {};
            })
            .then(function (data) {
              return { ok: response.ok, data: data };
            });
        })
        .then(function (result) {
          if (result.ok && result.data && result.data.ok) {
            showSuccess(payload);
            return;
          }
          setLoading(false);
          var mapped = result.data && result.data.errors;
          if (mapped) {
            Object.keys(mapped).forEach(function (key) {
              setError(key, String(mapped[key]));
            });
          }
          banner.textContent =
            (result.data && result.data.error) || "Something went wrong. Please try again.";
          banner.setAttribute("data-show", "true");
        })
        .catch(function () {
          setLoading(false);
          banner.textContent = "Network error — check your connection and try again.";
          banner.setAttribute("data-show", "true");
        });
    }

    function focusable() {
      return Array.prototype.filter.call(
        shadow.querySelectorAll(
          'a[href],button:not([disabled]),input:not([disabled]),textarea:not([disabled]),summary,[tabindex]:not([tabindex="-1"])',
        ),
        function (node) {
          return node.getClientRects().length > 0;
        },
      );
    }

    function open(opts) {
      context.source = (opts && opts.source) || "";
      previousFocus = document.activeElement;
      host.hidden = false;
      if (!inline) {
        previousOverflow = document.documentElement.style.overflow;
        document.documentElement.style.overflow = "hidden";
        document.addEventListener("keydown", onKeydown, true);
        window.setTimeout(function () {
          if (fields.name) fields.name.focus({ preventScroll: true });
          // Chromium still nudges scrollable ancestors for a focused field on
          // small screens; pin the sheet back to the top so the header reads.
          body.scrollTop = 0;
        }, 160);
      }
      notifyHeight();
    }

    function close() {
      if (inline) {
        reset();
        return;
      }
      host.hidden = true;
      document.documentElement.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKeydown, true);
      if (previousFocus && previousFocus.focus) {
        try {
          previousFocus.focus({ preventScroll: true });
        } catch (error) {
          /* the trigger may have been removed from the DOM */
        }
      }
      window.setTimeout(reset, 260);
    }

    function onKeydown(event) {
      if (event.key === "Escape" && !inline) close();
    }

    function notifyHeight() {
      if (!inline || window.parent === window) return;
      var height = Math.ceil(card.getBoundingClientRect().height);
      if (height > 0) window.parent.postMessage({ type: "dev-contact:height", height: height }, "*");
    }

    form.addEventListener("submit", submitForm);

    Array.prototype.forEach.call(shadow.querySelectorAll(".dc-input, .dc-area"), function (input) {
      input.addEventListener("blur", function () {
        var key = input.getAttribute("name");
        if (key === "email" || key === "phone") key = "contact";
        if (key && fields[key]) setError(key, checkField(key));
        refreshMeter();
      });
      input.addEventListener("input", function () {
        var key = input.getAttribute("name");
        if (key === "email" || key === "phone") key = "contact";
        if (key && input.getAttribute("aria-invalid") === "true") setError(key, checkField(key));
        refreshMeter();
      });
    });

    // The country code is fixed at +91, so the field accepts digits only.
    fields.phone.addEventListener("input", function () {
      var digits = fields.phone.value.replace(/\D/g, "").slice(0, 10);
      if (digits !== fields.phone.value) fields.phone.value = digits;
      if (contactMethod === "phone" && fields.phone.getAttribute("aria-invalid") === "true") {
        setError("contact", checkField("contact"));
      }
      refreshMeter();
    });

    fields.category.addEventListener("change", function () {
      renderServices();
      setError("category", fields.category.value ? "" : "Choose what you need.");
    });

    if (attachmentInput) {
      attachmentInput.addEventListener("change", readAttachment);

      // The picker stays out of the way until it is asked for: one small row,
      // then the file input only appears with the visitor's intent.
      attachToggle.addEventListener("click", function (event) {
        event.preventDefault();
        setAttachOpen(true);
        attachmentInput.focus({ preventScroll: true });
      });

      attachmentRemove.addEventListener("click", function (event) {
        event.preventDefault();
        var hadFile =
          Boolean(attachment) || Boolean(attachmentInput.files && attachmentInput.files.length);
        clearAttachment();
        if (hadFile) {
          attachmentInput.focus({ preventScroll: true });
        } else {
          setAttachOpen(false);
          attachToggle.focus({ preventScroll: true });
        }
      });
    }

    shadow.addEventListener("click", function (event) {
      var target = event.target;
      var closer = target && target.closest ? target.closest("[data-close]") : null;
      if (closer) {
        event.preventDefault();
        close();
        return;
      }
      var methodButton = target && target.closest ? target.closest("[data-method]") : null;
      if (methodButton) {
        setMethod(methodButton.getAttribute("data-method"), true);
        return;
      }
      var selected = target && target.closest ? target.closest("[data-group]") : null;
      if (selected) {
        var group = selected.getAttribute("data-group");
        var value = selected.getAttribute("data-value");
        values[group] = values[group] === value ? "" : value;
        Array.prototype.forEach.call(shadow.querySelectorAll('[data-group="' + group + '"]'), function (node) {
          node.setAttribute(
            "aria-checked",
            node === selected && values[group] ? "true" : "false",
          );
        });
        if (group === "service") {
          setError("service", "");
          refreshMeter();
        }
      }
    });

    shadow.addEventListener("keydown", function (event) {
      if (event.key !== "Tab") return;
      var list = focusable();
      if (!list.length) return;
      var first = list[0];
      var last = list[list.length - 1];
      if (event.shiftKey && shadow.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && shadow.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    });

    card.addEventListener("pointermove", function (event) {
      var rect = card.getBoundingClientRect();
      card.style.setProperty("--mx", ((event.clientX - rect.left) / rect.width) * 100 + "%");
      card.style.setProperty("--my", ((event.clientY - rect.top) / rect.height) * 100 + "%");
    });

    renderAttachment();
    setAttachOpen(false);
    renderGates(findCategory(fields.category.value));
    refreshMeter();

    if (inline && typeof ResizeObserver !== "undefined") {
      new ResizeObserver(notifyHeight).observe(card);
    }

    return {
      host: host,
      open: open,
      close: close,
      reset: reset,
      focus: function () {
        if (fields.name) fields.name.focus();
      },
    };
  }

  var modal = null;

  function ensureModal() {
    if (!modal) {
      modal = createSurface(false);
      document.body.appendChild(modal.host);
    }
    return modal;
  }

  function openModal(opts) {
    ensureModal().open(opts || {});
  }

  function mountInline(target) {
    var element = typeof target === "string" ? document.querySelector(target) : target;
    if (!element) return null;
    var surface = createSurface(true);
    element.appendChild(surface.host);
    return surface;
  }

  function boot() {
    if (config.mode === "inline") {
      var target = document.querySelector(config.target);
      if (!target && script && script.parentNode) target = script.parentNode;
      if (target) mountInline(target);
    }

    var shouldOpen = config.autoOpen || /[?&]dev-contact=open\b/.test(location.search);
    if (shouldOpen && config.mode !== "inline") openModal();
  }

  document.addEventListener("click", function (event) {
    var target = event.target;
    var trigger = target && target.closest ? target.closest("[data-dev-contact]") : null;
    if (!trigger) return;
    event.preventDefault();
    openModal({ source: trigger.getAttribute("data-dev-contact") || undefined });
  });

  window.DevContact = {
    version: "1.1.0",
    open: openModal,
    close: function () {
      if (modal) modal.close();
    },
    mount: mountInline,
    configure: function (next) {
      if (next) {
        Object.keys(next).forEach(function (key) {
          config[key] = next[key];
        });
      }
      return config;
    },
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
