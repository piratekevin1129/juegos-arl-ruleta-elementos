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
		band_wp.className = 'banda-wrap'
		band_wp.id = 'banda'+bands[i]
		band_wp.style.height = elementos[inx].height+'px'

		var band_div = document.createElement('div')
		band_div.className = 'banda'
		
		var epp_collection = elementos[inx].elementos
		for(j = 0;j<epp_collection.length;j++){
			var div_epp = document.createElement('div')
			div_epp.className = 'banda-epp banda-epp-pos-'+(j+1)
			div_epp.style.width = epp_collection[j].size.w+'px'
			div_epp.style.height = epp_collection[j].size.h+'px'
			div_epp.innerHTML = '<div class="banda-epp-img" style="background-image:url('+epp_collection[j].url+'); top:'+epp_collection[j].size.y+'px; left:'+epp_collection[j].size.x+'px;"></div>'
			band_div.appendChild(div_epp)
		}

		band_wp.appendChild(band_div)
		getE('bandas').appendChild(band_wp)
	}
	console.log("listo")
}

//aqui se empieza en forma
function startGame(){
	vestirPersonajePista()
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
		part.className = 'prenda'+epps[v]
		part.style.visibility = 'visible'
		var div = part.getElementsByTagName('div')[0]
		div.style.width = epp_data.size.w+'px'
		div.style.height = epp_data.size.h+'px'
		div.style.backgroundImage = 'url('+epp_data.url+')'
		
		part.style.left = epp_data.size.x+'px'

	}

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