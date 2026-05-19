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
