const levels = {
    inicio: [{word:"RATO",hint:"R inicial"}],
    meio: [{word:"CARRO",hint:"R forte no meio"}],
    final: [{word:"AMOR",hint:"R no final"}],
    encontro: [{word:"PRATO",hint:"PR"}]
};

let selectedWord="",hint="";
let guessed=[],errors=0;
let hits=0,miss=0,tries=0;
let audioURL="";

const hangmanStages = [
` +---+
 |   |
     |
     |
     |
     |
=========`,
` +---+
 |   |
 O   |
     |
     |
     |
=========`,
` +---+
 |   |
 O   |
 |   |
     |
     |
=========`,
` +---+
 |   |
 O   |
/|   |
     |
     |
=========`,
` +---+
 |   |
 O   |
/|\\  |
     |
     |
=========`,
` +---+
 |   |
 O   |
/|\\  |
/    |
     |
=========`,
` +---+
 |   |
 O   |
/|\\  |
/ \\  |
     |
=========`
];

// VOZ
function speak(text){
 let u=new SpeechSynthesisUtterance(text);
 u.lang="pt-BR";
 speechSynthesis.speak(u);
}

// INICIAR
function startGame(){
 let lvl=document.getElementById("level").value;
 let obj=levels[lvl][0];

 selectedWord=obj.word;
 hint=obj.hint;

 guessed=[]; errors=0;

 document.getElementById("hint").textContent="💡 "+hint;
 document.getElementById("errors").textContent=0;
 document.getElementById("message").textContent="";

 createButtons();
 updateWord();
 updateHangman();

 speak("Novo desafio. Atenção ao R.");
}

// BOTÕES
function createButtons(){
 let div=document.getElementById("letters");
 div.innerHTML="";

 for(let i=65;i<=90;i++){
  let l=String.fromCharCode(i);
  let b=document.createElement("button");
  b.textContent=l;
  b.className="neutral";
  b.onclick=()=>guess(l,b);
  div.appendChild(b);
 }
}

// PALAVRA
function updateWord(){
 let display=selectedWord.split("")
 .map(l=>guessed.includes(l)?l:"_")
 .join(" ");

 document.getElementById("word").textContent=display;

 if(!display.includes("_")){
  hits++; tries++;
  updatePanel();
  document.getElementById("message").textContent="🎉 Acertou!";
  speak("Muito bem! "+selectedWord);
 }
}

// FORCA
function updateHangman(){
 document.getElementById("hangman").textContent=hangmanStages[errors];
}

// CHUTE
function guess(l,b){
 b.disabled=true;

 if(selectedWord.includes(l)){
  guessed.push(l);
  b.className="success";
 }else{
  errors++; miss++;
  document.getElementById("errors").textContent=errors;
  b.className="danger";
  updateHangman();
 }

 updateWord();

 if(errors>=6){
  tries++;
  updatePanel();
  document.getElementById("message").textContent="Fim! "+selectedWord;
  speak("A palavra era "+selectedWord);
 }
}

// PAINEL
function updatePanel(){
 document.getElementById("hits").textContent=hits;
 document.getElementById("miss").textContent=miss;
 document.getElementById("tries").textContent=tries;
}

// GRAVAÇÃO
async function startRecording(){
 let stream=await navigator.mediaDevices.getUserMedia({audio:true});
 let rec=new MediaRecorder(stream);
 let chunks=[];

 rec.ondataavailable=e=>chunks.push(e.data);

 rec.onstop=()=>{
  let blob=new Blob(chunks);
  audioURL=URL.createObjectURL(blob);
 };

 rec.start();
 speak("Fale a palavra");
 setTimeout(()=>rec.stop(),3000);
}

// REPRODUÇÃO
function playAudio(){
 if(audioURL){
  new Audio(audioURL).play();
 }
}

// START
startGame();