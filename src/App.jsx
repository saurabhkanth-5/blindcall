import { useState, useEffect, useRef, useCallback } from "react";
import { SpeedInsights } from "@vercel/speed-insights/react";

/* ================================================================
   BLINDCALL — PORTFOLIO PROTOTYPE
   Built to demonstrate full-stack product thinking for job interviews.
   Every screen is interactive. Demo mode walks through automatically.
   Tech panel shows architecture depth.
================================================================ */

const STYLES = `
@import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&family=JetBrains+Mono:ital,wght@0,300;0,400;0,500;1,300&display=swap');
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}

:root {
  --bg:#060608;
  --s1:#0e0e12;
  --s2:#16161c;
  --s3:#1e1e26;
  --border:#ffffff0f;
  --border2:#ffffff18;
  --lime:#c8ff57;
  --cyan:#57d9ff;
  --pink:#ff57a8;
  --amber:#ffb957;
  --text:#efefef;
  --muted:#555;
  --muted2:#888;
  --r8:8px;--r12:12px;--r16:16px;--r24:24px;--r100:100px;
}

body{background:var(--bg);color:var(--text);font-family:'Space Grotesk',sans-serif;min-height:100vh;overflow-x:hidden}
.mono{font-family:'JetBrains Mono',monospace}

/* ── SCROLLBAR ── */
::-webkit-scrollbar{width:3px}::-webkit-scrollbar-thumb{background:var(--border2);border-radius:2px}

/* ── NOISE TEXTURE ── */
body::after{content:'';position:fixed;inset:0;pointer-events:none;z-index:9998;
  background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.03'/%3E%3C/svg%3E");opacity:.5}

/* ── LAYOUT ── */
.wrap{max-width:960px;margin:0 auto;padding:0 20px;width:100%}
.page{min-height:100vh;display:flex;flex-direction:column}

/* ── NAV ── */
.nav{padding:16px 0;border-bottom:1px solid var(--border);backdrop-filter:blur(20px);background:rgba(6,6,8,.9);position:sticky;top:0;z-index:200}
.nav-in{display:flex;align-items:center;justify-content:space-between}
.logo{font-size:17px;font-weight:700;letter-spacing:-0.3px;cursor:pointer}
.logo b{color:var(--lime)}
.nav-right{display:flex;align-items:center;gap:8px}

/* ── DEMO BANNER ── */
.demo-banner{background:linear-gradient(90deg,rgba(200,255,87,.08),rgba(87,217,255,.08));border-bottom:1px solid rgba(200,255,87,.15);padding:8px 0}
.demo-banner-in{display:flex;align-items:center;justify-content:space-between}
.demo-label{font-size:11px;font-family:'JetBrains Mono',monospace;color:var(--lime);letter-spacing:.06em}
.demo-progress{display:flex;gap:6px;align-items:center}
.demo-step{width:24px;height:3px;background:var(--border2);border-radius:2px;transition:background .4s}
.demo-step.done{background:var(--lime)}
.demo-step.active{background:var(--lime);box-shadow:0 0 8px var(--lime)}

/* ── BUTTONS ── */
.btn{display:inline-flex;align-items:center;gap:7px;padding:10px 20px;border-radius:var(--r8);font-weight:600;font-size:13px;cursor:pointer;transition:all .18s;border:none;font-family:'Space Grotesk',sans-serif;letter-spacing:.01em;white-space:nowrap}
.btn-lime{background:var(--lime);color:#060608}
.btn-lime:hover{background:#d8ff7a;box-shadow:0 6px 24px rgba(200,255,87,.3);transform:translateY(-1px)}
.btn-outline{background:transparent;color:var(--text);border:1px solid var(--border2)}
.btn-outline:hover{border-color:rgba(255,255,255,.3);background:var(--s2)}
.btn-ghost{background:transparent;color:var(--muted2);border:1px solid var(--border)}
.btn-ghost:hover{color:var(--text);border-color:var(--border2)}
.btn-pink{background:rgba(255,87,168,.12);color:var(--pink);border:1px solid rgba(255,87,168,.25)}
.btn-pink:hover{background:rgba(255,87,168,.2)}
.btn-lg{padding:14px 28px;font-size:15px;border-radius:var(--r12)}
.btn-sm{padding:7px 14px;font-size:12px;border-radius:6px}
.btn:disabled{opacity:.35;cursor:not-allowed;transform:none!important;box-shadow:none!important}

/* ── CARDS ── */
.card{background:var(--s1);border:1px solid var(--border);border-radius:var(--r16)}
.card-p{padding:20px}
.card-p-lg{padding:28px}

/* ── CHIPS / BADGES ── */
.chip{display:inline-flex;align-items:center;gap:5px;padding:3px 10px;border-radius:var(--r100);font-size:11px;font-family:'JetBrains Mono',monospace;letter-spacing:.04em}
.chip-lime{background:rgba(200,255,87,.1);color:var(--lime);border:1px solid rgba(200,255,87,.2)}
.chip-cyan{background:rgba(87,217,255,.1);color:var(--cyan);border:1px solid rgba(87,217,255,.2)}
.chip-pink{background:rgba(255,87,168,.1);color:var(--pink);border:1px solid rgba(255,87,168,.2)}
.chip-amber{background:rgba(255,185,87,.1);color:var(--amber);border:1px solid rgba(255,185,87,.2)}
.chip-muted{background:var(--s2);color:var(--muted2);border:1px solid var(--border)}
.dot{width:5px;height:5px;border-radius:50%;background:currentColor;display:inline-block}
.blink{animation:blink 1.6s ease infinite}
@keyframes blink{0%,100%{opacity:1}50%{opacity:.2}}

/* ── INPUTS ── */
.field{display:flex;flex-direction:column;gap:5px;width:100%}
.field-label{font-size:10px;color:var(--muted);font-family:'JetBrains Mono',monospace;letter-spacing:.08em;text-transform:uppercase}
.input{background:var(--s2);border:1px solid var(--border);border-radius:var(--r8);padding:11px 14px;color:var(--text);font-size:14px;font-family:'Space Grotesk',sans-serif;outline:none;transition:all .18s;width:100%}
.input:focus{border-color:var(--lime);box-shadow:0 0 0 3px rgba(200,255,87,.07)}
.input::placeholder{color:var(--muted)}

/* ── STEP DOTS ── */
.stepper{display:flex;align-items:center;gap:0;margin-bottom:36px}
.s-dot{width:26px;height:26px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:600;border:1px solid var(--border2);color:var(--muted);background:var(--s1);flex-shrink:0;transition:all .3s}
.s-dot.done{background:var(--lime);color:#060608;border-color:var(--lime)}
.s-dot.now{border-color:var(--lime);color:var(--lime);box-shadow:0 0 0 3px rgba(200,255,87,.1)}
.s-line{flex:1;height:1px;background:var(--border);margin:0 3px}
.s-line.done{background:var(--lime)}

/* ── HERO ── */
.hero{position:relative;overflow:hidden;padding:80px 0 60px}
.hero-glow{position:absolute;pointer-events:none;inset:0;
  background:radial-gradient(ellipse 70% 55% at 65% 35%,rgba(200,255,87,.045) 0%,transparent 65%),
             radial-gradient(ellipse 50% 40% at 25% 75%,rgba(87,217,255,.03) 0%,transparent 60%)}
.hero-dots{position:absolute;inset:0;opacity:.025;
  background-image:radial-gradient(circle,#fff 1px,transparent 1px);background-size:32px 32px}
.hero-tag{display:inline-flex;align-items:center;gap:8px;background:var(--s2);border:1px solid var(--border2);border-radius:var(--r100);padding:5px 14px 5px 7px;font-size:11px;font-family:'JetBrains Mono',monospace;color:var(--muted2);margin-bottom:28px;letter-spacing:.04em}
.hero-badge{background:var(--lime);color:#060608;border-radius:var(--r100);padding:2px 8px;font-size:10px;font-weight:700}
.hero-h{font-size:clamp(38px,6vw,68px);font-weight:700;letter-spacing:-2px;line-height:1.0;margin-bottom:22px}
.hero-h em{color:var(--lime);font-style:normal}
.hero-sub{font-size:16px;color:var(--muted2);line-height:1.7;max-width:460px;margin-bottom:36px}
.hero-acts{display:flex;gap:10px;flex-wrap:wrap;align-items:center}
.stat-row{display:flex;gap:32px;margin-top:52px;padding-top:32px;border-top:1px solid var(--border);flex-wrap:wrap}
.stat-item{display:flex;align-items:baseline;gap:7px}
.stat-n{font-size:22px;font-weight:700;color:var(--lime)}
.stat-l{font-size:11px;font-family:'JetBrains Mono',monospace;color:var(--muted)}

/* ── THEME GRID ── */
.tgrid{display:grid;grid-template-columns:repeat(auto-fill,minmax(168px,1fr));gap:10px}
.tcard{background:var(--s1);border:2px solid var(--border);border-radius:var(--r12);padding:18px;cursor:pointer;transition:all .2s;position:relative;overflow:hidden}
.tcard::before{content:'';position:absolute;inset:0;background:var(--lime);opacity:0;transition:.2s}
.tcard:hover{border-color:var(--border2);transform:translateY(-2px)}
.tcard:hover::before{opacity:.02}
.tcard.sel{border-color:var(--lime);background:rgba(200,255,87,.03)}
.tcard-icon{font-size:26px;margin-bottom:10px}
.tcard-name{font-size:13px;font-weight:700;margin-bottom:4px}
.tcard-desc{font-size:11px;color:var(--muted);line-height:1.45;font-family:'JetBrains Mono',monospace}
.tcard-cnt{font-size:10px;color:var(--lime);font-family:'JetBrains Mono',monospace;margin-top:10px}
.tcard-check{position:absolute;top:10px;right:10px;width:18px;height:18px;background:var(--lime);border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:9px;font-weight:900;color:#060608;opacity:0;transition:.2s}
.tcard.sel .tcard-check{opacity:1}

/* ── SLOTS ── */
.sgrid{display:grid;grid-template-columns:repeat(3,1fr);gap:8px}
.slot{background:var(--s2);border:1px solid var(--border);border-radius:var(--r8);padding:13px 10px;text-align:center;cursor:pointer;transition:all .18s}
.slot:hover:not(.sfull){border-color:var(--border2)}
.slot.ssel{border-color:var(--lime);background:rgba(200,255,87,.05)}
.slot.sfull{opacity:.4;cursor:not-allowed}
.slot-t{font-size:13px;font-weight:600;margin-bottom:3px}
.slot-c{font-size:10px;font-family:'JetBrains Mono',monospace;color:var(--muted)}

/* ── OTP ── */
.otp-row{display:flex;gap:8px;justify-content:center}
.otp-box{width:48px;height:56px;background:var(--s2);border:1px solid var(--border);border-radius:var(--r8);text-align:center;font-size:22px;font-weight:700;color:var(--text);outline:none;font-family:'JetBrains Mono',monospace;transition:all .18s}
.otp-box:focus{border-color:var(--lime);box-shadow:0 0 0 3px rgba(200,255,87,.08)}

/* ── CONSENT ── */
.citem{display:flex;gap:12px;padding:13px 15px;background:var(--s2);border:1px solid var(--border);border-radius:var(--r8);cursor:pointer;transition:.18s;align-items:flex-start}
.citem:hover{border-color:var(--border2)}
.cbox{width:18px;height:18px;border-radius:4px;border:1px solid var(--border2);background:var(--s1);flex-shrink:0;display:flex;align-items:center;justify-content:center;margin-top:1px;transition:.18s}
.cbox.on{background:var(--lime);border-color:var(--lime)}
.ctitle{font-size:13px;font-weight:600;margin-bottom:2px}
.cdesc{font-size:11px;color:var(--muted);line-height:1.45}

/* ── WAITING ── */
.wait-center{min-height:70vh;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:28px;text-align:center}
.ring-wrap{width:110px;height:110px;position:relative;display:flex;align-items:center;justify-content:center}
.ring{position:absolute;inset:0;border-radius:50%;border:1.5px solid rgba(200,255,87,.25);animation:ring-expand 2.2s ease-out infinite}
.ring:nth-child(2){animation-delay:.7s}
.ring:nth-child(3){animation-delay:1.4s}
@keyframes ring-expand{0%{transform:scale(.85);opacity:.9}100%{transform:scale(1.5);opacity:0}}
.ring-icon{font-size:36px;position:relative;z-index:1}
.wait-h{font-size:26px;font-weight:700;letter-spacing:-.5px}
.wait-sub{font-size:13px;font-family:'JetBrains Mono',monospace;color:var(--muted)}
.log-box{background:var(--s1);border:1px solid var(--border);border-radius:var(--r12);padding:16px 18px;width:100%;max-width:380px;text-align:left}
.log-line{font-size:11px;font-family:'JetBrains Mono',monospace;color:var(--muted2);line-height:2.0}
.log-line.active{color:var(--lime)}

/* ── CALL ACTIVE ── */
.call-stage{min-height:72vh;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:28px}
.timer{font-size:64px;font-weight:700;font-family:'JetBrains Mono',monospace;color:var(--lime);letter-spacing:-3px;line-height:1}
.timer.low{color:var(--pink);animation:pulse-timer .5s ease infinite}
@keyframes pulse-timer{0%,100%{opacity:1}50%{opacity:.5}}
.call-status-row{font-size:12px;font-family:'JetBrains Mono',monospace;color:var(--muted);margin-top:4px}
.users-row{display:flex;align-items:center;gap:32px}
.usr{display:flex;flex-direction:column;align-items:center;gap:10px}
.usr-av{width:72px;height:72px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:28px;position:relative}
.usr-av.you{background:rgba(200,255,87,.1);border:2px solid rgba(200,255,87,.35)}
.usr-av.them{background:rgba(87,217,255,.1);border:2px solid rgba(87,217,255,.35)}
.usr-name{font-size:12px;font-weight:600}
.usr-speaking{font-size:9px;font-family:'JetBrains Mono',monospace;color:var(--lime);letter-spacing:.06em}
.bridge{width:64px;display:flex;flex-direction:column;align-items:center;gap:4px}
.bridge-line{width:100%;height:1.5px;background:linear-gradient(90deg,rgba(200,255,87,.4),rgba(87,217,255,.4));position:relative;overflow:hidden}
.bridge-line::after{content:'';position:absolute;top:0;left:-30%;width:30%;height:100%;background:linear-gradient(90deg,transparent,rgba(255,255,255,.5),transparent);animation:sweep 1.5s linear infinite}
@keyframes sweep{to{left:130%}}
.wave{display:flex;gap:2.5px;align-items:center;height:28px}
.wbar{width:2.5px;background:var(--lime);border-radius:2px;animation:wave .7s ease-in-out infinite}
@keyframes wave{0%,100%{height:3px}50%{height:22px}}
.prompt-card{background:rgba(87,217,255,.05);border:1px solid rgba(87,217,255,.2);border-radius:var(--r12);padding:18px 24px;max-width:480px;text-align:center;width:100%}
.prompt-lbl{font-size:9px;font-family:'JetBrains Mono',monospace;color:var(--cyan);letter-spacing:.1em;margin-bottom:8px}
.prompt-txt{font-size:15px;font-weight:500;line-height:1.55;color:#ddd}
.call-controls{display:flex;gap:10px}

/* ── POST CALL ── */
.post-hero{text-align:center;padding:40px 0 28px}
.ring-score{width:110px;height:110px;position:relative;margin:0 auto 20px}
.ring-score svg{transform:rotate(-90deg)}
.ring-score-inner{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center}
.score-n{font-size:26px;font-weight:700;color:var(--lime)}
.score-lbl{font-size:9px;font-family:'JetBrains Mono',monospace;color:var(--muted)}

/* ── TABS ── */
.tabs{display:flex;background:var(--s2);border-radius:var(--r8);padding:3px;gap:3px;margin-bottom:20px}
.tab{flex:1;padding:8px;border-radius:6px;text-align:center;cursor:pointer;font-size:13px;font-weight:600;color:var(--muted2);transition:.18s;background:none;border:none;font-family:'Space Grotesk',sans-serif}
.tab.on{background:var(--s1);color:var(--text);box-shadow:0 1px 6px rgba(0,0,0,.4)}

/* ── TRANSCRIPT ── */
.tx{background:var(--s1);border:1px solid var(--border);border-radius:var(--r12);padding:20px;max-height:280px;overflow-y:auto}
.tx-row{display:flex;gap:12px;margin-bottom:14px}
.tx-who{font-size:10px;font-family:'JetBrains Mono',monospace;color:var(--lime);width:54px;flex-shrink:0;padding-top:2px;letter-spacing:.05em}
.tx-text{font-size:13px;color:#ccc;line-height:1.65}

/* ── BAR CHART ── */
.bars{display:flex;flex-direction:column;gap:9px}
.bar-r{display:flex;align-items:center;gap:9px}
.bar-lbl{font-size:10px;font-family:'JetBrains Mono',monospace;color:var(--muted);width:90px;flex-shrink:0}
.bar-track{flex:1;height:5px;background:var(--s3);border-radius:100px;overflow:hidden}
.bar-fill{height:100%;border-radius:100px;transition:width 1.2s ease}
.bar-val{font-size:10px;font-family:'JetBrains Mono',monospace;color:var(--muted2);width:32px;text-align:right}

/* ── ANALYTICS ── */
.mgrid{display:grid;grid-template-columns:repeat(auto-fill,minmax(200px,1fr));gap:12px}
.mcard{background:var(--s1);border:1px solid var(--border);border-radius:var(--r12);padding:18px}
.m-lbl{font-size:10px;font-family:'JetBrains Mono',monospace;color:var(--muted);letter-spacing:.06em;margin-bottom:8px}
.m-val{font-size:32px;font-weight:700;letter-spacing:-1px;line-height:1}
.m-sub{font-size:11px;color:var(--muted);margin-top:4px}

/* ── DATA TABLE ── */
.dtable{width:100%;border-collapse:collapse}
.dtable th{text-align:left;padding:9px 14px;font-size:9px;font-family:'JetBrains Mono',monospace;color:var(--muted);letter-spacing:.07em;border-bottom:1px solid var(--border);font-weight:400}
.dtable td{padding:11px 14px;font-size:12px;border-bottom:1px solid rgba(255,255,255,.03)}
.dtable tr:hover td{background:rgba(255,255,255,.015)}

/* ── TECH PANEL ── */
.tech-panel{background:var(--s1);border:1px solid rgba(200,255,87,.15);border-radius:var(--r16);overflow:hidden}
.tech-header{background:linear-gradient(90deg,rgba(200,255,87,.06),transparent);padding:16px 20px;border-bottom:1px solid var(--border);display:flex;align-items:center;justify-content:space-between}
.tech-title{font-size:13px;font-weight:700;color:var(--lime)}
.tech-body{padding:20px}
.arch-row{display:flex;gap:0;margin-bottom:0}
.arch-line{display:flex;flex-direction:column;align-items:center;width:32px;flex-shrink:0}
.arch-dot{width:10px;height:10px;border-radius:50%;flex-shrink:0;margin-top:16px}
.arch-vert{flex:1;width:1.5px;background:var(--border);min-height:16px}
.arch-card{flex:1;margin-left:14px;margin-bottom:12px;background:var(--s2);border:1px solid var(--border);border-radius:var(--r8);padding:12px 16px}
.arch-mod{font-size:12px;font-weight:700;margin-bottom:2px}
.arch-tech{display:flex;gap:6px;flex-wrap:wrap;margin-top:6px}
.arch-chip{font-size:9px;font-family:'JetBrains Mono',monospace;padding:2px 7px;background:var(--s1);border:1px solid var(--border);border-radius:4px;color:var(--muted2)}
.arch-desc{font-size:11px;color:var(--muted);line-height:1.4}
.code-block{background:#0a0a0e;border:1px solid var(--border);border-radius:var(--r8);padding:14px 16px;font-family:'JetBrains Mono',monospace;font-size:11px;color:#aaa;line-height:1.8;overflow-x:auto;margin-top:10px}
.code-block .kw{color:var(--cyan)}
.code-block .str{color:var(--lime)}
.code-block .cm{color:var(--muted)}
.code-block .fn{color:var(--amber)}

/* ── SECTION ── */
.sec{padding:44px 0}
.sec-lbl{font-size:10px;font-family:'JetBrains Mono',monospace;color:var(--muted);letter-spacing:.1em;text-transform:uppercase;margin-bottom:10px}
.sec-h{font-size:28px;font-weight:700;letter-spacing:-.5px;line-height:1.15;margin-bottom:8px}
.sec-sub{font-size:14px;color:var(--muted2);line-height:1.65;margin-bottom:28px}
.divider{height:1px;background:var(--border);margin:20px 0}

/* ── UTIL ── */
.flex{display:flex}.fc{display:flex;align-items:center}.fb{display:flex;align-items:center;justify-content:space-between}.col{display:flex;flex-direction:column}
.g4{gap:4px}.g8{gap:8px}.g12{gap:12px}.g16{gap:16px}.g20{gap:20px}.g24{gap:24px}
.mb4{margin-bottom:4px}.mb8{margin-bottom:8px}.mb12{margin-bottom:12px}.mb16{margin-bottom:16px}.mb20{margin-bottom:20px}.mb24{margin-bottom:24px}.mb32{margin-bottom:32px}
.w100{width:100%}.tc{text-align:center}.tr{text-align:right}
.txt-muted{color:var(--muted2)}.txt-lime{color:var(--lime)}.txt-cyan{color:var(--cyan)}
.txt-sm{font-size:13px}.txt-xs{font-size:11px}.txt-xxs{font-size:10px}
.g2col{display:grid;grid-template-columns:1fr 1fr;gap:14px}

/* ── ANIMATIONS ── */
@keyframes fade-up{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:none}}
.fade-up{animation:fade-up .35s ease both}
@keyframes fade-in{from{opacity:0}to{opacity:1}}
.fade-in{animation:fade-in .3s ease both}

/* ── RATING STARS ── */
.stars{display:flex;gap:6px;font-size:28px;cursor:pointer}
.star{transition:.1s;opacity:.25}
.star.on{opacity:1}

/* ── RESPONSIVE ── */
@media(max-width:600px){
  .hero-h{font-size:36px;letter-spacing:-1px}
  .tgrid{grid-template-columns:repeat(2,1fr)}
  .sgrid{grid-template-columns:repeat(2,1fr)}
  .g2col{grid-template-columns:1fr}
  .mgrid{grid-template-columns:repeat(2,1fr)}
  .stat-row{gap:18px}
}
`;

// ─── CONSTANTS ───────────────────────────────────────────────
const THEMES = [
  {id:"founder",icon:"🚀",name:"Founder Mode",desc:"Pitch, iterate, build",count:"42 online"},
  {id:"student",icon:"📚",name:"Student Builders",desc:"Learn, hack, grow",count:"89 online"},
  {id:"opposite",icon:"⚡",name:"Opposite Worlds",desc:"Talk to your inverse",count:"31 online"},
  {id:"radical",icon:"🔥",name:"Radical Honesty",desc:"No filters. Signal only.",count:"18 online"},
  {id:"pitch",icon:"💰",name:"Startup Pitch",desc:"60-sec pitch → feedback",count:"27 online"},
  {id:"creative",icon:"🎨",name:"Creative Lab",desc:"Artists & writers",count:"54 online"},
];
const SLOTS=[
  {t:"7:00 PM",c:"12 waiting",full:false},{t:"7:20 PM",c:"8 waiting",full:false},
  {t:"7:40 PM",c:"21 waiting",full:false},{t:"8:00 PM",c:"Full (32/32)",full:true},
  {t:"8:20 PM",c:"5 waiting",full:false},{t:"8:40 PM",c:"3 waiting",full:false},
];
const PROMPTS={
  founder:"You have 90 seconds. Tell me the one thing you wish you'd known before starting.",
  student:"What's the most important lesson this semester — academic or not?",
  opposite:"Describe your world in 3 sentences. What do you assume about mine?",
  radical:"Say the thing you usually keep to yourself in professional conversations.",
  pitch:"You have 60 seconds. Pitch your idea like you're talking to your last investor.",
  creative:"Share a creative project you abandoned — and why you stopped.",
};
const TRANSCRIPT=[
  {who:"YOU",t:"I've been building in stealth for eight months. Completely bootstrapped. It's been a lot."},
  {who:"MATCH",t:"I feel that. What's the hardest part? Everyone says fundraising but I think it's the loneliness."},
  {who:"YOU",t:"Exactly. My co-founder left at month three. So it's just me and a part-time designer now."},
  {who:"MATCH",t:"How are you keeping yourself accountable without someone to answer to?"},
  {who:"YOU",t:"Weekly calls with two other solo founders. We're brutal with each other. No comfort zones."},
  {who:"MATCH",t:"That's the model right there. I've been trying to find that. Where did you meet them?"},
  {who:"YOU",t:"Here, actually. First call I had on this platform. Ended up exchanging numbers."},
];
const INSIGHTS={
  score:87,
  summary:"High-quality founder conversation. Both parties showed vulnerability around isolation, correlating with trust signals in the latter half. Strong mutual resonance on accountability infrastructure.",
  traits:["Analytical","Vulnerable","Growth-oriented","Collaborative"],
  emotion:{curiosity:72,trust:68,enthusiasm:61,anxiety:34},
  talkRatio:{you:47,match:53},
  followUp:"Ask specifically about their accountability system — that's where the real value exchange is.",
  moments:["Vulnerability at 1:23 — co-founder departure","Trust spike at 3:45 — shared experience","Peak engagement at 5:12 — accountability discussion"],
};
const RESEARCH=[
  {id:"#0847",theme:"Founder Mode",dur:"7:12",ok:true,score:87,date:"Today 7:43PM"},
  {id:"#0846",theme:"Radical Honesty",dur:"6:55",ok:true,score:79,date:"Today 7:31PM"},
  {id:"#0845",theme:"Opposite Worlds",dur:"4:22",ok:false,score:41,date:"Today 7:15PM"},
  {id:"#0844",theme:"Student Builders",dur:"7:00",ok:true,score:92,date:"Today 7:02PM"},
  {id:"#0843",theme:"Startup Pitch",dur:"7:00",ok:true,score:85,date:"Today 6:51PM"},
];

// ─── DEMO STEPS: each step maps to a screen ──────────────────
const DEMO_STEPS = ["landing","auth","matching","waiting","call","postcall","analytics"];

// ─── STEPPER ───────────────��─────────────────────���───────────
function Stepper({current,total}){
  return(
    <div className="stepper">
      {Array.from({length:total}).map((_,i)=>(
        <div key={i} className="flex" style={{flex:i<total-1?1:'none',alignItems:'center'}}>
          <div className={`s-dot ${i<current?'done':i===current?'now':''}`}>
            {i<current?'✓':i+1}
          </div>
          {i<total-1&&<div className={`s-line ${i<current?'done':''}`}/>}
        </div>
      ))}
    </div>
  );
}

// ─── AUTH ─────────────────────────────────────────────────────
function Auth({onDone}){
  const [step,setStep]=useState(0);
  const [phone,setPhone]=useState("");
  const [otp,setOtp]=useState(["","","","","",""]);
  const [consents,setConsents]=useState({rec:false,rules:false,age:false});
  const [loading,setLoading]=useState(false);
  const allConsented=Object.values(consents).every(Boolean);

  const handleOtp=(i,v)=>{
    const n=[...otp];n[i]=v.slice(-1);setOtp(n);
    if(v&&i<5)document.getElementById(`o${i+1}`)?.focus();
  };
  const next=(delay=1000)=>{setLoading(true);setTimeout(()=>{setLoading(false);setStep(s=>s+1)},delay)};

  return(
    <div className="sec fade-up" style={{maxWidth:460,margin:'0 auto'}}>
      <Stepper current={step} total={3}/>
      {step===0&&(
        <div className="fade-up">
          <div className="sec-lbl">Auth Module · Step 1 / 3</div>
          <div className="sec-h mb8">Your phone number</div>
          <p className="sec-sub">No profile. No photo. Just your voice.</p>
          <div className="field mb16">
            <div className="field-label">MOBILE NUMBER</div>
            <input className="input mono" placeholder="+1 (555) 000-0000" value={phone} onChange={e=>setPhone(e.target.value)} style={{fontSize:17,letterSpacing:'.04em'}}/>
          </div>
          <p className="txt-xs txt-muted mb20" style={{lineHeight:1.65}}>
            A 6-digit OTP is sent via SMS — Twilio Verify API in production.<br/>
            Your number is never shown to other users.
          </p>
          <button className="btn btn-lime btn-lg w100" onClick={()=>next(1100)} disabled={phone.length<7||loading}>
            {loading?"Sending OTP…":"Send Verification Code →"}
          </button>
        </div>
      )}
      {step===1&&(
        <div className="fade-up">
          <div className="sec-lbl">Auth Module · Step 2 / 3</div>
          <div className="sec-h mb8">Enter the code</div>
          <p className="sec-sub">Sent to {phone||"+1 (555) 000-0000"}.</p>
          <div className="otp-row mb24">
            {otp.map((d,i)=>(
              <input key={i} id={`o${i}`} className="otp-box" value={d}
                onChange={e=>handleOtp(i,e.target.value)} maxLength={1}/>
            ))}
          </div>
          <button className="btn btn-lime btn-lg w100" onClick={()=>next(900)} disabled={otp.join('').length<6||loading}>
            {loading?"Verifying…":"Confirm & Continue →"}
          </button>
          <button className="btn btn-ghost btn-sm w100" style={{marginTop:8}} onClick={()=>setStep(0)}>← Back</button>
        </div>
      )}
      {step===2&&(
        <div className="fade-up">
          <div className="sec-lbl">Auth Module · Step 3 / 3</div>
          <div className="sec-h mb8">Before you join</div>
          <p className="sec-sub">Three acknowledgements — required.</p>
          <div className="col g8 mb28">
            {[
              {k:'rec',t:'Recording Consent',d:'All calls are recorded and stored on AWS S3. Audio is processed by Whisper for transcription within 24 hours.'},
              {k:'rules',t:'Community Rules',d:'No harassment or threats. Violations result in immediate ban. Use the in-call flag button to report issues.'},
              {k:'age',t:'Age Confirmation (18+)',d:'I confirm I am 18 or older and understand this platform connects me with strangers via anonymous voice calls.'},
            ].map(c=>(
              <div key={c.k} className="citem" onClick={()=>setConsents(p=>({...p,[c.k]:!p[c.k]}))}>
                <div className={`cbox ${consents[c.k]?'on':''}`}>
                  {consents[c.k]&&<span style={{fontSize:10,color:'#060608',fontWeight:900}}>✓</span>}
                </div>
                <div><div className="ctitle">{c.t}</div><div className="cdesc">{c.d}</div></div>
              </div>
            ))}
          </div>
          <button className="btn btn-lime btn-lg w100" onClick={onDone} disabled={!allConsented}>
            I Agree — Enter Platform →
          </button>
        </div>
      )}
    </div>
  );
}

// ─── MATCHING ─────────────────────────────────────────────────
function Matching({onJoin}){
  const [theme,setTheme]=useState(null);
  const [slot,setSlot]=useState(null);
  const [step,setStep]=useState(0);

  return(
    <div className="sec fade-up">
      <Stepper current={step} total={2}/>
      {step===0&&(
        <div className="fade-up">
          <div className="sec-lbl">Matching Module · Theme</div>
          <div className="sec-h mb8">Choose your context</div>
          <p className="sec-sub">Matched within theme. Different backgrounds. Same conversation space.</p>
          <div className="tgrid mb28">
            {THEMES.map(t=>(
              <div key={t.id} className={`tcard ${theme?.id===t.id?'sel':''}`} onClick={()=>setTheme(t)}>
                <div className="tcard-check">✓</div>
                <div className="tcard-icon">{t.icon}</div>
                <div className="tcard-name">{t.name}</div>
                <div className="tcard-desc">{t.desc}</div>
                <div className="tcard-cnt">{t.count}</div>
              </div>
            ))}
          </div>
          <button className="btn btn-lime btn-lg" onClick={()=>setStep(1)} disabled={!theme}>
            Pick Session Window →
          </button>
        </div>
      )}
      {step===1&&(
        <div className="fade-up">
          <div className="sec-lbl">Matching Module · Session Window</div>
          <div className="sec-h mb8">Pick your slot</div>
          <p className="sec-sub mb12">Fixed windows prevent cold starts — everyone matched at window open.</p>
          <div className="fc g8 mb24">
            <span className="chip chip-lime"><span className="dot blink"/>THEME: {theme?.name?.toUpperCase()}</span>
          </div>
          <div className="sgrid mb28">
            {SLOTS.map((s,i)=>(
              <div key={i} className={`slot ${slot===i?'ssel':''} ${s.full?'sfull':''}`} onClick={()=>!s.full&&setSlot(i)}>
                <div className="slot-t">{s.t}</div>
                <div className="slot-c">{s.c}</div>
              </div>
            ))}
          </div>
          <div className="flex g10">
            <button className="btn btn-ghost" onClick={()=>setStep(0)}>← Back</button>
            <button className="btn btn-lime btn-lg" onClick={()=>onJoin(theme)} disabled={slot===null}>
              Join Waiting Room →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── WAITING ROOM ─────────────────────────────────────────────
function WaitingRoom({theme,onMatch}){
  const [secs,setSecs]=useState(0);
  const [logs,setLogs]=useState([
    {t:"✓ User authenticated via Twilio Verify",done:true},
    {t:`✓ Theme selected: ${theme?.name}`,done:true},
    {t:"✓ Conference room pre-warmed (Twilio)",done:true},
    {t:"→ Scanning matching pool…",done:false},
  ]);

  useEffect(()=>{
    const t=setInterval(()=>setSecs(p=>p+1),1000);
    const addLog=setTimeout(()=>{
      setLogs(p=>[...p,{t:"✓ Match found — triggering outbound calls",done:true}]);
      setTimeout(onMatch,1800);
    },7000);
    return()=>{clearInterval(t);clearTimeout(addLog)};
  },[]);

  return(
    <div className="sec fade-up">
      <div className="wait-center">
        <div className="ring-wrap">
          <div className="ring"/><div className="ring"/><div className="ring"/>
          <div className="ring-icon">🎙</div>
        </div>
        <div>
          <div className="wait-h mb8">Finding your match…</div>
          <div className="wait-sub">Pairing within {theme?.name} · Different story, same room</div>
        </div>
        <div className="flex g24">
          {[{n:secs+'s',l:'WAITING'},{n:'24',l:'IN POOL'},{n:'~8s',l:'AVG WAIT'}].map(s=>(
            <div key={s.l} className="tc">
              <div style={{fontSize:22,fontWeight:700,color:'var(--lime)'}}>{s.n}</div>
              <div className="txt-xxs mono txt-muted" style={{marginTop:3}}>{s.l}</div>
            </div>
          ))}
        </div>
        <div className="log-box">
          <div className="txt-xxs mono txt-muted mb8" style={{letterSpacing:'.06em'}}>SYSTEM LOG</div>
          {logs.map((l,i)=>(
            <div key={i} className={`log-line ${!l.done?'active':''}`}>{l.t}</div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── ACTIVE CALL ──────────────────────────────────────────────
function ActiveCall({theme,onEnd}){
  const [phase,setPhase]=useState('prompt'); // prompt, active, ending
  const [timeLeft,setTimeLeft]=useState(420);
  const timerRef=useRef(null);

  useEffect(()=>{
    const t=setTimeout(()=>{
      setPhase('active');
      timerRef.current=setInterval(()=>{
        setTimeLeft(p=>{
          if(p<=1){clearInterval(timerRef.current);setPhase('ending');setTimeout(onEnd,2000);return 0;}
          return p-1;
        });
      },1000);
    },5000);
    return()=>{clearTimeout(t);clearInterval(timerRef.current)};
  },[]);

  const fmt=s=>`${String(Math.floor(s/60)).padStart(2,'0')}:${String(s%60).padStart(2,'0')}`;
  const endNow=()=>{clearInterval(timerRef.current);setPhase('ending');setTimeout(onEnd,1500)};

  if(phase==='prompt') return(
    <div className="sec fade-up">
      <div className="call-stage">
        <div className="ring-wrap">
          <div className="ring" style={{borderColor:'rgba(87,217,255,.3)'}}/> 
          <div className="ring" style={{borderColor:'rgba(87,217,255,.15)',animationDelay:'.7s'}}/>
          <div className="ring-icon">🤖</div>
        </div>
        <div className="tc">
          <div style={{fontSize:22,fontWeight:700,color:'var(--cyan)',marginBottom:6}}>Match found.</div>
          <div className="wait-sub">AI is speaking now…</div>
        </div>
        <div className="prompt-card">
          <div className="prompt-lbl">AI VOICE PROMPT — {theme?.name?.toUpperCase()}</div>
          <div className="prompt-txt">"{PROMPTS[theme?.id]||PROMPTS.founder}"</div>
        </div>
        <div className="wave">
          {Array.from({length:18}).map((_,i)=>(
            <div key={i} className="wbar" style={{animationDelay:`${i*.055}s`,background:'var(--cyan)',height:'3px'}}/>
          ))}
        </div>
      </div>
    </div>
  );

  if(phase==='ending') return(
    <div className="sec fade-up">
      <div className="call-stage">
        <div style={{fontSize:56}}>✓</div>
        <div className="wait-h">Call complete.</div>
        <div className="wait-sub mono">Uploading to S3 → Whisper transcription → LLM analysis</div>
        <div className="wave">
          {Array.from({length:14}).map((_,i)=>(
            <div key={i} className="wbar" style={{animationDelay:`${i*.08}s`,background:'var(--lime)'}}/>
          ))}
        </div>
      </div>
    </div>
  );

  return(
    <div className="sec fade-up">
      <div className="call-stage">
        <div className="tc">
          <div className={`timer ${timeLeft<60?'low':''}`}>{fmt(timeLeft)}</div>
          <div className="call-status-row">
            <span style={{color:'var(--pink)'}}>● REC</span>&nbsp;·&nbsp;Auto-ends at 0:00
          </div>
        </div>

        <div className="users-row">
          <div className="usr">
            <div className="usr-av you">🎙</div>
            <div className="usr-name">You</div>
            <div className="wave" style={{height:20}}>
              {Array.from({length:5}).map((_,i)=>(
                <div key={i} className="wbar" style={{animationDelay:`${i*.13}s`,width:'2px'}}/>
              ))}
            </div>
          </div>
          <div className="bridge">
            <div className="bridge-line"/>
            <div className="txt-xxs mono txt-muted" style={{marginTop:4}}>BRIDGE</div>
          </div>
          <div className="usr">
            <div className="usr-av them">👤</div>
            <div className="usr-name">Anonymous</div>
            <div className="usr-speaking blink">SPEAKING</div>
          </div>
        </div>

        <div className="prompt-card" style={{maxWidth:400}}>
          <div className="prompt-lbl">ACTIVE PROMPT</div>
          <div className="prompt-txt" style={{fontSize:13}}>"{PROMPTS[theme?.id]||PROMPTS.founder}"</div>
        </div>

        <div className="call-controls">
          <button className="btn btn-ghost btn-sm">🔇 Mute</button>
          <button className="btn btn-pink" onClick={endNow}>End Call</button>
          <button className="btn btn-ghost btn-sm">🚩 Report</button>
        </div>
      </div>
    </div>
  );
}

// ─── POST CALL ────────────────────────────────────────────────
function PostCall({theme,onDone}){
  const [tab,setTab]=useState('insights');
  const [rating,setRating]=useState(0);
  const [linkedin,setLinkedin]=useState(false);
  const ins=INSIGHTS;
  const R=52,C=2*Math.PI*R,offset=C-(ins.score/100)*C;

  return(
    <div className="sec fade-up">
      <div className="post-hero">
        <div className="chip chip-lime mb16"><span className="dot"/>CALL COMPLETE — AI PROCESSING DONE</div>
        <div className="sec-h mb8">Your conversation, analyzed.</div>
        <p className="txt-sm txt-muted mb24">{theme?.name} · 7:12 · Whisper transcription complete</p>
        <div className="ring-score">
          <svg viewBox="0 0 120 120" width="110" height="110">
            <circle cx="60" cy="60" r={R} fill="none" stroke="var(--s3)" strokeWidth="9"/>
            <circle cx="60" cy="60" r={R} fill="none" stroke="var(--lime)" strokeWidth="9"
              strokeDasharray={C} strokeDashoffset={offset} strokeLinecap="round"
              style={{transition:'stroke-dashoffset 1.4s ease'}}/>
          </svg>
          <div className="ring-score-inner">
            <div className="score-n">{ins.score}</div>
            <div className="score-lbl">QUALITY</div>
          </div>
        </div>
      </div>

      <div className="tabs">
        {[['insights','Insights'],['transcript','Transcript'],['traits','Traits'],['feedback','Feedback']].map(([v,l])=>(
          <button key={v} className={`tab ${tab===v?'on':''}`} onClick={()=>setTab(v)}>{l}</button>
        ))}
      </div>

      {tab==='insights'&&(
        <div className="fade-up col g16">
          <div className="card card-p">
            <div className="sec-lbl mb8">AI SUMMARY — GPT-4o / CLAUDE 3.5</div>
            <p style={{fontSize:14,lineHeight:1.75,color:'#ccc'}}>{ins.summary}</p>
          </div>
          <div className="g2col">
            <div className="card card-p">
              <div className="sec-lbl mb12">EMOTIONAL TONE</div>
              <div className="bars">
                {Object.entries(ins.emotion).map(([k,v])=>(
                  <div key={k} className="bar-r">
                    <div className="bar-lbl">{k}</div>
                    <div className="bar-track"><div className="bar-fill" style={{width:`${v}%`,background:'var(--lime)'}}/></div>
                    <div className="bar-val">{v}%</div>
                  </div>
                ))}
              </div>
            </div>
            <div className="card card-p">
              <div className="sec-lbl mb12">TALK DISTRIBUTION</div>
              {[{l:'YOU',v:ins.talkRatio.you,c:'var(--lime)'},{l:'MATCH',v:ins.talkRatio.match,c:'var(--cyan)'}].map(r=>(
                <div key={r.l} className="mb12">
                  <div className="fb mb4"><span className="txt-xs txt-muted">{r.l}</span><span className="mono txt-xs" style={{color:r.c}}>{r.v}%</span></div>
                  <div className="bar-track" style={{height:7}}><div className="bar-fill" style={{width:`${r.v}%`,background:r.c}}/></div>
                </div>
              ))}
              <div className="divider"/>
              <div className="sec-lbl mb6">SUGGESTED NEXT</div>
              <p className="txt-xs txt-muted" style={{lineHeight:1.6,fontStyle:'italic'}}>"{ins.followUp}"</p>
            </div>
          </div>
          <div className="card card-p">
            <div className="sec-lbl mb12">KEY MOMENTS</div>
            <div className="col g8">
              {ins.moments.map((m,i)=>(
                <div key={i} className="fc g12">
                  <span className="chip chip-lime mono">{String(i+1).padStart(2,'0')}</span>
                  <span className="txt-sm" style={{color:'#ccc'}}>{m}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {tab==='transcript'&&(
        <div className="fade-up col g16">
          <div className="fb mb4">
            <div className="sec-lbl">WHISPER TRANSCRIPTION</div>
            <div className="chip chip-lime">95.3% accuracy</div>
          </div>
          <div className="tx">
            {TRANSCRIPT.map((l,i)=>(
              <div key={i} className="tx-row">
                <div className="tx-who">{l.who}</div>
                <div className="tx-text">{l.t}</div>
              </div>
            ))}
          </div>
          <div className="card card-p">
            <div className="sec-lbl mb6">MODERATION STATUS</div>
            <div className="fc g8">
              <span className="chip chip-lime"><span className="dot"/>CLEAN</span>
              <span className="mono txt-xs txt-muted">Toxicity: 0.02 · No flags · Passed all filters</span>
            </div>
          </div>
        </div>
      )}

      {tab==='traits'&&(
        <div className="fade-up col g16">
          <div className="sec-lbl mb8">INFERRED PERSONALITY TRAITS</div>
          <div className="flex" style={{flexWrap:'wrap',gap:8,marginBottom:8}}>
            {ins.traits.map(t=>(
              <div key={t} style={{background:'var(--s2)',border:'1px solid var(--border)',borderRadius:'var(--r8)',padding:'8px 14px',fontSize:13,display:'flex',gap:6,alignItems:'center'}}>
                <span style={{color:'var(--lime)'}}>✦</span>{t}
              </div>
            ))}
          </div>
          <div className="card card-p">
            <div className="sec-lbl mb12">COMMUNICATION STYLE</div>
            <div className="bars">
              {[['Vulnerability',78,'var(--lime)'],['Directness',82,'var(--cyan)'],['Curiosity',91,'var(--lime)'],['Empathy',67,'var(--amber)'],['Humor',38,'var(--pink)']].map(([l,v,c])=>(
                <div key={l} className="bar-r">
                  <div className="bar-lbl">{l}</div>
                  <div className="bar-track"><div className="bar-fill" style={{width:`${v}%`,background:c}}/></div>
                  <div className="bar-val">{v}%</div>
                </div>
              ))}
            </div>
          </div>
          <div className="card card-p" style={{borderColor:'rgba(200,255,87,.15)'}}>
            <div className="sec-lbl mb6">RESEARCH NOTE</div>
            <p className="txt-sm" style={{color:'#aaa',lineHeight:1.7}}>High vulnerability + high curiosity pairing correlates with 2.3× higher call completion and 1.8× repeat participation. This contributes to the behavioral research dataset.</p>
          </div>
        </div>
      )}

      {tab==='feedback'&&(
        <div className="fade-up col g16">
          <div className="card card-p">
            <div className="sec-lbl mb12">RATE YOUR EXPERIENCE</div>
            <div className="stars mb20">
              {[1,2,3,4,5].map(s=>(
                <span key={s} className={`star ${s<=rating?'on':''}`} onClick={()=>setRating(s)}>★</span>
              ))}
            </div>
            <div className="field mb16">
              <div className="field-label">QUICK FEEDBACK (OPTIONAL)</div>
              <textarea className="input" rows={3} placeholder="What made this call valuable or not?" style={{resize:'none'}}/>
            </div>
            <div className={`citem ${linkedin?'':''}`} style={{borderColor:linkedin?'var(--lime)':''}} onClick={()=>setLinkedin(!linkedin)}>
              <div className={`cbox ${linkedin?'on':''}`}>
                {linkedin&&<span style={{fontSize:10,color:'#060608',fontWeight:900}}>✓</span>}
              </div>
              <div><div className="ctitle">🔗 Connect on LinkedIn</div><div className="cdesc">If your match also opts in, we'll share profiles mutually.</div></div>
            </div>
          </div>
          <button className="btn btn-lime btn-lg w100" onClick={onDone} disabled={rating===0}>
            Submit & See My Analytics →
          </button>
        </div>
      )}
    </div>
  );
}

// ─── ANALYTICS ────────────────────────────────────────────────
function Analytics(){
  const [tab,setTab]=useState('personal');
  return(
    <div className="sec fade-up">
      <div className="sec-lbl">Analytics Module</div>
      <div className="sec-h mb8">Behavioral Intelligence</div>
      <p className="sec-sub">Your data powers the research. The research powers the product.</p>

      <div className="tabs">
        {[['personal','My Stats'],['research','Research Data'],['platform','Platform']].map(([v,l])=>(
          <button key={v} className={`tab ${tab===v?'on':''}`} onClick={()=>setTab(v)}>{l}</button>
        ))}
      </div>

      {tab==='personal'&&(
        <div className="fade-up col g16">
          <div className="mgrid">
            {[{l:'TOTAL CALLS',v:'12',c:'var(--lime)',s:'+3 this week'},{l:'COMPLETION RATE',v:'91%',c:'var(--cyan)',s:'Platform avg: 74%'},{l:'AVG QUALITY SCORE',v:'84',c:'var(--lime)',s:'Top 12% of users'},{l:'CONNECTIONS MADE',v:'3',c:'var(--pink)',s:'LinkedIn opt-ins'}].map(m=>(
              <div key={m.l} className="mcard">
                <div className="m-lbl">{m.l}</div>
                <div className="m-val" style={{color:m.c}}>{m.v}</div>
                <div className="m-sub">{m.s}</div>
              </div>
            ))}
          </div>
          <div className="card card-p">
            <div className="sec-lbl mb12">YOUR VOICE PROFILE</div>
            <div className="bars">
              {[['Vulnerability',78,'var(--lime)'],['Directness',82,'var(--cyan)'],['Curiosity',91,'var(--lime)'],['Empathy',67,'var(--amber)']].map(([l,v,c])=>(
                <div key={l} className="bar-r"><div className="bar-lbl">{l}</div><div className="bar-track"><div className="bar-fill" style={{width:`${v}%`,background:c}}/></div><div className="bar-val">{v}%</div></div>
              ))}
            </div>
          </div>
          <div className="card" style={{overflow:'hidden'}}>
            <div className="card-p" style={{paddingBottom:0}}><div className="sec-lbl mb12">CALL HISTORY</div></div>
            <table className="dtable">
              <thead><tr><th>THEME</th><th>DUR</th><th>SCORE</th><th>STATUS</th><th>DATE</th></tr></thead>
              <tbody>
                {RESEARCH.slice(0,3).map(r=>(
                  <tr key={r.id}>
                    <td>{r.theme}</td>
                    <td className="mono txt-xs">{r.dur}</td>
                    <td><span className="chip chip-lime">{r.score}</span></td>
                    <td><span className={`chip ${r.ok?'chip-lime':'chip-pink'}`}>{r.ok?'COMPLETE':'DROPPED'}</span></td>
                    <td className="mono txt-xs txt-muted">{r.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {tab==='research'&&(
        <div className="fade-up col g16">
          <div className="card card-p" style={{borderColor:'rgba(200,255,87,.15)',background:'linear-gradient(135deg,rgba(200,255,87,.03),transparent)'}}>
            <div className="fb mb16">
              <div className="sec-lbl" style={{marginBottom:0}}>RESEARCH DASHBOARD — LIVE</div>
              <div className="chip chip-lime"><span className="dot blink"/>ACTIVE</div>
            </div>
            <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:16}}>
              {[{l:'TOTAL CALLS',v:'847',c:'var(--lime)'},{l:'HOURS RECORDED',v:'99h',c:'var(--cyan)'},{l:'CALLS TO 1,000',v:'153',c:'var(--pink)'}].map(s=>(
                <div key={s.l}><div className="m-lbl">{s.l}</div><div style={{fontSize:26,fontWeight:700,color:s.c}}>{s.v}</div></div>
              ))}
            </div>
          </div>
          <div className="card card-p">
            <div className="sec-lbl mb16">EMERGING BEHAVIORAL PATTERNS</div>
            {[
              {l:'Vulnerability → Trust (r=0.82)',v:82,d:'Calls with high vulnerability in first 90s complete at 2.1× rate'},
              {l:'Founder Mode trust score (87)',v:87,d:'Highest of all themes. Shared context = faster rapport'},
              {l:'Talk dominance dropout (r=0.34)',v:34,d:'When 1 party speaks >65% of time, quality drops significantly'},
            ].map((p,i)=>(
              <div key={i} className="mb16">
                <div className="fb mb4"><span className="txt-sm">{p.l}</span></div>
                <div className="bar-track mb4" style={{height:6}}><div className="bar-fill" style={{width:`${p.v}%`,background:'var(--lime)'}}/></div>
                <div className="txt-xs txt-muted">{p.d}</div>
              </div>
            ))}
          </div>
          <div className="card" style={{overflow:'hidden'}}>
            <div className="card-p" style={{paddingBottom:0}}><div className="sec-lbl mb12">RECENT CALL LOG</div></div>
            <table className="dtable">
              <thead><tr><th>ID</th><th>THEME</th><th>DUR</th><th>DONE</th><th>TRUST</th><th>DATE</th></tr></thead>
              <tbody>
                {RESEARCH.map(r=>(
                  <tr key={r.id}>
                    <td className="mono txt-xs">{r.id}</td>
                    <td className="txt-xs">{r.theme}</td>
                    <td className="mono txt-xs">{r.dur}</td>
                    <td style={{color:r.ok?'var(--lime)':'var(--pink)',fontWeight:700}}>{r.ok?'✓':'✗'}</td>
                    <td><span className="chip chip-lime">{r.score}</span></td>
                    <td className="mono txt-xs txt-muted">{r.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {tab==='platform'&&(
        <div className="fade-up col g16">
          <div className="mgrid">
            {[{l:'CALL COMPLETION RATE',v:'74%',c:'var(--lime)',s:'↑ 8% from last week'},{l:'REPEAT PARTICIPATION',v:'61%',c:'var(--cyan)',s:'Return within 7 days'},{l:'AVG RATING',v:'4.1★',c:'var(--amber)',s:'Out of 5.0'},{l:'CONNECTIONS FORMED',v:'312',c:'var(--pink)',s:'Mutual LinkedIn pairs'}].map(m=>(
              <div key={m.l} className="mcard">
                <div className="m-lbl">{m.l}</div>
                <div className="m-val" style={{color:m.c}}>{m.v}</div>
                <div className="m-sub">{m.s}</div>
              </div>
            ))}
          </div>
          <div className="card card-p">
            <div className="sec-lbl mb12">THEME PERFORMANCE (AVG QUALITY SCORE)</div>
            <div className="bars">
              {[['Student Builders',89,'var(--lime)'],['Founder Mode',87,'var(--cyan)'],['Startup Pitch',82,'var(--lime)'],['Creative Lab',76,'var(--amber)'],['Opposite Worlds',71,'var(--cyan)'],['Radical Honesty',63,'var(--pink)']].map(([l,v,c])=>(
                <div key={l} className="bar-r"><div className="bar-lbl" style={{width:120}}>{l}</div><div className="bar-track"><div className="bar-fill" style={{width:`${v}%`,background:c}}/></div><div className="bar-val">{v}</div></div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── TECH PANEL ───────────────────────────────────────────────
function TechPanel(){
  const [open,setOpen]=useState(false);
  const ARCH=[
    {name:"Auth Module",tech:["Twilio Verify","JWT / httpOnly cookie","Supabase users table"],desc:"Phone OTP → verified session. No passwords.",color:"var(--lime)"},
    {name:"Matching Engine",tech:["Node-cron (30s)","PostgreSQL","Supabase Realtime"],desc:"Pools waiting users by theme, pairs on slot start, fires Realtime event to UI.",color:"var(--cyan)"},
    {name:"Call Module",tech:["Twilio Voice API","TwiML Conference","Conference Recording"],desc:"Dual outbound calls bridged into one conference. AI prompt via Polly TTS before bridge.",color:"var(--amber)"},
    {name:"AI Processing",tech:["AWS S3","OpenAI Whisper","GPT-4o JSON mode"],desc:"Recording → S3 → Whisper transcription → GPT-4o structured insights → DB.",color:"var(--pink)"},
    {name:"Analytics Module",tech:["Supabase queries","React state","Recharts (prod)"],desc:"Per-user stats, research aggregates, platform health. Research-grade at 1,000 calls.",color:"var(--lime)"},
  ];
  return(
    <div style={{marginBottom:32}}>
      <button className="btn btn-outline w100" style={{justifyContent:'space-between'}} onClick={()=>setOpen(!open)}>
        <span className="mono txt-xs" style={{color:'var(--lime)'}}>⚙ TECHNICAL ARCHITECTURE — For interviewers</span>
        <span style={{color:'var(--muted2)'}}>{open?'▲ Hide':'▼ Show'}</span>
      </button>
      {open&&(
        <div className="tech-panel fade-up" style={{marginTop:8}}>
          <div className="tech-header">
            <div className="tech-title">Full-Stack Architecture · BlindCall</div>
            <div className="chip chip-cyan mono">5 independent modules</div>
          </div>
          <div className="tech-body">
            <div style={{marginBottom:20}}>
              {ARCH.map((m,i)=>(
                <div key={m.name} className="arch-row">
                  <div className="arch-line">
                    <div className="arch-dot" style={{background:m.color}}/>
                    {i<ARCH.length-1&&<div className="arch-vert"/>}
                  </div>
                  <div className="arch-card">
                    <div className="arch-mod" style={{color:m.color}}>{m.name}</div>
                    <div className="arch-desc">{m.desc}</div>
                    <div className="arch-tech">{m.tech.map(t=><div key={t} className="arch-chip">{t}</div>)}</div>
                  </div>
                </div>
              ))}
            </div>
            <div className="sec-lbl mb8">SAMPLE: CALL BRIDGE (TwiML)</div>
            <div className="code-block">
              <span className="cm">// When both users answer → read AI prompt → bridge to conference</span>{'\n'}
              twiml.<span className="fn">say</span>({'{'}<span className="str">voice</span>: <span className="str">'Polly.Joanna'</span>{'}'}, AI_PROMPTS[theme]);{'\n'}
              <span className="kw">const</span> dial = twiml.<span className="fn">dial</span>();{'\n'}
              dial.<span className="fn">conference</span>(roomName, {'{'}{'\n'}
              {'  '}<span className="str">record</span>: <span className="str">'record-from-start'</span>,{'\n'}
              {'  '}<span className="str">recordingStatusCallback</span>: <span className="str">'/webhooks/recording'</span>,{'\n'}
              {'  '}<span className="str">timeLimit</span>: <span className="str">420</span> <span className="cm">// 7 minutes hard cap</span>{'\n'}
              {'}'});
            </div>
            <div className="sec-lbl mb8" style={{marginTop:14}}>SAMPLE: AI INSIGHTS (GPT-4o JSON mode)</div>
            <div className="code-block">
              <span className="kw">const</span> insights = <span className="kw">await</span> openai.chat.completions.<span className="fn">create</span>({'{'}{'\n'}
              {'  '}model: <span className="str">'gpt-4o'</span>,{'\n'}
              {'  '}response_format: {'{'} type: <span className="str">'json_object'</span> {'}'},<span className="cm"> // structured output</span>{'\n'}
              {'  '}messages: [{'{'} role: <span className="str">'user'</span>, content: transcript {'}'}]{'\n'}
              {'}'});  <span className="cm">// Returns: quality_score, summary, emotion, traits</span>
            </div>
            <div className="divider"/>
            <div className="sec-lbl mb8">COST TO 1,000 CALLS</div>
            <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(140px,1fr))',gap:8}}>
              {[['Twilio calls','~$140'],['Whisper API','~$10'],['GPT-4o','~$8'],['AWS S3','~$2'],['Total','~$160']].map(([k,v])=>(
                <div key={k} style={{background:'var(--s2)',border:'1px solid var(--border)',borderRadius:'var(--r8)',padding:'10px 12px'}}>
                  <div className="txt-xxs mono txt-muted">{k}</div>
                  <div style={{fontSize:15,fontWeight:700,color:k==='Total'?'var(--lime)':'var(--text)',marginTop:2}}>{v}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── LANDING ──────────────────────────────────────────────────
function Landing({onJoin}){
  return(
    <div className="hero">
      <div className="hero-glow"/><div className="hero-dots"/>
      <div className="wrap" style={{position:'relative'}}>
        <div style={{maxWidth:620}}>
          <div className="hero-tag"><span className="hero-badge">BETA</span>Blind voice sessions · AI behavioral analysis</div>
          <h1 className="hero-h">Strangers.<br/><em>Real</em> conversations.<br/>Research data.</h1>
          <p className="hero-sub">A themed, timed blind voice call with a stranger. AI guides the session, transcribes it, and generates deep behavioral insights about how you connect.</p>
          <div className="hero-acts">
            <button className="btn btn-lime btn-lg" onClick={onJoin}>Join a Session →</button>
            <div className="chip chip-muted mono">7-min calls · Anonymous · 5 AI modules</div>
          </div>
          <div className="stat-row">
            {[['847','Calls completed'],['74%','Completion rate'],['153','Calls to milestone'],['6','Active themes']].map(([n,l])=>(
              <div key={l} className="stat-item"><div className="stat-n">{n}</div><div className="stat-l">{l}</div></div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── ROOT APP ─────────────────────────────────────────────────
export default function App(){
  const [page,setPage]=useState('landing');
  const [authed,setAuthed]=useState(false);
  const [theme,setTheme]=useState(null);

  // ── DEMO MODE ──
  const [demoActive,setDemoActive]=useState(false);
  const [demoIdx,setDemoIdx]=useState(0);
  const demoRef=useRef(null);

  const startDemo=()=>{
    setDemoActive(true);
    setDemoIdx(0);
    setPage('landing');
    setAuthed(false);
    setTheme(null);
  };

  const stopDemo=()=>{
    setDemoActive(false);
    clearTimeout(demoRef.current);
  };

  // Auto-advance demo steps
  useEffect(()=>{
    if(!demoActive)return;
    const screen=DEMO_STEPS[demoIdx];
    if(screen==='landing'){
      demoRef.current=setTimeout(()=>{setPage('auth');setDemoIdx(1)},2200);
    } else if(screen==='auth'){
      // auth handled by AuthSkip component, no auto-advance
    }
    return()=>clearTimeout(demoRef.current);
  },[demoActive,demoIdx]);

  const demoNext=useCallback(()=>{
    if(!demoActive)return;
    const next=demoIdx+1;
    if(next>=DEMO_STEPS.length){setDemoActive(false);return;}
    setDemoIdx(next);
    setPage(DEMO_STEPS[next]);
  },[demoActive,demoIdx]);

  const handleAuth=()=>{ setAuthed(true); setPage('matching'); if(demoActive)setDemoIdx(2); };
  const handleJoin=(t)=>{ setTheme(t); setPage('waiting'); if(demoActive)setDemoIdx(3); };
  const handleMatch=()=>{ setPage('call'); if(demoActive)setDemoIdx(4); };
  const handleEnd=()=>{ setPage('postcall'); if(demoActive)setDemoIdx(5); };
  const handleDone=()=>{ setPage('analytics'); if(demoActive)setDemoIdx(6); };

  const currentDemoStep=DEMO_STEPS.indexOf(page);

  return(
    <>
      <style>{STYLES}</style>
      <div className="page">
        {/* NAV */}
        <nav className="nav">
          <div className="wrap">
            <div className="nav-in">
              <div className="logo" onClick={()=>{setPage('landing');stopDemo()}}>blind<b>call</b></div>
              <div className="nav-right">
                {authed&&(
                  <>
                    {['matching','analytics'].map(p=>(
                      <button key={p} className="btn btn-ghost btn-sm" onClick={()=>setPage(p)} style={{textTransform:'capitalize'}}>
                        {p==='matching'?'Join Call':'Analytics'}
                      </button>
                    ))}
                  </>
                )}
                {!demoActive?(
                  <button className="btn btn-lime btn-sm" onClick={startDemo}>▶ Run Demo</button>
                ):(
                  <button className="btn btn-pink btn-sm" onClick={stopDemo}>■ Stop Demo</button>
                )}
              </div>
            </div>
          </div>
        </nav>

        {/* DEMO PROGRESS BAR */}
        {demoActive&&(
          <div className="demo-banner">
            <div className="wrap">
              <div className="demo-banner-in">
                <div className="demo-label">▶ DEMO MODE — Auto-advancing through all screens</div>
                <div className="demo-progress">
                  {DEMO_STEPS.map((s,i)=>(
                    <div key={s} className={`demo-step ${i<currentDemoStep?'done':i===currentDemoStep?'active':''}`} title={s}/>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* CONTENT */}
        <main style={{flex:1}}>
          <div className="wrap">
            {/* TECH PANEL — always visible except on landing */}
            {page!=='landing'&&<div style={{paddingTop:20}}><TechPanel/></div>}

            {page==='landing'&&<Landing onJoin={()=>setPage(authed?'matching':'auth')}/>}
            {page==='auth'&&<Auth onDone={handleAuth}/>}
            {page==='matching'&&<Matching onJoin={handleJoin}/>}
            {page==='waiting'&&<WaitingRoom theme={theme} onMatch={handleMatch}/>}
            {page==='call'&&<ActiveCall theme={theme} onEnd={handleEnd}/>}
            {page==='postcall'&&<PostCall theme={theme} onDone={handleDone}/>}
            {page==='analytics'&&<Analytics/>}
          </div>
        </main>

        {/* FOOTER */}
        <footer style={{borderTop:'1px solid var(--border)',padding:'18px 0',marginTop:40}}>
          <div className="wrap">
            <div className="fb">
              <div className="mono txt-xxs txt-muted">blindcall · full-stack portfolio prototype · 5 modules</div>
              <div className="fc g16">
                <span className="mono txt-xxs txt-muted">calls: 847</span>
                <span className="mono txt-xxs txt-lime">→ 1,000 milestone: 153 away</span>
              </div>
            </div>
          </div>
        </footer>
      </div>
      <SpeedInsights />
    </>
  );
}
