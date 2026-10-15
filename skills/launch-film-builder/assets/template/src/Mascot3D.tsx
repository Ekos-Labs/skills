import React,{useMemo} from 'react';
import * as THREE from 'three';

/* A coded 3D character: spheres, capsules and tubes in three.js, shaded through an ordered
   (Bayer) dither in screen space. The dot grid is fixed to the frame, so as the head turns, the
   arms move and the mouth talks, the dots crawl across him, which is what makes this look like
   motion design rather than a moving picture. Render inside a ThreeCanvas (see Char.tsx).
   Units: skull half-width is 1. Restyle him in STYLE below; reshape him in the JSX. */

export type V3=[number,number,number];
/* Colours are the clay greys before dithering: lighter prints more paper dots. The dither
   prints with exactly two colours, paper and ink (0..1 RGB). dot is the dither cell in screen
   pixels; 4 suits 1080p. */
export const STYLE={
 skin:'#ececec',hands:'#d6d6d6',hair:'#626262',sweater:'#9c9c9c',frames:'#141414',headsetColor:'#2e2e2e',
 glasses:true,headset:true,
 paper:[1,1,1] as V3,ink:[.05,.05,.05] as V3,
 dot:4,
};
const glsl=(c:V3)=>`vec3(${c.map(x=>x.toFixed(3)).join(',')})`;

export type Face={talk:number;blink:number;wink:number;brow:number;smile:number;lookX:number;lookY:number};
export type Pose={x:number;y:number;scale:number;yaw:number;pitch:number;roll:number};
export const REST_FACE:Face={talk:0,blink:0,wink:0,brow:0,smile:.5,lookX:0,lookY:0};

const DITHER_HEAD=`
float bayer2(vec2 a){a=floor(a);return fract(dot(a,vec2(.5,a.y*.75)));}
float bayer4(vec2 a){return bayer2(.5*a)*.25+bayer2(a);}
float bayer8(vec2 a){return bayer4(.5*a)*.25+bayer2(a);}
uniform float uPx;uniform float uLo;uniform float uHi;uniform vec2 uOff;
varying vec3 vLoc;
void main() {`;
const DITHER_TAIL=`#include <dithering_fragment>
 float l=dot(gl_FragColor.rgb,vec3(.299,.587,.114));
 l=clamp((l-uLo)/(uHi-uLo),0.,1.);
 float th=bayer8((gl_FragCoord.xy+uOff)/uPx);
 gl_FragColor.rgb=l>th?${glsl(STYLE.paper)}:${glsl(STYLE.ink)};`;
/* The hair is one shell around the skull, cut in its own unit-sphere space: a hairline that sits
   lower at the back, and the forehead window under the side part (fringe edge from the left
   temple up to the part, the right lock falling from the part to above the ear). */
const HAIR_CUT=`
 vec3 p=normalize(vLoc);
 if(p.y-.25*p.z<-.14) discard;
 if(p.z>0. && (p.x+.95)*.54-(p.y-.1)*1.45>0. && (p.x-.5)*-.56-(p.y-.64)*.28>0.) discard;`;

/* Soft clay: Phong with a broad, dim highlight, then the dither. */
type U={value:THREE.Vector2};
const useMat=(off:U,hex:string,px:number,shine=10,spec='#2a2a2a',cut=false)=>useMemo(()=>{
 const m=new THREE.MeshPhongMaterial({color:new THREE.Color(hex),shininess:shine,specular:new THREE.Color(spec),side:cut?THREE.DoubleSide:THREE.FrontSide});
 m.onBeforeCompile=(sh)=>{
  sh.uniforms.uPx={value:px};sh.uniforms.uOff=off;sh.uniforms.uLo={value:.06};sh.uniforms.uHi={value:.94};
  sh.vertexShader=sh.vertexShader.replace('void main() {','varying vec3 vLoc;\nvoid main() {\n vLoc=position;');
  sh.fragmentShader=sh.fragmentShader.replace('void main() {',DITHER_HEAD+(cut?HAIR_CUT:'')).replace('#include <dithering_fragment>',DITHER_TAIL);
 };
 m.customProgramCacheKey=()=>'dither'+px+(cut?'cut':'');
 return m;},[off,hex,px,shine,spec,cut]);

type SP={args?:[number,number,number];material:THREE.Material;position?:[number,number,number];scale?:[number,number,number]|number;rotation?:[number,number,number];visible?:boolean};
const S=({args=[1,48,32],...p}:SP)=><mesh {...p}><sphereGeometry args={args}/></mesh>;

export type Gesture='open'|'point'|'fist'|'thumb';
/** One arm: shoulder is fixed by side, the pose gives elbow and wrist, the hand's finger direction
    and the way its palm faces. Hand space: wrist at the origin, fingers along +y, palm toward +z. */
export type Arm={g:Gesture;elbow:V3;wrist:V3;dir:V3;palm:V3};

const UP=new THREE.Vector3(0,1,0);
const Limb=({a,b,r,material}:{a:V3;b:V3;r:number;material:THREE.Material})=>{
 const A=new THREE.Vector3(...a),B=new THREE.Vector3(...b),d=B.clone().sub(A);
 return <mesh material={material} position={A.clone().add(B).multiplyScalar(.5)} quaternion={new THREE.Quaternion().setFromUnitVectors(UP,d.clone().normalize())}>
  <capsuleGeometry args={[r,Math.max(.001,d.length()),8,16]}/></mesh>;
};
const handQ=(dir:V3,palm:V3)=>{const y=new THREE.Vector3(...dir).normalize(),p=new THREE.Vector3(...palm);
 const z=p.sub(y.clone().multiplyScalar(p.dot(y))).normalize(),x=new THREE.Vector3().crossVectors(y,z);
 return new THREE.Quaternion().setFromRotationMatrix(new THREE.Matrix4().makeBasis(x,y,z));};
/* A soft clay mitt: palm, four fingers, thumb. side -1 is his right hand (screen left); with the
   palm toward the viewer its thumb sits toward his middle, which is +x in hand space. */
const Hand=({g,side,skin}:{g:Gesture;side:number;skin:THREE.Material})=>{
 const tx=-side,fx=[-.15,-.05,.05,.15].map(v=>v*tx);
 const cap=(k:string|number,pos:V3,rot:V3,r:number,len:number)=><mesh key={k} material={skin} position={pos} rotation={rot}><capsuleGeometry args={[r,len,8,14]}/></mesh>;
 const curled=fx.map((x,k)=>k===3&&g==='point'?null:<S key={'c'+k} material={skin} position={[x,.42,.07]} scale={[1,.9,1]} args={[.075,20,14]}/>);
 if(g==='thumb')return <group>
  <S material={skin} position={[0,.24,0]} scale={[.42,.52,.4]} args={[.5,32,24]}/>
  {[.38,.28,.18,.08].map((y,k)=>cap(k,[-tx*.02,y,.15],[0,0,Math.PI/2],.062,.16))}
  {cap('t',[tx*.1,.62,0],[0,0,-tx*.12],.078,.2)}
 </group>;
 return <group>
  <S material={skin} position={[0,.2,0]} scale={[.46,.44,.22]} args={[.5,32,24]}/>
  {g==='open'&&fx.map((x,k)=>cap(k,[x*1.05,.56,0],[0,0,-x*.35],.062,.22))}
  {g==='point'&&<>{curled}{cap('i',[fx[3],.62,0],[0,0,0],.064,.3)}</>}
  {g==='fist'&&curled}
  {g==='open'?cap('t',[tx*.25,.24,.05],[0,0,tx*-.75],.07,.16):cap('t',[tx*.06,.28,.13],[0,0,Math.PI/2],.068,.14)}
 </group>;
};

const C=.35;               // skull centre
const HAIR:[number,number,number]=[1.08,1.24,1.06],HY=C+.08; // hair shell size and centre

/** screen: where the canvas's bottom-left corner sits on the frame, in px from the frame's bottom-left,
    so the dot grid lines up with the screen and the dots crawl as he moves. */
export const Mascot=({pose,face,px=STYLE.dot,screen=[0,0],arms={}}:{pose:Pose;face:Face;px?:number;screen?:[number,number];arms?:{L?:Arm;R?:Arm}})=>{
 const off=useMemo<U>(()=>({value:new THREE.Vector2()}),[]);off.value.set(screen[0],screen[1]);
 const skin=useMat(off,STYLE.skin,px,8,'#303030'),hair=useMat(off,STYLE.hair,px,14,'#4a4a4a',true),lock=useMat(off,STYLE.hair,px,14,'#4a4a4a'),ink=useMat(off,STYLE.frames,px,30,'#666666'),
  sweater=useMat(off,STYLE.sweater,px,4,'#111111'),set=useMat(off,STYLE.headsetColor,px,20,'#444444'),white=useMat(off,'#ffffff',px),mouthM=useMat(off,'#1c1c1c',px),handM=useMat(off,STYLE.hands,px,8,'#303030');
 // headset band: an arc over the hair, tipped back so it runs behind the crown
 const band=useMemo(()=>{const pts:THREE.Vector3[]=[];for(let i=0;i<=24;i++){const a=-Math.PI/2+Math.PI*i/24,tl=.3;
  pts.push(new THREE.Vector3(Math.sin(a)*HAIR[0]*1.06,HY+Math.cos(a)*Math.cos(tl)*HAIR[1]*1.06-.02,-Math.cos(a)*Math.sin(tl)*HAIR[2]*1.06));}
  return new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts),64,.035,8);},[]);
 const boom=useMemo(()=>new THREE.TubeGeometry(new THREE.CatmullRomCurve3([new THREE.Vector3(-1.16,C-.3,.12),new THREE.Vector3(-1.06,C-.66,.45),new THREE.Vector3(-.52,C-.84,.84)]),28,.028,8),[]);
 const rim=useMemo(()=>{const pts:THREE.Vector3[]=[];const at=(x:number,y:number)=>{const z=Math.sqrt(Math.max(0,1-x*x-y*y)),k=.985;
  pts.push(new THREE.Vector3(x*HAIR[0]*k,HY+y*HAIR[1]*k,z*HAIR[2]*k));};
  for(let i=0;i<=20;i++){const t=i/20;at(-.95+1.45*t,.1+.54*t);}
  for(let i=1;i<=12;i++){const t=i/12;at(.5+.28*t,.64-.56*t);}
  return new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts),80,.065,12);},[]);
 const eyeOpen=(side:number)=>Math.max(.07,1-face.blink-(side<0?face.wink:0));
 const arc=.7+.35*face.smile;
 const ex=.42,ey=C-.1;
 return <group position={[pose.x,pose.y,0]} scale={pose.scale}>
  {/* body: rounded crewneck sweatshirt, collar rib, short neck */}
  <group rotation={[0,pose.yaw*.2,pose.roll*.25]}>
   <S material={sweater} position={[0,-2.15,-.1]} scale={[1.8,1.2,1.05]}/>
   <mesh material={sweater} position={[0,-1.0,.06]} rotation={[Math.PI/2+.12,0,0]}><torusGeometry args={[.42,.09,16,48]}/></mesh>
   <mesh material={skin} position={[0,-.88,0]}><cylinderGeometry args={[.35,.39,.6,40]}/></mesh>
   {(['L','R'] as const).map(k=>{const a=arms[k];if(!a)return null;const side=k==='L'?-1:1,sh:V3=[side*1.15,-1.5,-.05];
    const d=new THREE.Vector3(...a.wrist).sub(new THREE.Vector3(...a.elbow)).normalize().multiplyScalar(.1);
    return <group key={k}>
     <Limb a={sh} b={a.elbow} r={.22} material={sweater}/>
     <Limb a={a.elbow} b={[a.wrist[0]-d.x,a.wrist[1]-d.y,a.wrist[2]-d.z]} r={.19} material={sweater}/>
     <group position={a.wrist} quaternion={handQ(a.dir,a.palm)} scale={1.2}><Hand g={a.g} side={side} skin={handM}/></group>
    </group>;})}
  </group>
  <group position={[0,-.2,0]} rotation={[pose.pitch,pose.yaw,pose.roll]}>
   <group position={[0,.2,0]} scale={[.93,1,1]}>
    {/* head: round skull, full cheeks and chin */}
    <S material={skin} position={[0,C,0]} scale={[1,1.17,.96]} args={[1,64,64]}/>
    <S material={skin} position={[0,C-.5,.1]} scale={[.8,.62,.8]}/>
    {[-1,1].map(s=><S key={s} material={skin} position={[s*1.0,C-.26,-.05]} scale={[.4,.6,.4]} args={[.42,32,24]}/>)}
    {/* hair shell */}
    <mesh material={hair} position={[0,HY,0]} scale={HAIR}><sphereGeometry args={[1,96,64]}/></mesh>
    <mesh material={lock} geometry={rim}/>
    {/* brows */}
    {[-1,1].map(s=><mesh key={s} material={lock} position={[s*.48,C+.32+face.brow*(s>0?.14:.05),.86]} rotation={[.15,s*.35,Math.PI/2+s*(.06-face.brow*.12)]}><capsuleGeometry args={[.07,.18,8,16]}/></mesh>)}
    {/* eyes: small tall ovals with a highlight; blink and wink squash them */}
    {[-1,1].map(s=><group key={s} position={[s*ex+face.lookX*.06,ey+face.lookY*.04,.88]} rotation={[0,s*.3,0]} scale={[1,eyeOpen(s),1]}>
     <S material={ink} scale={[.6,1,.45]} args={[.105,32,24]}/>
     <S material={white} position={[.02,.04,.04]} args={[.02,16,12]}/>
    </group>)}
    {/* glasses: thick round-square frames, short bridge, temples back to the ears */}
    {STYLE.glasses&&<>
     {[-1,1].map(s=><mesh key={s} material={ink} position={[s*ex,ey,.99]} rotation={[0,s*.22,0]} scale={[1,.82,1]}><torusGeometry args={[.31,.05,20,64]}/></mesh>)}
     <mesh material={ink} position={[0,ey+.04,1.03]} rotation={[0,0,Math.PI/2]}><cylinderGeometry args={[.028,.028,.16,12]}/></mesh>
     {[-1,1].map(s=><mesh key={s} material={ink} position={[s*.86,ey+.05,.52]} rotation={[0,s*-.42,0]}><boxGeometry args={[.05,.05,.86]}/></mesh>)}
    </>}
    {/* nose */}
    <S material={skin} position={[0,C-.42,.94]} scale={[1,.9,.85]} args={[.13,32,24]}/>
    {/* mouth: a small smile when quiet, a soft open shape when talking */}
    <mesh material={mouthM} visible={face.talk<.2} position={[.04,C-.2,1.04]} rotation={[.3,0,-Math.PI/2-arc/2]} scale={[1,1-face.talk*.45,1]}><torusGeometry args={[.5,.03,12,48,arc]}/></mesh>
    <S material={mouthM} position={[.02,C-.66,.88]} rotation={[.3,0,0]} scale={[.1+.04*face.talk,.012+.07*face.talk,.05]} visible={face.talk>.08}/>
    {/* headset: band, ear cup, boom and mic */}
    {STYLE.headset&&<>
     <mesh material={set} geometry={band}/>
     <mesh material={set} position={[-1.12,C-.2,0]} rotation={[0,0,Math.PI/2]} scale={[1,1,1.35]}><cylinderGeometry args={[.2,.2,.2,40]}/></mesh>
     <mesh material={set} geometry={boom}/>
     <S material={set} position={[-.52,C-.84,.84]} scale={[1.35,1,1]} args={[.075,20,14]}/>
    </>}
   </group>
  </group>
 </group>;
};

export const MascotLights=()=><>
 <ambientLight intensity={.2}/>
 <directionalLight position={[-4,5,7]} intensity={2.4}/>
 <directionalLight position={[5,1,3]} intensity={.45}/>
 <directionalLight position={[1,4,-6]} intensity={.7}/>
</>;
