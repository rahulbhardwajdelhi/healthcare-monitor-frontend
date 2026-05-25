const API_BASE = '/patients'

function el(id){ return document.getElementById(id) }

async function fetchPatients(){
  try{
    const res = await fetch(API_BASE)
    if(!res.ok) throw new Error('fetch failed')
    return await res.json()
  }catch(e){
    console.warn('Could not fetch patients, using fallback', e)
    // fallback demo data
    return [
      { id: 1, name: 'Alice', status: 'stable', lastChecked: new Date(), vitals: { heartRate:72, spo2:98, temp:36.7 } },
      { id: 2, name: 'Bob', status: 'monitored', lastChecked: new Date(), vitals: { heartRate:88, spo2:95, temp:37.2 } },
      { id: 3, name: 'Carlos', status: 'stable', lastChecked: new Date(), vitals: { heartRate:64, spo2:99, temp:36.4 } }
    ]
  }
}

function statusBadge(status){
  return `<span class="badge ${status}">${status}</span>`
}

function renderCards(patients){
  const elCards = el('cards')
  elCards.innerHTML = ''
  if(!patients || patients.length===0){
    elCards.innerHTML = '<div class="empty">No patients found</div>'
    return
  }

  patients.forEach(p=>{
    const card = document.createElement('article')
    card.className = 'card'
    const vitals = p.vitals || {}
    const initials = (p.name||'?').split(' ').map(s=>s[0]).slice(0,2).join('').toUpperCase()
    card.innerHTML = `
      <div class="card-head">
        <div style="display:flex;align-items:center;gap:12px">
          <div class="avatar">${initials}</div>
          <h3>${p.name} <span class="muted">(id:${p.id})</span></h3>
        </div>
        ${statusBadge(p.status || 'unknown')}
      </div>
      <div class="metrics">
        <div class="metric"><strong>${vitals.heartRate? vitals.heartRate + ' bpm':'-'}</strong><div class="muted">Heart</div></div>
        <div class="metric"><strong>${vitals.spo2? vitals.spo2 + '%':'-'}</strong><div class="muted">SpO₂</div></div>
        <div class="metric"><strong>${vitals.temp? vitals.temp + '°C':'-'}</strong><div class="muted">Temp</div></div>
      </div>
      <div class="card-actions">
        <button data-id="${p.id}" class="view">View</button>
      </div>
    `
    elCards.appendChild(card)
  })

  elCards.querySelectorAll('button.view').forEach(btn=>{
    btn.addEventListener('click', ()=>showDetail(btn.dataset.id, patients))
  })
}

function showDetail(id, patients){
  const p = patients.find(x=>String(x.id)===String(id))
  if(!p) return
  const content = el('modalContent')
  content.innerHTML = `
    <h3>${p.name} <span class="muted">(id:${p.id})</span></h3>
    <div class="muted">Status: ${p.status || 'n/a'}</div>
    <div style="margin-top:10px">Last checked: ${p.lastChecked ? new Date(p.lastChecked).toLocaleString() : '—'}</div>
    <pre style="margin-top:12px">${JSON.stringify(p.vitals||{}, null, 2)}</pre>
  `
  const modal = el('modal')
  modal.classList.remove('hidden')
  modal.setAttribute('aria-hidden','false')
}

function closeModal(){
  const modal = el('modal')
  modal.classList.add('hidden')
  modal.setAttribute('aria-hidden','true')
}

async function refreshAndRender(){
  const data = await fetchPatients()
  currentData = data
  applyFilter()
}

let currentData = []
let autoInterval = null

function applyFilter(){
  const q = (el('search').value||'').toLowerCase().trim()
  const filtered = currentData.filter(p=>{
    return String(p.id).includes(q) || (p.name||'').toLowerCase().includes(q)
  })
  renderCards(filtered)
}

// wire UI
el('refresh').addEventListener('click', ()=> refreshAndRender())
el('search').addEventListener('input', ()=> applyFilter())
el('closeModal').addEventListener('click', closeModal)
el('modal').addEventListener('click', (e)=>{ if(e.target.id==='modal') closeModal() })

el('addForm').addEventListener('submit', async (ev)=>{
  ev.preventDefault()
  const fm = new FormData(ev.target)
  const body = { name: fm.get('name'), status: fm.get('status'), vitals: {} }
  try{
    const res = await fetch(API_BASE, { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(body) })
    if(!res.ok) throw new Error('create failed')
    await refreshAndRender()
    ev.target.reset()
  }catch(err){
    alert('Could not add patient: '+err.message)
  }
})

el('autoToggle').addEventListener('click', ()=>{
  if(autoInterval){
    clearInterval(autoInterval); autoInterval=null; el('autoToggle').textContent='Auto: Off'
  } else {
    autoInterval = setInterval(refreshAndRender, 10000); el('autoToggle').textContent='Auto: On'
  }
})

// keyboard shortcuts: r = refresh, a = quick add prompt
document.addEventListener('keydown', (e)=>{
  if(e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return
  if(e.key === 'r') refreshAndRender()
  if(e.key === 'a') {
    const name = prompt('Quick add patient name:')
    if(name) fetch(API_BASE, { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ name, status:'monitored' }) }).then(refreshAndRender).catch(()=>alert('Could not add'))
  }
})

// initial load
refreshAndRender()
const samplePatients = [
  { id: 1, name: 'Alice', heart: 72, spo2: 98, temp: 36.7 },
  { id: 2, name: 'Bob', heart: 88, spo2: 95, temp: 37.2 },
  { id: 3, name: 'Carlos', heart: 64, spo2: 99, temp: 36.4 },
  { id: 4, name: 'Dana', heart: 102, spo2: 92, temp: 38.1 }
]

function formatMetric(v, suffix=''){
  return `${v}${suffix}`
}

function renderCards(){
  const el = document.getElementById('cards')
  el.innerHTML = ''
  samplePatients.forEach(p=>{
    const card = document.createElement('article')
    card.className = 'card'
    card.innerHTML = `
      <h3>${p.name} <span class="muted">(id:${p.id})</span></h3>
      <div><span class="metric">${formatMetric(p.heart,' bpm')}</span></div>
      <div class="muted">SpO₂: ${formatMetric(p.spo2,'%')} • Temp: ${formatMetric(p.temp,'°C')}</div>
    `
    el.appendChild(card)
  })
}

function randomize(){
  samplePatients.forEach(p=>{
    p.heart = Math.max(45, Math.round(p.heart + (Math.random()*20-10)))
    p.spo2 = Math.max(85, Math.round(p.spo2 + (Math.random()*6-3)))
    p.temp = Math.round((p.temp + (Math.random()*0.6-0.3))*10)/10
  })
  renderCards()
}

document.getElementById('refresh').addEventListener('click', ()=>{
  randomize()
})

// initial render
renderCards()
