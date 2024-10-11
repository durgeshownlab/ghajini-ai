
const playRingtone = async ()=>{
  const audio = new Audio('/ringtone/Nice-sound.mp3')
  await audio.play();
}

export default playRingtone