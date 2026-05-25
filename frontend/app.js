const API_BASE = '/patients'

function el(id){ return document.getElementById(id) }

function formatMetric(v, suffix=''){ return `${v}${suffix}` }

async function fetchPatients(){
  try{
    const res = await fetch(API_BASE)
    if(!res.ok) throw new Error('fetch failed')
    return await res.json()
  }catch(e){
    console.warn('Could not fetch patients, using sample fallback', e)
    return []
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
    card.innerHTML = `
      <div class="card-head">
        <h3>${p.name} <span class="muted">(id:${p.id})</span></h3>
        ${statusBadge(p.status || 'unknown')}
      </div>
      <div class="metrics">
        <div class="metric"><strong>${formatMetric(vitals.heartRate||'-',' bpm')}</strong><div class="muted">Heart</div></div>
        <div class="metric"><strong>${formatMetric(vitals.spo2||'-','%')}</strong><div class="muted">SpO₂</div></div>
        <div class="metric"><strong>${formatMetric(vitals.temp||'-','°C')}</strong><div class="muted">Temp</div></div>
      </div>
      <div class="card-actions">
        <button data-id="${p.id}" class="view">View</button>
      </div>
    `
    elCards.appendChild(card)
  })

  // attach view handlers
  elCards.querySelectorAll('button.view').forEach(btn=>{
    btn.addEventListener('click', ()=>showDetail(btn.dataset.id, patients))
  })
}

function showDetail(id, patients){
  const p = patients.find(x=>String(x.id)===String(id))
  if(!p) return
  const content = document.getElementById('modalContent')
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
    const created = await res.json()
    ev.target.reset()
    await refreshAndRender()
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

// initial load
refreshAndRender()
