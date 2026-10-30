import*as t from"../vendor/three.module.js";import{FACING as N,COLORS as p}from"./config.js";import{canvas2d as U,canvasTexture as k,extrudeShape as M,roundedRectShape as A,uiMesh as x,hitPlane as q,sharedMats as R,outlineTube as L,textPlate as E,lcg as O}from"./kit.js";const I=`
varying vec3 vNormalV;
varying vec3 vViewDir;
varying vec3 vPosLocal;
void main() {
  vec4 mv = modelViewMatrix * vec4(position, 1.0);
  vNormalV = normalize(normalMatrix * normal);
  vViewDir = normalize(-mv.xyz);
  vPosLocal = position;
  gl_Position = projectionMatrix * mv;
}`,j=`
uniform sampler2D uFrame;
uniform vec2 uSize;
uniform vec3 uTint;
uniform float uFrost;
uniform float uPhase;
varying vec3 vNormalV;
varying vec3 vViewDir;
varying vec3 vPosLocal;

float hash21(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }

void main() {
  vec3 N = normalize(vNormalV);
  vec3 V = normalize(vViewDir);
  float facing = abs(dot(N, V));
  float rim = pow(1.0 - facing, 2.2);

  vec2 screenUV = gl_FragCoord.xy / uSize;
  vec2 gUV = vPosLocal.xy * 160.0;
  vec2 cell = floor(gUV);
  vec2 fr = fract(gUV);
  fr = fr * fr * (3.0 - 2.0 * fr);
  float grain = mix(
    mix(hash21(cell), hash21(cell + vec2(1.0, 0.0)), fr.x),
    mix(hash21(cell + vec2(0.0, 1.0)), hash21(cell + vec2(1.0, 1.0)), fr.x),
    fr.y);
  float footprint = max(length(dFdx(gUV)), length(dFdy(gUV)));
  grain = mix(grain, 0.5, smoothstep(0.5, 2.0, footprint));

  vec2 bend = N.xy * (0.006 + 0.004 * rim);
  vec2 q = clamp(screenUV + bend + vec2(grain - 0.5) * uFrost * 0.001, vec2(0.003), vec2(0.997));
  vec2 blur = vec2(1.6 + uFrost * 3.5) / uSize;

  vec3 behind = texture2D(uFrame, q).rgb * 0.36;
  behind += (texture2D(uFrame, q + vec2(blur.x, 0.0)).rgb
           + texture2D(uFrame, q - vec2(blur.x, 0.0)).rgb
           + texture2D(uFrame, q + vec2(0.0, blur.y)).rgb
           + texture2D(uFrame, q - vec2(0.0, blur.y)).rgb) * 0.16;

  vec3 rainbow = 0.5 + 0.5 * cos(6.28318 * (N.x * 0.32 + N.y * 0.48 + uPhase * 0.025 + vec3(0.0, 0.33, 0.67)));
  float gleam = pow(max(dot(reflect(-normalize(vec3(-0.45, 0.8, 1.0)), N), V), 0.0), 36.0);
  float edge = pow(1.0 - facing, 6.0);

  vec3 col = mix(behind, uTint, 0.08 + uFrost * 0.50)
           + rainbow * rim * 0.48
           + vec3(gleam * 0.5 + edge * 0.55)
           + vec3((grain - 0.5) * uFrost * 0.035);
  float alpha = clamp(0.15 + uFrost * 0.44 + rim * 0.75 + gleam * 0.22, 0.12, 0.95);
  gl_FragColor = vec4(col, alpha);
}`;function _(){const a=new t.Shape;return a.moveTo(-.95,-.64),a.lineTo(.05,-.64),a.lineTo(.3,-.94),a.quadraticCurveTo(.36,-.99,.43,-.88),a.lineTo(.6,-.64),a.lineTo(.95,-.64),a.quadraticCurveTo(1.3,-.64,1.3,-.32),a.lineTo(1.3,.35),a.quadraticCurveTo(1.3,.68,.96,.68),a.lineTo(-.96,.68),a.quadraticCurveTo(-1.3,.68,-1.3,.35),a.lineTo(-1.3,-.32),a.quadraticCurveTo(-1.3,-.64,-.95,-.64),a}function W(a,V){const S=new t.Group;S.name="Glass_UI_Collection",a.add(S);const z=R(),y=[],T=[],h=new t.Vector2;let l=null;function C(r,o){const f=new t.ShaderMaterial({uniforms:{uFrame:{value:null},uSize:{value:h},uTint:{value:new t.Color(o)},uFrost:{value:r},uPhase:{value:0}},vertexShader:I,fragmentShader:j,transparent:!0,depthWrite:!1,side:t.FrontSide});return T.push(f),f}function P(){if(V.getDrawingBufferSize(h),!(l&&l.image.width===h.x&&l.image.height===h.y)){l?.dispose(),l=new t.FramebufferTexture(h.x,h.y),l.minFilter=t.LinearFilter,l.magFilter=t.LinearFilter;for(const r of T)r.uniforms.uFrame.value=l}}P();const c=new t.Group;c.name="Iridescent_Switch",c.rotation.y=N.right;let b=!0,v;{const r=A(3.12,1.45,.7),o=new t.Mesh(M(r,.15,.06,4,36,!0),C(.04,p.glassTintSwitch));o.layers.set(2),o.position.z=-.05,c.add(o),c.add(x(L(r,-.08,.035,128),new t.MeshPhysicalMaterial({color:p.glassEdge,roughness:.26,metalness:.4,clearcoat:1})));const[f,e]=U(512,512),n=e.createLinearGradient(0,0,512,512);n.addColorStop(0,"#ffffff"),n.addColorStop(.5,"#d8d8d8"),n.addColorStop(1,"#8a8a8a"),e.fillStyle=n,e.fillRect(0,0,512,512);const i=O(1862);for(let s=0;s<2600;s++)e.fillStyle=s%4?"#55555548":"#ffffff94",e.beginPath(),e.arc(i()*512,i()*512,.8+i()*2.5,0,7),e.fill();e.strokeStyle="#ffffff80",e.lineWidth=.8;for(let s=0;s<=512;s+=12)e.beginPath(),e.moveTo(s,0),e.lineTo(s,512),e.moveTo(0,s),e.lineTo(512,s),e.stroke();v=x(new t.TorusGeometry(.37,.17,24,72),new t.MeshPhysicalMaterial({map:k(f),roughness:.4,clearcoat:.6,metalness:.05})),v.position.set(-.82,0,-.2),c.add(v);const m=E("AI / HANDOFF",1.5,.17,"#f2f2f2");m.position.set(0,-.99,-.16),c.add(m);const w=q(3.24,1.6,-.6,"toggle");c.add(w),y.push(w)}const u=new t.Group;u.name="Layered_Glass_Chat",u.rotation.y=N.right;let d=0,g,F;const G=[];{const r=_(),o=x(M(r,.22,.09,4,36,!0),[z.orangeStd,new t.MeshPhysicalMaterial({color:p.glassEdge,roughness:.26,metalness:.4,clearcoat:1})]);o.position.set(0,-.27,.18),u.add(o),g=new t.Mesh(M(r,.09,.055,4,36,!0),C(.4,p.glassTintChat)),g.layers.set(2),g.position.set(0,.2,-.24),u.add(g);const f=_(),e=L(f,0,.023,128);e.translate(0,.2,-.29),F=x(e,new t.MeshPhysicalMaterial({color:p.iridescentTube,roughness:.17,metalness:.18,clearcoat:1,iridescence:1,iridescenceIOR:1.4})),u.add(F);for(let i=0;i<3;i++){const m=x(new t.SphereGeometry(.105,20,12),z.orangeStd);m.position.set((i-1)*.4,.26,-.38),u.add(m),G.push(m)}const n=q(2.8,2.1,-.6,"chat");n.position.set(0,-.13,-.6),u.add(n),y.push(n)}S.add(c,u);let D=0;return{root:S,hitAreas:y,resize:P,capture(){V.copyFramebufferToTexture(new t.Vector2(0,0),l)},update(r,o,f){const e=Math.min(.1,(o-D)/1e3||0);D=o,c.scale.setScalar(1.05),u.scale.setScalar(1.05);const n=b?-.82:.82;v.position.x+=(n-v.position.x)*(1-Math.exp(-e*12)),d=Math.max(0,d-e*3),g.position.z=-.24+d*.18,F.position.z=d*.18,G.forEach((i,m)=>{const w=f?0:Math.max(0,Math.sin(o*.0038-m*.65))*.05;i.position.y=.26+w-d*.04,i.position.z=-.38+d*.18});for(const i of T)i.uniforms.uPhase.value=r*8},interact(r){const o=r.object.userData.action;return o==="toggle"?b=!b:o==="chat"&&(d=1),o},get state(){return{switchOn:b}}}}export{W as createGlass};
