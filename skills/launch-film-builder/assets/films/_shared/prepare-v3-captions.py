"""Build captions and original audio stems from the supplied 85.7s edit."""
from pathlib import Path
import json, subprocess, wave
import numpy as np
ROOT=Path(__file__).resolve().parents[1]
(ROOT/'out').mkdir(exist_ok=True)
(ROOT/'public/audio').mkdir(parents=True,exist_ok=True)
raw=json.loads((ROOT/'production/transcript.json').read_text())
words=[{k:w[k] for k in ('start','end','word')} for s in raw['segments'] for w in s['words']]
for w in words:
 w['word']=w['word'].strip().replace('solar','solo').replace('chart','Chat').replace('meta','Meta')
# The recognizer split ChatGPT into two tokens; preserve its measured span.
for i in range(len(words)-1,0,-1):
 if words[i]['word'].startswith('GPT') and words[i-1]['word']=='Chat':
  words[i-1]['word']='ChatGPT'+('.' if words[i]['word'].endswith('.') else '')
  words[i-1]['end']=words[i]['end'];words.pop(i)
captions=[];group=[]
for w in words:
 group.append(w)
 if len(group)>=7 or w['word'].endswith(('.',',','?')) and len(group)>=3:
  captions.append({'start':group[0]['start'],'end':group[-1]['end'],'words':group});group=[]
if group:captions.append({'start':group[0]['start'],'end':group[-1]['end'],'words':group})
(ROOT/'src/captions.json').write_text(json.dumps(captions,indent=2))
def stamp(t):
 ms=round(t*1000);return f'{ms//3600000:02}:{ms//60000%60:02}:{ms//1000%60:02},{ms%1000:03}'
(ROOT/'out/ekos-launch.srt').write_text('\n\n'.join(f"{i+1}\n{stamp(c['start'])} --> {stamp(c['end'])}\n"+' '.join(w['word'] for w in c['words']) for i,c in enumerate(captions)))
SR=48000;DUR=89.;N=int(SR*DUR);t=np.arange(N)/SR;rng=np.random.default_rng(48)
music=np.zeros((N,2));sfx=np.zeros((N,2))
def place(buf,start,sig,gain=1,pan=0):
 a=max(0,int(start*SR));n=min(len(sig),N-a)
 if n>0:buf[a:a+n,0]+=sig[:n]*gain*np.sqrt((1-pan)/2);buf[a:a+n,1]+=sig[:n]*gain*np.sqrt((1+pan)/2)
def tone(freq,duration,decay=3):
 tt=np.arange(int(SR*duration))/SR
 return (np.sin(2*np.pi*freq*tt)+.2*np.sin(2*np.pi*freq*2*tt))*(1-np.exp(-tt*70))*np.exp(-tt*decay)
# Original restrained 100 BPM score, four related chords, low under speech.
chords=[[110,164.8138,220,261.6256],[87.307,130.813,174.614,220],[130.813,195.998,261.626,329.628],[97.999,146.832,195.998,246.942]]
for beat in range(148):
 at=beat*.6;ch=chords[(beat//16)%4]
 if beat%4==0:
  tt=np.arange(int(SR*3.1))/SR;env=np.sin(np.pi*np.minimum(tt/3.1,1))**2
  for k,f in enumerate(ch):
   sig=(np.sin(2*np.pi*f*tt)+.18*np.sin(2*np.pi*(f*1.003)*tt))*env
   place(music,at,sig,.008,(-.6+k*.4))
 if at>12.4 and at<84:
  if beat%2==0:
   tt=np.arange(int(SR*.22))/SR
   sig=np.sin(2*np.pi*(48*tt+1.7*(1-np.exp(-tt*35))))*np.exp(-tt*23)
   place(music,at,sig,.029)
  if beat%2==1:
   place(music,at,tone(ch[(beat//2)%4]*2,.65,8),.012,np.sin(beat)*.5)
# Cue-aligned glass ticks and restrained sweeps.
cues=[12.46,17.98,19.22,20.2,21.08,21.94,25.16,28.8,31.08,35.28,39.9,42.2,44.84,46.14,51.9,54.2,56.4,60.44,63.06,64.04,65.94,67.84,69.48,72.7,74.54,76.36,79.1,81.6,84.88]
for i,at in enumerate(cues):
 place(sfx,at,tone([660,880,990,1320][i%4],.7,11),.035,(-.35 if i%2 else .35))
for at in [12.46,25.16,35.28,51.9,60.44,72.7,79.1,84.5]:
 tt=np.arange(int(SR*.65))/SR;env=np.sin(np.pi*tt/.65)**3
 sig=np.sin(2*np.pi*(150*tt+350*tt**2))*env
 place(sfx,at-.35,sig,.018)
for f in [110,164.8138,220,329.6276]:place(music,84.1,tone(f,4.9,.55),.025)
fade=np.minimum(t/1,1)*np.minimum((DUR-t)/1.2,1)
# Broader channel section, reduced movement under the founder proof.
shape=np.interp(t,[0,2,10.6,12.5,37.8,38.2,48.4,51.9,60.4,69.5,78.8,84.1,85.8,89],[.6,.65,.65,1,1,.65,.65,1,1.18,1,1.2,1.2,1.5,1.5])
music*= (fade*shape*3)[:,None]
def save(p,a):
 with wave.open(str(p),'wb') as w:
  w.setnchannels(2);w.setsampwidth(2);w.setframerate(SR);w.writeframes((np.clip(a,-1,1)*32767).astype('<i2').tobytes())
save(ROOT/'public/audio/music.wav',music);save(ROOT/'public/audio/effects.wav',sfx)
subprocess.run(['ffmpeg','-v','error','-i',str(ROOT/'production/speech.wav'),'-af','highpass=f=75,lowpass=f=15000,acompressor=threshold=0.12:ratio=2.4:attack=10:release=160,loudnorm=I=-16:TP=-2:LRA=8','-ar','48000','-ac','2','-y',str(ROOT/'public/audio/dialogue.wav')],check=True)
subprocess.run(['ffmpeg','-v','error','-i',str(ROOT/'public/audio/dialogue.wav'),'-i',str(ROOT/'public/audio/music.wav'),'-i',str(ROOT/'public/audio/effects.wav'),'-filter_complex','[0:a][1:a][2:a]amix=inputs=3:duration=longest:normalize=0,alimiter=limit=0.89:level=false[a]','-map','[a]','-y',str(ROOT/'public/audio/mix.wav')],check=True)
print(f'Prepared {len(words)} words, {len(captions)} caption phrases, and 89s original audio stems.')
