var i = 0
var j = 0
var k = 0

function getRand(min, max) { 
    return Math.floor(Math.random() * (max - min + 1) + min)
}
function unorderArray(lon){
	var unorder_array = []
	while(unorder_array.length<lon){
		var n = getRand(0,(lon-1))
		if(!unorder_array.includes(n)){
			unorder_array.push(n)
		}
	}
	return unorder_array
}

var game = getE('game')
var game_scene = getE('game-scene')
game_scene.style.visibility = 'hidden'
var game_rect = game.getBoundingClientRect()

function setInstrucciones(start){
	var html = ''
	/*if(ismobile){
		html+='<div class="modal-instrucciones-gif"><div onclick="setVideoInstrucciones(this)"><video loop><source type="video/mp4" src="assets/images/instrucciones_sp.mp4" /></video><button></button></div></div>'
	}else{
		html+='<div class="modal-instrucciones-gif"><div onclick="setVideoInstrucciones(this)"><video loop><source type="video/mp4" src="assets/images/instrucciones_pc.mp4" /></video><button></button></div></div>'
	}*/
	
	html+='<p>Selecciona los <span>Equipos de Protección Personal</span> que necesita Juan para quedar idéntico al dibujo que se encuentra en la parte superior izquierda.</p>'
	html+='<p>Haz clic en el botón <span>"Jugar"</span> para comenzar el juego.</p>'
	html+='<p>Cuando identifiques el EPP correcto haz clic en el botón <span>"Detener"</span></p>'
	html+='<p><span>Completa los 3 escenarios para ganar el Juego.</span></p>'

    if(start){
    	setModal({
	    	close:false,
			title:'Instrucciones',
			content:html,
			button:true,
			value:'jugar',
			final:false,
			action:'empezarJuego'
	    })
    }else{
    	setModal({
	    	close:false,
			title:'Instrucciones',
			content:html,
			button:true,
			value:'aceptar',
			final:false,
			action:'seguirJuego'
	    })
    }
}

var animacion_swipe = null
function empezarJuego(){
	getE('cargador').className = 'cargador-on'
	unsetModal(function(){
		game_scene.style.visibility = 'visible'
		getE('home-scene').style.display = 'none'

		/*setTooltip({
			content:'<p><span>¡Viste a Juan para '+oficios[actual_job].name+'!</span><br />Haz clic en las puertas de los casilleros y arrastra  la prenda hacia Juan.</p>',
			delay:4000
		})*/
		
		getE('cargador').className = 'cargador-off'

		startGame()
	})
}

function findPart(id){
	var collection_id = -1
	for(var p = 0;p<elementos.length;p++){
		if(elementos[p].id==id){
			collection_id = p
		}
	}

	return collection_id
}

function findEpp(id,coll){
	var ind = -1
	for(var c = 0;c<coll.length;c++){
		if(coll[c].id==id){
			ind = c
		}
	}
	return ind
}

var actual_job = 0
var actual_job_data = escenarios[actual_job]
var bandas_data = []

function setGame(){
	setFondo()
	//cargar las imagenes de los elementos
	loadElement()
}

var element_i = 0
var element_j = 0
var top_alto = 0

function loadElement(){
	if(element_i==elementos.length){
		//put bands
		putBands()
		
		////////AQUI EMPIEZA TODOO///////
		
		animation_start = setTimeout(function(){
			clearTimeout(animation_start)
			animation_start = null

			getE('cargador').className = 'cargador-off'	
			setInstrucciones(true)
		},1000)
	}else{
		var url = 'assets/images/elementos/p'+(element_i+1)+'-'+(element_j+1)+'.png'

		loadImage({url:url,callBack:function(data){
			elementos[element_i].elementos[element_j].size.w = data.w
			elementos[element_i].elementos[element_j].size.h = data.h
			elementos[element_i].elementos[element_j].url = url
			element_j++
			if(data.h>top_alto){
				top_alto = data.h
			}
			if(element_j==elementos[element_i].elementos.length){
				elementos[element_i].height = top_alto
				top_alto = 0
				element_j = 0
				element_i++
			}
			loadElement()
		}})
	}	
}
function putBands(){
	var bands = actual_job_data.parts
	for(i = 0;i<bands.length;i++){
		var inx = findPart(bands[i])

		var band_wp = document.createElement('div')
		band_wp.className = 'banda-wrap banda-off'
		band_wp.id = 'banda'+bands[i]
		band_wp.style.height = elementos[inx].height+'px'

		var band_div = document.createElement('div')
		band_div.className = 'banda'

		var array = []
		var epp_collection = elementos[inx].elementos
		var unorder = unorderArray(epp_collection.length)
		for(j = 0;j<epp_collection.length;j++){
			var u = unorder[j]
			var div_epp = document.createElement('div')
			div_epp.id = 'epp-'+elementos[inx].id+'-'+epp_collection[u].id
			div_epp.className = 'banda-epp banda-epp-pos-'+j
			div_epp.setAttribute('pos',j)
			div_epp.setAttribute('ind',epp_collection[u].id)
			div_epp.style.width = epp_collection[u].size.w+'px'
			div_epp.style.height = epp_collection[u].size.h+'px'
			div_epp.innerHTML = '<div class="banda-epp-img banda-epp-item-out" style="background-image:url('+epp_collection[u].url+'); top:'+epp_collection[u].size.y+'px; left:'+epp_collection[u].size.x+'px;"></div>'
			band_div.appendChild(div_epp)
			array.push(div_epp)
		}


		band_wp.appendChild(band_div)
		getE('bandas').appendChild(band_wp)
		bandas_data.push({
			id:bands[i],
			epps:array
		})
	}
	console.log(bandas_data)
}

function setFondo(){
	getE('fondo').className = 'fondo-'+actual_job_data.id
}

function vestirPersonajePista(){
	var partes = actual_job_data.parts
	var epps = actual_job_data.epps
	var v = 0;
	for(v = 0;v<elementos.length;v++){
		getE('personaje-card-p'+elementos[v].id).style.visibility = 'hidden'
		/*if(partes.includes(elementos[v].id)){
			getE('personaje-card-p'+elementos[v].id).style.visibility = 'visible'
		}else{
			
		}*/
	}
	for(v = 0;v<partes.length;v++){
		var epp_coll = elementos[findPart(partes[v])].elementos

		var ind = findEpp(epps[v],epp_coll)
		var epp_data = epp_coll[ind]
		
		var part = getE('personaje-card-p'+partes[v])
		part.style.visibility = 'visible'
		part.style.width = epp_data.size.w+'px'
		part.style.height = epp_data.size.h+'px'

		var div = part.getElementsByTagName('div')[0]
		div.style.backgroundImage = 'url('+epp_data.url+')'
		div.style.left = epp_data.size.x+'px'
		div.style.top = epp_data.size.y+'px'
		items_selected.push(-1)
	}

	//ordenar orden de las bandas
	orden_bandas = actual_job_data.parts.sort()

	getE('card-cont').className = 'card-on'
	if(actual_job_data.id==1){
		getE('personaje-card').className = 'personaje-2'
		getE('personaje-main').className = 'personaje-2'
	}else if(actual_job_data.id==2){
		getE('personaje-card').className = 'personaje-1'
		getE('personaje-main').className = 'personaje-1'
	}else if(actual_job_data.id==3){
		getE('personaje-card').className = 'personaje-3'
		getE('personaje-main').className = 'personaje-3'
	}
}

//aqui se empieza en forma
var animacion_pista = null
function startGame(){
	vestirPersonajePista()

	animacion_pista = setTimeout(function(){
		clearTimeout(animacion_pista)
		animacion_pista = null
		getE('card-cont').className = 'card-off'

		findBanda()
	},4000)
	
}

/************************************************/

var animacion_rueda = null
var animacion_epp = null

var actual_banda_ind = 0
var actual_banda = 0//para array de los divs -> 4/5
var actual_banda2 = 0//para array elementos -> 6
var actual_banda_id = 0

var orden_bandas = []
var items_selected = []
var epp_central = null
var epp_central_data = null

function findBanda(){
	for(var b = 0;b<bandas_data.length;b++){
		if(bandas_data[b].id==orden_bandas[actual_banda_ind]){
			actual_banda = b
		}
	}
	for(var b2 = 0;b2<elementos.length;b2++){
		if(elementos[b2].id==orden_bandas[actual_banda_ind]){
			actual_banda2 = b2
		}
	}
	actual_banda_id = orden_bandas[actual_banda_ind]
	console.log(actual_banda_id,actual_banda,actual_banda2)

	//banda visible
	getE('banda'+actual_banda_id).classList.remove('banda-off')
	getE('banda'+actual_banda_id).classList.add('banda-on')
	//poner a aparecer los epp
	for(i = 0;i<bandas_data[actual_banda].epps.length;i++){
		var equipo = bandas_data[actual_banda].epps[i]
		var equipo_sub = equipo.getElementsByTagName('div')[0]
		equipo_sub.classList.remove('banda-epp-item-out')
		equipo_sub.classList.add('banda-epp-item-in')
	}

	animacion_epp = setTimeout(function(){
		clearTimeout(animacion_epp)
		animacion_epp = null
		for(i = 0;i<bandas_data[actual_banda].epps.length;i++){
			var equipo = bandas_data[actual_banda].epps[i]
			var equipo_sub = equipo.getElementsByTagName('div')[0]
			equipo_sub.classList.remove('banda-epp-item-in')
		}

		animarRueda()
	},500)
}

function findIdEpp(id){
	var ind = -1
	for(k = 0;k<elementos[actual_banda2].elementos.length;k++){
		if(elementos[actual_banda2].elementos[k].id==id){
			ind = k
		}
	}
	return ind
}

function animarRueda(){
	//poner a correr todo
	
	for(i = 0;i<bandas_data[actual_banda].epps.length;i++){
		var equipo = bandas_data[actual_banda].epps[i]
		var actual_pos = Number(equipo.getAttribute('pos'))
		var new_pos = actual_pos-1
		if(new_pos<0){
			new_pos = 3
		}
		if(new_pos==2){
			epp_central = equipo
		}		
		getE(equipo.id).setAttribute('pos',new_pos)
		getE(equipo.id).className = 'banda-epp banda-epp-pos-'+new_pos
	}

	animacion_rueda = setTimeout(function(){
		//ya paró, pongamos texto y esperemos 1 segundo
		epp_central_data = elementos[actual_banda2].elementos[findIdEpp(epp_central.getAttribute('ind'))]
		getE('tag-txt').innerHTML = epp_central_data.nombre
		getE('tag-txt').className = "tag-txt-on"
		getE('detener-btn').className = "detener-btn-on"

		animacion_rueda = setTimeout(function(){
			clearTimeout(animacion_rueda)
			animacion_rueda = null

			//seguir moviendo
			getE('tag-txt').className = "tag-txt-off"
			getE('detener-btn').className = "detener-btn-off"
			animarRueda()
		},1500)
	},400)
}

function detenerRueda(){
	clearTimeout(animacion_rueda)
	animacion_rueda = null

	getE('tag-txt').className = "tag-txt-off"
	getE('detener-btn').className = "detener-btn-off"

	//registrar la ropa seleccionada
	items_selected[actual_banda_ind] = epp_central_data.id

	//continuar siguiente banda
	actual_banda_ind++
	if(actual_banda_ind==orden_bandas.length){
		//pasar estado de revisión
	}else{
		findBanda()
	}
}

////////////////GAME FUNCITONS///////////////////////

function endGame(){
	
}

function repeatGame(){//repetir por ganar el juego
	location.reload()
	//unsetModal(function(){
		
	//})
}

function reiniciarJuego(){//reiniciar, por acabarse el tiempo
	
}

function continuarJuego(){
	
}
function seguirJuego(){//funcion para el modal
	unsetModal(function(){
		continuarJuego()
	})
}

function getE(idname){
	return document.getElementById(idname)
}

function clickAudio(btn){
	if(btn.className=='music-on'){
		cronometro_mp3.volume = 0
		btn.className = 'music-off'
	}else{
		cronometro_mp3.volume = 1
		btn.className = 'music-on'
	}
}