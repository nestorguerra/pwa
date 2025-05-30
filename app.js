function load(){
  const list=document.getElementById('notes');
  list.innerHTML='';
  const notes=JSON.parse(localStorage.getItem('notes')||'[]');
  notes.forEach((n,i)=>{
    const li=document.createElement('li');
    li.textContent=n.text+' - '+new Date(n.date).toLocaleString();
    li.addEventListener('click',()=>{ if(confirm('Eliminar nota?')){ notes.splice(i,1); localStorage.setItem('notes',JSON.stringify(notes)); load(); }});
    list.appendChild(li);
  });
}
document.getElementById('addBtn').addEventListener('click',()=>{
  const text=document.getElementById('newNote').value.trim();
  if(!text) return;
  const notes=JSON.parse(localStorage.getItem('notes')||'[]');
  notes.unshift({text:text, date:Date.now()});
  localStorage.setItem('notes',JSON.stringify(notes));
  document.getElementById('newNote').value='';
  load();
});
if('serviceWorker' in navigator){
  navigator.serviceWorker.register('sw.js');
}
load();