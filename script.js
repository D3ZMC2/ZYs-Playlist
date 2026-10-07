const audio=document.getElementById('audio');
const play=document.getElementById('play'),restart=document.getElementById('restart'),mute=document.getElementById('mute');
const seek=document.getElementById('seek'),current=document.getElementById('current'),duration=document.getElementById('duration');
const status=document.getElementById('status'),time=document.getElementById('time'),lyricsBox=document.getElementById('lyrics'),sync=document.getElementById('sync');
const lines=[
['I couldn’t wait for you to come and clear the cupboard',1],['But now you’re gone and leaving nothing but a sign',8],['Another evening I’ll be sitting reading in-between your lines',16],['Because I miss you all the time',24],['So, get away',30],['Another way to feel what you didn’t want yourself to know',32],['And let yourself go',36],['You know you didn’t lose your self-control',39],['There’s just no end at the rainbow',43],['Turn away',46],['Another way to be where you didn’t want yourself to go',47],['Let yourself go',52],['Is that a compromise?',54],['So what do you wanna do? What’s your point of view?',60],['There’s a party, screw it, do you wanna go?',64],['A handshake with you, what’s your point of view?',68],['I’m on top of you, I don’t wanna go',71],['’Cause I really wanna stay at your house',75],['In the palace it all works out',79],['But you know how much you fuck me up',82],['I’m done with you, I’m ignoring you',85],['I don’t wanna know, oh',89],['And I’m aware that you were lying in the gutter',100],['’Cause I did everything to be there by your side',108],['So when you tell me I’m the reason, I just can’t believe the lies',116],['And why do I still wanna call you?',123],['So what do you wanna do? What’s your point of view?',129],['There’s a party, screw it, do you wanna go?',133],['A handshake with you, what’s your point of view?',137],['I’m on top of you, I don’t wanna go',141],['’Cause I really wanna stay at your house',144],['In the palace it all works out',148],['But you know how much you fuck me up',152],['I’m done with you, I’m ignoring you',155],['I don’t wanna know, oh',158],['I don’t know where I’m going',170],['So, get away',175],['Another way to feel what you didn’t want yourself to know',178],['And let yourself go',182],['You know you didn’t lose your self-control',185],['There’s just no end at the rainbow',189],['Turn away',192],['Another way to be where you didn’t want yourself to go',193],['And let yourself go',197],['Is that a compromise?',200],['So what do you wanna do? What’s your point of view?',209],['There’s a party, screw it, do you wanna go?',214],['A handshake with you, what’s your point of view?',217],['I’m on top of you, I don’t wanna go',221],['’Cause I really wanna stay at your house',225],['In the palace it all works out',229],['But you know how much you fuck me up',232],['I’m done with you, I’m ignoring you',235],['I don’t wanna know, oh',239]
];
const els=lines.map(([text])=>{const e=document.createElement('div');e.className='lyric';e.textContent=text;lyricsBox.appendChild(e);return e});
const fmt=s=>{if(!Number.isFinite(s))return'00:00';return String(Math.floor(s/60)).padStart(2,'0')+':'+String(Math.floor(s%60)).padStart(2,'0')};
let active=-1,follow=true,scrollTimer=null,programmatic=false;
function indexAt(t){let i=-1;for(let n=0;n<lines.length;n++){if(t>=lines[n][1])i=n;else break}return i}
function center(i,smooth=true){if(i<0||!els[i])return;const top=els[i].offsetTop-(lyricsBox.clientHeight/2)+(els[i].offsetHeight/2);programmatic=true;lyricsBox.scrollTo({top:Math.max(0,top),behavior:smooth?'smooth':'auto'});clearTimeout(scrollTimer);scrollTimer=setTimeout(()=>programmatic=false,450)}
function render(force=false){const i=indexAt(audio.currentTime);if(force||i!==active){active=i;els.forEach((e,n)=>{e.classList.toggle('active',n===i);e.classList.toggle('past',n<i)});if(follow)center(i)}}
play.onclick=()=>audio.paused?audio.play():audio.pause();
restart.onclick=()=>{audio.currentTime=0;follow=true;sync.classList.add('hidden');audio.play();render(true)};
mute.onclick=()=>{audio.muted=!audio.muted;mute.textContent=audio.muted?'🔇':'🔊'};
audio.onloadedmetadata=()=>{seek.max=audio.duration;duration.textContent=fmt(audio.duration);render(true)};
audio.onplay=()=>{play.textContent='Ⅱ';status.textContent='PLAYING'};
audio.onpause=()=>{play.textContent='▶';status.textContent='PAUSED'};
audio.onended=()=>{play.textContent='▶';status.textContent='TRANSMISSION ENDED'};
audio.ontimeupdate=()=>{seek.value=audio.currentTime;current.textContent=fmt(audio.currentTime);time.textContent=fmt(audio.currentTime);render()};
seek.oninput=()=>{audio.currentTime=Number(seek.value);follow=true;sync.classList.add('hidden');render(true)};
lyricsBox.addEventListener('wheel',()=>{if(!programmatic){follow=false;sync.classList.remove('hidden')}} ,{passive:true});
lyricsBox.addEventListener('touchstart',()=>{follow=false;sync.classList.remove('hidden')},{passive:true});
sync.onclick=()=>{follow=true;sync.classList.add('hidden');render(true);center(active)};
els.forEach((e,i)=>e.onclick=()=>{audio.currentTime=lines[i][1];follow=true;sync.classList.add('hidden');render(true);center(i)});
render(true);


// Extra navigation: PageUp/PageDown scroll the lyric panel without moving the player.
lyricsBox.addEventListener('keydown', e => {
  if (e.key === 'PageDown') { e.preventDefault(); follow=false; sync.classList.remove('hidden'); lyricsBox.scrollBy({top: lyricsBox.clientHeight * 0.75, behavior:'smooth'}); }
  if (e.key === 'PageUp') { e.preventDefault(); follow=false; sync.classList.remove('hidden'); lyricsBox.scrollBy({top: -lyricsBox.clientHeight * 0.75, behavior:'smooth'}); }
});
lyricsBox.setAttribute('tabindex','0');

audio.addEventListener('error', () => {
  status.textContent = 'AUDIO ERROR';
  play.textContent = '▶';
});
