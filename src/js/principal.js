import { GoogleMapsApi } from './google-maps-api'
import { DataDashboard } from './dashboard'
const MarkerClusterer = require('node-js-marker-clusterer')
import '../assets/css/reset.css'
import '../assets/css/estilo.css'
import * as Papa from 'papaparse'
import { Chart } from 'chart.js'



let mapa, divHtml, googleMapsApi, comboUf, comboMunicipio, infoWindow,
  markers, markerClusterer, btnFiltrar, estabelecimentos, initLatLng,
  mapEstabMarker, animatedMarker, trClicked, loadMap, inputFile, progresso, fieldArquivos, fieldFiltros, dataDashboard,grafico, chart

chart=null  
comboMunicipio = document.getElementById('comboMunicipio')
fieldArquivos = document.getElementById('arquivos')
fieldFiltros = document.getElementById('filtros')
comboUf = document.getElementById('comboUf')
btnFiltrar = document.getElementById('btn-filtrar')
inputFile = document.getElementById('inputFile')
progresso = document.getElementById('progresso')
grafico = document.getElementById('grafico').getContext('2d')
initLatLng = { lat: -13.6628064, lng: -69.6464904 }
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
    divHtml.classList.remove(loadMap)
    iniciaFormulario()
  })

function criarMapa(api) {
  mapa = new api.Map(divHtml, {
    center: initLatLng,
    zoom: 2
  })
}

function iniciaFormulario() {
  comboUf.addEventListener('change', carregarMunicipios)
  inputFile.addEventListener('change', carregarArquivo, false)
  btnFiltrar.addEventListener('click', carregaEstabelecimentos)
}



function carregarArquivo() {
  fieldArquivos.classList.add('load-field')
  fieldFiltros.classList.add('load-field')
  let file = this.files[0]
  if (this.files.length > 0) {
    convertToJSON(file)
  } else {
    window.alert('Você deve selecionar um arquivo')
  }
}

function convertToJSON(zip) {
  Papa.parse(zip, {
    header: true,
    dynamicTyping: true,
    fastMode: true,
    complete: function (results, file) {
      estabelecimentos = results.data
      fieldArquivos.classList.remove('load-field')
      carregarEstados()
    },
    trimHeaders: true,
    transformHeader: function (header) {
      return header.replace(' ', '_')
    }
  })
}

function carregarEstados() {
  limparElementoCombo(comboUf)
  let ufs = estabelecimentos.map((e) => e.UF)
    .filter((value, index, array) => {
      if (array.indexOf(value) == index && value) {
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
    if (a > b) return 1
    if (a < b) return -1
    return 0
  })
}

function carregarMunicipios(event) {
  fieldFiltros.classList.add('load-field')
  limparElementoCombo(comboMunicipio)
  let uf = event.target.value
  console.log(uf)
  let municipios = estabelecimentos
    .filter(value => value.UF === uf)
    .map(e => e.MUNICIPIO)
    .filter((value, index, array) => {
      if (array.indexOf(value) == index && value) { return true }
      else { return false }
    })

  for (let municipio of ordenarEmOrdemAlfabetica(municipios)) {
    let optionTag = document.createElement('option')
    optionTag.setAttribute('value', municipio)
    optionTag.innerHTML = municipio
    comboMunicipio.appendChild(optionTag)
  }
  fieldFiltros.classList.remove('load-field')
}









/*   fetch(`http://servicodados.ibge.gov.br/api/v1/localidades/estados/${id}/municipios`)
    .then(response => response.json())
    .then(json => json.map(data => { return { id: data.id, nome: data.nome } }))
    .then(municipios => {
      for (let municipio of ordenarEmOrdemAlfabetica(municipios)) {
        let optionTag = document.createElement('option')
        optionTag.setAttribute('value', municipio.id)
        optionTag.innerHTML = municipio.nome
        comboMunicipio.appendChild(optionTag)
      }
    }) */


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
  let municipio = comboMunicipio.value
  buscarEstabelecimentos(municipio)
}

function resetMapa() {
  mapa.panTo(initLatLng)
  mapa.setZoom(5)
}


function buscarEstabelecimentos(municipio) {
  let estabelecimentosFiltrados = estabelecimentos.filter(value => value.MUNICIPIO === municipio)
  console.table(estabelecimentosFiltrados)
  dataDashboard = new DataDashboard(estabelecimentosFiltrados)
  grafico.clear()

  chart = new Chart(grafico, {
    type: 'polarArea',
    data: {
      labels: ['Estabelecimentos sem geoLocalização', 'Totais de estabelecimentos', 'Estabelecimentos com geolocalização'],
      datasets: [{
        label: '# of Votes',
        data: [dataDashboard.totalEstabelecimentosSemGeo, dataDashboard.totalEstabelecimentos, dataDashboard.totalEstabelecimentosComGeo],
        backgroundColor: [
          'rgba(226, 21, 21, 0.2)',
          'rgba(27, 95, 192, 0.2)',
          'rgba(8, 140, 30, 0.2)'
        ],
        borderColor: [
          'rgba(226, 21, 21, 1)',
          'rgba(27, 95, 192, 1)',
          'rgba(8, 140, 30, 1)'
        ],
        borderWidth: 0.5
      }]

    },
    options: {      
      maintainAspectRatio: true,
      legend: {
        display: true,
        position: 'right'
      },
      rotation: -1.5 * Math.PI
    }
  })

  




  estabelecimentosFiltrados.sort((a, b) => {
    if (a.NOME_FANTASIA > b.NOME_FANTASIA) return 1
    if (a.NOME_FANTASIA < b.NOME_FANTASIA) return -1
    return 0
  })



  criarMarkers(estabelecimentosFiltrados)
  resetMapa()
  exibirEstabelecimentos(estabelecimentosFiltrados)
}


/*   if (estabelecimentos) {
    estabelecimentos.splice(0, estabelecimentos.length);
  }
  fetch(`http://localhost:3000/estabelecimentos?ibge=${id.substring(0, 6)}`)
    .catch(() => alert('erro'))
    .then(response => {
      return response.json()
    }).then(data => {
      estabelecimentos = data
      criarMarkers(estabelecimentos)
      resetMapa()
    }).then(() => {
      exibirEstabelecimentos()
    }) */


function exibirEstabelecimentos(estabelecimentosFiltrados) {

  let areaResultados = document.getElementById('resultados')
  let resultadoVazio = document.getElementById('resultadoVazio')
  if (resultadoVazio) areaResultados.removeChild(document.getElementById('resultadoVazio'))
  let table = document.getElementById('tabela')
  limparElementoTable(table)
  let tr = document.createElement('tr')
  let th1 = document.createElement('th')
  let th2 = document.createElement('th')
  let th3 = document.createElement('th')
  let th4 = document.createElement('th')
  let th5 = document.createElement('th')
  th1.textContent = 'CNES'
  th2.textContent = 'Nome fantasia'
  th3.textContent = 'Latitude'
  th4.textContent = 'Longitude'
  th5.textContent = 'Status'
  tr.appendChild(th1)
  tr.appendChild(th2)
  tr.appendChild(th3)
  tr.appendChild(th4)
  tr.appendChild(th5)
  tr.classList.add('table-head')
  table.appendChild(tr)

  for (let estabelecimento of ordenarEmOrdemAlfabetica(estabelecimentosFiltrados)) {


    let tempMarker = mapEstabMarker.get(estabelecimento.CNES)

    let tr = document.createElement('tr')
    tr.classList.add('tr-estabelecimento')
    let td1 = document.createElement('td')
    td1.textContent = estabelecimento.CNES
    let td2 = document.createElement('td')
    td2.textContent = estabelecimento.NOME_FANTASIA
    let td3 = document.createElement('td')
    td3.textContent = estabelecimento.LATITUDE
    let td4 = document.createElement('td')
    td4.textContent = estabelecimento.LONGITUDE
    let td5 = document.createElement('td')
    let i = document.createElement('i')
    let clss = estabelecimento.LATITUDE ? 'color: green;font-size:20px;padding-bottom:0; margin-bottom:0' : 'color: red;font-size:20px;padding-bottom:0; margin-bottom:0'
    i.setAttribute('class', 'material-icons')
    i.setAttribute('style', clss)
    i.textContent = 'my_location'
    td5.appendChild(i)
    tr.appendChild(td1)
    tr.appendChild(td2)
    tr.appendChild(td3)
    tr.appendChild(td4)
    tr.appendChild(td5)
    table.appendChild(tr)

    if(!estabelecimento.LATITUDE){
      tr.style.backgroundColor='rgba(226, 21, 21, 0.2)'
    }

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
      mapa.setZoom(18)
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