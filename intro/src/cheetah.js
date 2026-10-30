import*as o from"../vendor/three.module.js";import{smootherstep as N}from"./kit.js";import{SCROLL as T}from"./config.js";import F from"./travel.js";const S=4.333333492279053,_=-.02,D=.41955,M={frames:27,cycleFrames:26,density:160,lineWidth:.033,meshes:[{name:"Cheetah_Body",sourceVertices:111830,vertices:178589,attrs:[{offset:0,bytes:714356},{offset:714356,bytes:1428712},{offset:2143068,bytes:714356},{offset:2857424,bytes:1428712},{offset:4286136,bytes:714356},{offset:5000492,bytes:714356},{offset:5714848,bytes:714356},{offset:6429204,bytes:2678448}],min:[-.2187950164079666,-.011049446649849415,-1.323564887046814],step:[66771963247447275e-22,1548275577079039e-20,346345805155579e-19],positionOffset:0,normalOffset:18116460},{name:"Cheetah_Claws",sourceVertices:24352,vertices:28518,attrs:[{offset:9107652,bytes:114072},{offset:9221724,bytes:228144},{offset:9449868,bytes:114072},{offset:9563940,bytes:228144},{offset:9792084,bytes:114072},{offset:9906156,bytes:114072},{offset:10020228,bytes:114072},{offset:10134300,bytes:583680}],min:[-.2017965018749237,-.015628186985850334,-1.0300015211105347],step:[6148398824734613e-21,5329944997356506e-21,30332990718306974e-21],positionOffset:18451950,normalOffset:22396974}]},C=`
attribute float headMask;
attribute vec3 gridPosition;
attribute vec3 gridNormal;
varying vec2 vUV;
varying float vHead;
varying vec3 vGridPosition;
varying vec3 vGridNormal;
void main() {
  vUV = uv;
  vHead = headMask;
  vGridPosition = gridPosition;
  vGridNormal = gridNormal;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.);
}`,W=`
uniform sampler2D headMap;
uniform vec3 spatialSpacing;
uniform vec3 spatialPhase;
uniform float lineWidth;
varying vec2 vUV;
varying float vHead;
varying vec3 vGridPosition;
varying vec3 vGridNormal;
void main() {
  vec3 p = (vGridPosition + spatialPhase) / spatialSpacing;
  vec3 restNormal = abs(normalize(vGridNormal));
  vec3 tangent = max(vec3(.04), 1. - restNormal);
  vec3 d = 1. - abs(mod(p, 2.) - 1.);
  vec3 normalized = d / tangent;
  vec3 gridWidth = vec3(lineWidth) * vec3(.02, .03, .02) / spatialSpacing;
  vec3 aa = min(max(fwidth(p) / tangent, vec3(.0001)), gridWidth * .75);
  vec3 spatialLine = 1. - smoothstep(gridWidth - aa * .5, gridWidth + aa * .5, normalized);
  float secondTangent = max(min(tangent.x, tangent.y), max(min(tangent.x, tangent.z), min(tangent.y, tangent.z)));
  vec3 directionConfidence = smoothstep(vec3(-.015), vec3(.005), tangent - secondTangent);
  vec3 cleanedLine = spatialLine * directionConfidence;
  float cleanedGrid = smoothstep(.12, .32, max(cleanedLine.x, max(cleanedLine.y, cleanedLine.z)));
  float footMask = smoothstep(.30, .24, vGridPosition.y);
  float continuousPaw = smoothstep(.025, .045, vGridPosition.x)
    * (1. - smoothstep(.30, .34, vGridPosition.y))
    * (1. - smoothstep(-.09, -.06, vGridPosition.z));
  float localCleanup = max(clamp(vHead, 0., 1.), footMask * (1. - continuousPaw));
  float grid = max(spatialLine.x, max(spatialLine.y, spatialLine.z));
  grid = smoothstep(.12, .32, grid);
  float mask = mix(grid, cleanedGrid, localCleanup);
  gl_FragColor = vec4(mix(vec3(.001), vec3(1., 1., 1.), mask), 1.);
  #include <tonemapping_fragment>
  #include <colorspace_fragment>
}`,O=`
uniform vec2 clawDensity;
varying vec2 vUV;
void main() {
  vec2 p = vUV * clawDensity;
  vec2 distanceToLine = abs(fract(p - .5) - .5) / max(fwidth(p), vec2(.0001));
  vec2 line = 1. - smoothstep(vec2(.35), vec2(.85), distanceToLine);
  float mask = max(line.x, line.y);
  gl_FragColor = vec4(mix(vec3(.001), vec3(1., 1., 1.), mask), 1.);
  #include <tonemapping_fragment>
  #include <colorspace_fragment>
}`;async function R(e){const i=await fetch(e);if(!i.ok)throw new Error(`fetch ${e}: ${i.status}`);const a=await i.arrayBuffer();return new Uint8Array(a)[0]===31?new Response(new Blob([a]).stream().pipeThrough(new DecompressionStream("gzip"))).arrayBuffer():a}async function Y(e,i,a){const u=new o.LoadingManager;i&&(u.onProgress=(n,f,r)=>i(f/Math.max(1,r)));const d=new o.TextureLoader(u),[l,v,s,c]=await Promise.all([R(`${e}mesh.bin.br`),R(`${e}motion.bin.br`),d.loadAsync(`${e}head-lines.png`),d.loadAsync(`${e}limb-lines.png`)]),t=a?a.capabilities.getMaxAnisotropy():1;for(const n of[s,c])n.colorSpace=o.NoColorSpace,n.flipY=!0,n.wrapS=n.wrapT=o.RepeatWrapping,n.anisotropy=t;return{staticBuf:l,animBuf:v,headTex:s,limbTex:c}}function z(e,i,a,u){const d=a.length,l=new Float32Array(u*d*3),[v,s,c]=i.min,[t,n,f]=i.step;for(let r=0;r<u;r++){const p=r*i.sourceVertices*3,A=r*d*3;for(let x=0,b=A;x<d;x++,b+=3){const g=p+a[x];l[b]=v+e[g]*t,l[b+1]=s+e[g+1]*n,l[b+2]=c+e[g+2]*f}}return l}function E(e,i,a){const u=a*i.sourceVertices*3,d=new Uint8Array(e,i.positionOffset,u*2),l=new Uint16Array(u),v=i.sourceVertices;for(let s=0;s<a;s++)for(let c=0;c<3;c++){const t=(s*3+c)*v,n=t+u;let f=0;for(let r=0,p=s*v*3+c;r<v;r++,p+=3)f=f+d[t+r]+d[n+r]*256&65535,l[p]=f}return l}function H(e,i){const a=i.sourceVertices,u=new Int8Array(e,i.normalOffset,a*3),d=new Int16Array(a*3);for(let l=0;l<3;l++){const v=l*a;let s=0;for(let c=0,t=l;c<a;c++,t+=3)s=s+u[v+c]&255,d[t]=s>127?s-256:s}return d}function j(e,i){const a=new o.Group;a.name="cheetah",i.add(a);const u=new o.ShaderMaterial({uniforms:{headMap:{value:e.headTex},spatialSpacing:{value:new o.Vector3(.01,.015,.01)},spatialPhase:{value:new o.Vector3(.0017006996425669063,.013380215495990055,.007386928727386883)},lineWidth:{value:M.lineWidth}},vertexShader:C,fragmentShader:W,side:o.DoubleSide}),d=new o.ShaderMaterial({uniforms:{clawDensity:{value:new o.Vector2(144,32)}},vertexShader:C,fragmentShader:O,side:o.DoubleSide}),l=M.meshes.map((t,n)=>{const[f,r,p,A,x,b,g,P]=t.attrs,w=new Uint32Array(e.staticBuf,f.offset,f.bytes/4),y=new Uint32Array(w.length);for(let B=0;B<w.length;B++)y[B]=w[B]*3;const m=new o.BufferGeometry;m.setAttribute("position",new o.BufferAttribute(new Float32Array(t.vertices*3),3).setUsage(o.DynamicDrawUsage)),m.setAttribute("uv",new o.BufferAttribute(new Float32Array(e.staticBuf,r.offset,r.bytes/4),2)),m.setAttribute("headMask",new o.BufferAttribute(new Float32Array(e.staticBuf,p.offset,p.bytes/4),1)),m.setAttribute("uvB",new o.BufferAttribute(new Float32Array(e.staticBuf,A.offset,A.bytes/4),2)),m.setAttribute("limbMask",new o.BufferAttribute(new Float32Array(e.staticBuf,x.offset,x.bytes/4),1)),m.setAttribute("widthU",new o.BufferAttribute(new Float32Array(e.staticBuf,b.offset,b.bytes/4),1)),m.setAttribute("widthV",new o.BufferAttribute(new Float32Array(e.staticBuf,g.offset,g.bytes/4),1)),m.setIndex(new o.BufferAttribute(new Uint32Array(e.staticBuf,P.offset,P.bytes/4),1));const G=new o.Mesh(m,n===0?u:d);G.name=t.name,G.frustumCulled=!1,a.add(G);const h=z(E(e.animBuf,t,M.frames),t,y,M.frames);if(n>=0){const B=new Float32Array(h.buffer,h.byteOffset,t.vertices*3);m.setAttribute("gridPosition",new o.BufferAttribute(B,3));const k=H(e.animBuf,t),V=new Float32Array(t.vertices*3);for(let U=0;U<w.length;U++)for(let L=0;L<3;L++)V[U*3+L]=k[w[U]*3+L]/127;m.setAttribute("gridNormal",new o.BufferAttribute(V,3))}return{cfg:t,ids:w,geometry:m,framesBuf:h}});function v(t){let n=0;for(;n<F.length-2&&(n+1)/24<t;)n++;const f=Math.min(1,Math.max(0,(t-n/24)*24));return F[n]+(F[n+1]-F[n])*f}let s=-1;const c={root:a,fov:54.95352,frameCount:105,rootZ:0,update(t){const n=Math.min(t*S,S-1e-5);c.rootZ=v(n),a.position.set(0,_,c.rootZ+D);const f=t*104%M.cycleFrames;if(f!==s){s=f;const r=Math.floor(f),p=Math.min(r+1,M.frames-1),A=f-r;for(const{cfg:x,ids:b,geometry:g,framesBuf:P}of l){const w=g.attributes.position.array,y=b.length*3,m=P.subarray(r*y,r*y+y);if(p===r||A===0)w.set(m);else{const G=P.subarray(p*y,p*y+y);for(let h=0;h<y;h++)w[h]=m[h]+(G[h]-m[h])*A}g.attributes.position.needsUpdate=!0}}return N(t,0,T.roadFadeEnd)}};return c}export{j as createCheetah,Y as loadCheetah};
