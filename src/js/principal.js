import { GoogleMapsApi } from './google-maps-api'
import { DataDashboard } from './dashboard'
const MarkerClusterer = require('node-js-marker-clusterer')
import '../assets/css/reset.css'
import '../assets/css/estilo.css'
import * as Papa from 'papaparse'
import { Chart } from 'chart.js'
import { LatLonUfs } from './lat-lon-ufs'

let mapa, divHtml, googleMapsApi, comboUf, comboMunicipio, infoWindow,
  markers, markerClusterer, btnFiltrar, estabelecimentos, initLatLng,
  mapEstabMarker, animatedMarker, trClicked, loadMap, inputFile,
  fieldArquivos, fieldFiltros, dataDashboard, canvas01Ctx, chart01, progresso,titleLoadedFile, file

chart01 = null
file=null
comboMunicipio = document.getElementById('comboMunicipio')
fieldArquivos = document.getElementById('arquivos')
fieldFiltros = document.getElementById('filtros')
comboUf = document.getElementById('comboUf')
btnFiltrar = document.getElementById('btn-filtrar')
inputFile = document.getElementById('inputFile')
progresso = document.getElementById('progresso')
titleLoadedFile=document.getElementById('loadedFile')
canvas01Ctx=null
initLatLng = { lat: -10.3333333, lng: -53.2 }
loadMap = 'loadMap'
infoWindow = null
markers = null
markerClusterer = null
estabelecimentos = null
mapa = null
mapEstabMarker = null
animatedMarker = null
trClicked = null
dataDashboard = null
divHtml = document.getElementById('mapa')
divHtml.classList.add(loadMap)

GoogleMapsApi.config()
  .then(api => {
    googleMapsApi = api
    return api
  })
  .then((api) => {
    criarMapa(api)
    divHtml.style.hidden=true
    iniciaFormulario()
  })

function criarMapa(api) {
  mapa = new api.Map(divHtml, {
    center: initLatLng,
    zoom: 4
  })
}

function iniciaFormulario() {
  comboUf.addEventListener('change', carregarMunicipios)
  comboMunicipio.addEventListener('change', centralizarCidadeMapa)
  inputFile.addEventListener('change', carregarArquivo, false)
  btnFiltrar.addEventListener('click', carregaEstabelecimentos)
}

function carregarArquivo() {
  file = this.files[0]
  if (this.files.length > 0) {
    fieldArquivos.classList.add('load-field')
    fieldFiltros.classList.add('load-field')    
    convertToJSON(file)
  }
}

function convertToJSON(zip) {
  Papa.parse(zip, {
    header: true,
    dynamicTyping: true,
    complete: function (results, file) {
      if(results.data[0].IBGE){
        estabelecimentos = results.data
        titleLoadedFile.textContent=file.name
        carregarEstados() 
      }else{
        mostrarErroNoArquivo()
      }
    },
    trimHeaders: true,
    transformHeader: function (header) {
      return header.replace(' ', '_')
    }
  })
}

function mostrarErroNoArquivo(){
  titleLoadedFile.textContent='Arquivo inválido'
  fieldArquivos.classList.remove('load-field')
  fieldFiltros.classList.remove('load-field')
}


function carregarEstados() {
  limparElementoCombo(comboUf)
  fieldArquivos.classList.remove('load-field')
  let ufs = estabelecimentos.map((e) => e.UF)
    .filter((value, index, array) => {
      if (array.indexOf(value) === index && value) {
        return true
      } else {
        return false
      }
    })
  for (let uf of ufs) {
    let optionTag = document.createElement('option')
    optionTag.setAttribute('value', uf)
    optionTag.innerHTML = uf
    comboUf.appendChild(optionTag)
  }
  fieldFiltros.classList.remove('load-field')
}

function ordenarEmOrdemAlfabetica(array) {
  return array.sort((a, b) => {
    if (a.nome > b.nome) return 1
    if (a.nome < b.nome) return -1
    return 0
  })
}

function carregarMunicipios(event) {
  fieldFiltros.classList.add('load-field')
  limparElementoCombo(comboMunicipio)
  let uf = event.target.value
  if(uf==='Selecione'){
    resetMapa()
  }else{
  centralizaUfMapa(uf)
  let municipios = estabelecimentos
    .filter(value => value.UF === uf)
    .map(e => {
      return {nome:e.MUNICIPIO,codigo:e.IBGE}
    })
    .filter((value, index, array) => {
      let i=array.findIndex((current=>current.codigo===value.codigo))
      if (i===index) { return true }
      else { return false }
    })
  for (let municipio of ordenarEmOrdemAlfabetica(municipios)) {
    let optionTag = document.createElement('option')
    optionTag.setAttribute('value', municipio.codigo)
    optionTag.innerHTML = municipio.nome
    comboMunicipio.appendChild(optionTag)
  }

}
fieldFiltros.classList.remove('load-field')
}

function centralizaUfMapa(uf){
  let geoUf=LatLonUfs.get(uf)
  mapa.panTo({lat:geoUf.lat,lng:geoUf.lon})
  mapa.setZoom(7)
}

function centralizarCidadeMapa(){ 
  let ibge=comboMunicipio.value 
  fetch('./lat-lon-munic.json').then(response=>response.json()).then(json=>{
    return json.find(value=>{ 
      let s=new String(value.codigo_ibge)
      if(s.startsWith(ibge)){
        return true
      }else{
        return false
      }
    })
  }).then(mun=>{
    //console.log(`estabelecimento ${mun.codigo_ibge}`)
    mapa.panTo({lat:mun.lat,lng:mun.lon})
    mapa.setZoom(11)
  })    


}


function limparElementoCombo(el) {
  if (el) {
    while (el.firstChild) {
      el.removeChild(el.firstChild)
    }
    let optionTag = document.createElement('option')
    optionTag.setAttribute('value', 'Selecione')
    optionTag.textContent = 'Selecione'
    el.appendChild(optionTag)
  }
}

function limparElementoTable(el) {
  if (el) {
    while (el.firstChild) {
      el.removeChild(el.firstChild)
    }
  }
}

function carregaEstabelecimentos() {
  let ibgeSelecionado = new String(comboMunicipio.value)
  let municipio=ibgeSelecionado.substring(0,7)
  console.log(municipio)
  buscarEstabelecimentos(municipio)
}

function resetMapa() {
  mapa.panTo(initLatLng)
  mapa.setZoom(4)
}

function buscarEstabelecimentos(municipio) {
  let estabelecimentosFiltrados = estabelecimentos.filter(value => value.IBGE == municipio)
  estabelecimentosFiltrados.sort((a, b) => {
    if (a.NOME_FANTASIA > b.NOME_FANTASIA) return 1
    if (a.NOME_FANTASIA < b.NOME_FANTASIA) return -1
    return 0
  })
  console.log(estabelecimentosFiltrados)
  canvas01Ctx = document.getElementById('grafico1').getContext('2d')
  dataDashboard = new DataDashboard(estabelecimentosFiltrados)
  criarMarkers(estabelecimentosFiltrados)
  exibirEstabelecimentos(estabelecimentosFiltrados)
  mostrarGraficos(estabelecimentosFiltrados)
}

function mostrarGraficos(estabelecimentos) {
  if (chart01) {
    chart01.destroy()
  }

  chart01 = new Chart(canvas01Ctx, {
    type: 'polarArea',
    data: {
      labels: [' Sem geolocalização', ' Totais cadastrados', ' Com geolocalização', ' Com geolocalização duvidosa'],
      datasets: [{
        data: [dataDashboard.totalEstabelecimentosSemGeo, dataDashboard.totalEstabelecimentos, dataDashboard.totalEstabelecimentosComGeo, dataDashboard._totalEstabelecimentosGeoDuvidosas.size],
        backgroundColor: [
          'rgba(226, 21, 21, 1)',
          'rgba(27, 95, 192, 1)',
          'rgba(8, 140, 30, 1)',
          'rgba(255, 230, 0, 1)'
        ]
      }]
    },
    options: {
      title: {
        display: true,
        position: 'top',
        fontSize: '14',
        text: 'Geolocalizaçoes'
      },
      maintainAspectRatio: true,
      legend: {
        display: true,
        position: 'right'
      }
    }
  })
}

function exibirEstabelecimentos(estabelecimentosFiltrados) {
  let areaResultados = document.getElementById('resultados')
  let resultadoVazio = document.getElementById('resultadoVazio')
  if (resultadoVazio) areaResultados.removeChild(document.getElementById('resultadoVazio'))
  let table = document.getElementById('tabela')
  limparElementoTable(table)
  let tr = document.createElement('tr')
  let th0 = document.createElement('th')
  let th1 = document.createElement('th')
  let th2 = document.createElement('th')
  let th3 = document.createElement('th')
  let th4 = document.createElement('th')
  let th5 = document.createElement('th')
  th0.textContent = 'ID'
  th1.textContent = 'CNES'
  th2.setAttribute('style', 'text-align: left')
  th2.textContent = 'Nome fantasia'
  th3.textContent = 'Latitude'
  th4.textContent = 'Longitude'
  th5.textContent = 'Status'
  tr.appendChild(th0)
  tr.appendChild(th1)
  tr.appendChild(th2)
  tr.appendChild(th3)
  tr.appendChild(th4)
  tr.appendChild(th5)
  tr.classList.add('table-head')
  table.appendChild(tr)

  let indice = 1
  for (let estabelecimento of ordenarEmOrdemAlfabetica(estabelecimentosFiltrados)) {
    let tempMarker = mapEstabMarker.get(estabelecimento.CNES)
    let tr = document.createElement('tr')
    tr.classList.add('tr-estabelecimento')
    let td0 = document.createElement('td')
    td0.textContent = indice++
    let td1 = document.createElement('td')
    td1.textContent = estabelecimento.CNES
    let td2 = document.createElement('td')
    td2.textContent = estabelecimento.NOME_FANTASIA
    td2.setAttribute('style', 'text-align: left')
    let td3 = document.createElement('td')
    td3.textContent = estabelecimento.LATITUDE
    let td4 = document.createElement('td')
    td4.textContent = estabelecimento.LONGITUDE
    let td5 = document.createElement('td')
    let icone = document.createElement('i')
    let clss = () => {
      if (estabelecimento.LATITUDE) {  
        if(dataDashboard.totalEstabelecimentosGeoDuvidosas.has(estabelecimento.CNES)){
          return 'color: rgba(255, 230, 0, 1); font-size:16px'
        }else{
          return 'color: rgba(8, 140, 30, 1); font-size:16px'
        }
        }else{
        return 'color: rgba(226, 21, 21, 1); font-size:16px'
      }
    }
    icone.setAttribute('class', 'material-icons')
    icone.setAttribute('style', clss())
    icone.textContent = 'my_location'
    td5.appendChild(icone)
    tr.appendChild(td0)
    tr.appendChild(td1)
    tr.appendChild(td2)
    tr.appendChild(td3)
    tr.appendChild(td4)
    tr.appendChild(td5)
    table.appendChild(tr)
    tr.addEventListener('click', () => {
      mapEstabMarker.forEach((k, v) => {
        k.setAnimation(null)
      })
      tempMarker.setAnimation(googleMapsApi.Animation.BOUNCE)
      if (trClicked) {
        trClicked.classList.remove('tr-clicked')
      }
      trClicked = tr
      animatedMarker = estabelecimento.CNES
      mapa.setZoom(21)
      mapa.panTo({ lat: Number(estabelecimento.LATITUDE), lng: Number(estabelecimento.LONGITUDE) })
      tr.classList.add('tr-clicked')
    })
  }
}

function toggleBounce(marker) {
  if (marker.getAnimation() != null) {
    marker.setAnimation(null);
  } else {
    marker.setAnimation(googleMapsApi.Animation.BOUNCE);
  }
}

function criarMarkers(estabelecimentos) {
  //Limpa todas as markers do mapa
  if (markers) {
    markerClusterer.clearMarkers()
  }
  mapEstabMarker = new Map()
  markers = estabelecimentos.map((location) => {
    let marker = new googleMapsApi.Marker({
      position: new googleMapsApi.LatLng(location.LATITUDE, location.LONGITUDE),
      cursor: 'pointer',
      map: mapa,
      draggable: false,
    })
    addDadosNoEstabelecimento(marker, location)
    mapEstabMarker.set(location.CNES, marker)
    return marker
  })
  let mcOptions = {
    gridSize: 60,
    maxZoom: 15,
    imagePath: 'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m'
  }
  markerClusterer = new MarkerClusterer(mapa, markers, mcOptions)
}

function addDadosNoEstabelecimento(marker, dados) {
  marker.addListener('click', function () {
    if (infoWindow) {
      infoWindow.close()
    }
    infoWindow = new googleMapsApi.InfoWindow()
    infoWindow.setContent(`
          <div class="info-window">
          <p class="info-window title">${dados.RAZAO_SOCIAL}</p>
          <p>${dados.NOME_FANTASIA}</p>
          <p>${dados.LOGRADOURO}, ${dados.NUMERO}</p>    
          <p>${dados.MUNICIPIO} - ${dados.UF}</p>
          <p>${dados.BAIRRO}</p>
          <p>${dados.CEP}</p>
          </div>`)
    infoWindow.open(marker.get('map'), marker);
  })
}