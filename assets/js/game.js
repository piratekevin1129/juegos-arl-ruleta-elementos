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

		//put bands
		putBands()
		putZonas()
		startGame(false)
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
		//hacer el listado
		for(i = 0;i<escenarios.length;i++){
			var lista = document.createElement('div')
			lista.className = 'listado-item listado-item-no'
			lista.id = 'listado-item-'+escenarios[i].id
			lista.innerHTML = '<p>'+escenarios[i].nombre+'</p><div></div>'
			getE('listado').appendChild(lista)

			//para el responsive
			var lista_r = document.createElement('div')
			lista_r.className = 'listado-responsive-item listado-responsive-item-no'
			lista_r.id = 'listado-item-r-'+escenarios[i].id
			getE('listado-responsive').appendChild(lista_r)
		}
		var lista_t = document.createElement('div')
		lista_t.className = 'listado-name'
		lista_t.innerHTML = '<p>Escenarios completados</p>'
		getE('listado').appendChild(lista_t)
		////////AQUI EMPIEZA TODOO///////
		
		animation_start = setTimeout(function(){
			clearTimeout(animation_start)
			animation_start = null

			getE('cargador').className = 'cargador-off'	
			setInstrucciones(true)
		},1000)
	}else{
		var url = 'assets/images/elementos/p'+(element_i+1)+'-'+(element_j+1)+'.png'
		var url2 = 'assets/images/elementos/p'+(element_i+1)+'-'+(element_j+1)+'-s.png'

		loadImage({url:url,callBack:function(data){
			elementos[element_i].elementos[element_j].size.w = data.w
			elementos[element_i].elementos[element_j].size.h = data.h
			elementos[element_i].elementos[element_j].url = url
			loadImage({url:url2, callBack:function(data){
				elementos[element_i].elementos[element_j].sizes.w = data.w
				elementos[element_i].elementos[element_j].sizes.h = data.h
				elementos[element_i].elementos[element_j].urls = url2

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
			div_epp.innerHTML = '<div class="banda-epp-img banda-epp-item-out" style="background-image:url('+epp_collection[u].url+'); top:'+epp_collection[u].size.y+'px; left:'+epp_collection[u].size.x+'px;"><section style="width:'+epp_collection[u].sizes.w+'px; height:'+epp_collection[u].sizes.h+'px; background-image:url('+epp_collection[u].urls+')"></section></div>'
			band_div.appendChild(div_epp)
			array.push(div_epp)
		}

		band_wp.appendChild(band_div)
		getE('bandas').appendChild(band_wp)
		bandas_data.push({
			id:bands[i],
			epps:array,
			banda:band_wp
		})
	}
	//console.log(bandas_data)
}

function putZonas(){
	var bands = actual_job_data.parts
	for(i = 0;i<bands.length;i++){
		var inx = findPart(bands[i])

		var zona_wp = document.createElement('div')
		zona_wp.className = 'zona'
		zona_wp.id = 'zona-p'+bands[i]

		zona_wp.innerHTML = '<div></div>'
		getE('zonas').appendChild(zona_wp)
		console.log("puso")
	}
}

function setFondo(){
	getE('fondo').className = 'fondo-'+actual_job_data.id
	
}
function setAudio(){
	//anular audio actual
	if(underground_mp3!=null){
		underground_mp3.pause()
		underground_mp3.removeEventListener('ended', repetirAudio, false)
		underground_mp3 = null
	}

	underground_mp3 = new Audio('assets/media/'+actual_job_data.audio)
	//underground_mp3.currentTime = 0
	underground_mp3.play()
	underground_mp3.addEventListener('ended', repetirAudio, false)
}
function repetirAudio(e){
	underground_mp3.play()
}

function sortArray(arr){
	var sorted = []
	var indices = []
	while(sorted.length<arr.length){
		var menor = 100
		var ind = -1
		for(var m = 0;m<arr.length;m++){
			if(arr[m]<=menor&&!indices.includes(m)){
				menor = arr[m]
				ind = m
			}
		}
		if(ind!=-1){
			sorted.push(menor)
			indices.push(ind)
		}
	}
	return sorted
}

function vestirPersonajePista(){
	console.log(actual_job_data.parts)
	var partes = actual_job_data.parts
	var epps = actual_job_data.epps

	//console.log(partes)
	//console.log(epps)
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
		//console.log(epp_data)
		
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
	var actual_job_parts = actual_job_data.parts
	orden_bandas = sortArray(actual_job_parts)

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
function startGame(repeat){
	if(!repeat){
		setAudio()
	}
	
	vestirPersonajePista()

	animacion_pista = setTimeout(function(){
		clearTimeout(animacion_pista)
		animacion_pista = null
		getE('card-cont').className = 'card-off'

		findBanda(true)
		//setMask()
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
var epp_central_section = null
var epp_central_data = null
var estado_revision = false

function findBanda(animation){
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
	//console.log(actual_banda,actual_banda2)
	//console.log(orden_bandas)

	if(animation){
		//banda visible
		getE('banda'+actual_banda_id).classList.remove('banda-off')
		getE('banda'+actual_banda_id).classList.add('banda-on')
	}
	
	//poner a aparecer los epp
	for(i = 0;i<bandas_data[actual_banda].epps.length;i++){
		var equipo = bandas_data[actual_banda].epps[i]
		var equipo_sub = equipo.getElementsByTagName('div')[0]
		if(animation){
			equipo_sub.classList.remove('banda-epp-item-out')
			equipo_sub.classList.add('banda-epp-item-in')
		}
	}

	if(animation){
		animacion_epp = setTimeout(function(){
			clearTimeout(animacion_epp)
			animacion_epp = null
			for(i = 0;i<bandas_data[actual_banda].epps.length;i++){
				var equipo = bandas_data[actual_banda].epps[i]
				var equipo_sub = equipo.getElementsByTagName('div')[0]
				equipo_sub.classList.remove('banda-epp-item-in')
			}

			//console.log(bandas_data)
			animarRueda()
		},500)
	}else{
		animarRueda()
	}	
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
			epp_central_section = epp_central.getElementsByTagName('section')[0]
		}
		getE(equipo.id).setAttribute('pos',new_pos)
		getE(equipo.id).className = 'banda-epp banda-epp-pos-'+new_pos
	}

	animacion_rueda = setTimeout(function(){
		//ya paró, pongamos texto y esperemos 1 segundo
		epp_central_section.className = 'banda-epp-section-on'
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
			epp_central_section.className = ''
			animarRueda()
		},1500)
	},400)
}

function detenerRueda(){
	clearTimeout(animacion_rueda)
	animacion_rueda = null

	epp_central_section.className = ''
	getE('tag-txt').className = "tag-txt-off"
	getE('detener-btn').className = "detener-btn-off"

	//registrar la ropa seleccionada
	items_selected[actual_banda] = epp_central_data.id

	//poner zona con las propiedades
	var zona_parent = getE('zona-p'+actual_banda_id)
	var zona_div = zona_parent.getElementsByTagName('div')[0]

	//zona_parent.style.width = epp_central_data.size.w+'px'
	//zona_parent.style.height = epp_central_data.size.h+'px'
	var translate_x = Math.floor((epp_central_data.size.w/2)*10)/10
	zona_parent.style.transform = 'translateX(-'+translate_x+'px)'
	zona_parent.style.webkitTransform = 'translateX(-'+translate_x+'px)'
	zona_parent.style.otransform = 'translateX(-'+translate_x+'px)'
	zona_div.style.left = epp_central_data.size.x+'px'
	zona_div.style.top = epp_central_data.size.y+'px'

	//agregar zonas reales
	for(i = 0;i<epp_central_data.rects.length;i++){
		var rect = document.createElement('div')
		rect.className = 'zona-rect'
		var ww = Math.round((epp_central_data.size.w*epp_central_data.rects[i].w)/100)
		var hh = Math.round((epp_central_data.size.h*epp_central_data.rects[i].h)/100)
		var xx = Math.round((epp_central_data.size.w*epp_central_data.rects[i].x)/100)
		var yy = Math.round((epp_central_data.size.h*epp_central_data.rects[i].y)/100)
		var cc = epp_central_data.rects[i].c

		//var ww = epp_central_data.rects[i].w
		//var hh = epp_central_data.rects[i].h
		//var xx = epp_central_data.rects[i].x
		//var yy = epp_central_data.rects[i].y

		rect.style.width = ww+'px'
		rect.style.height = hh+'px'
		rect.style.left = xx+'px'
		rect.style.top = yy+'px'
		if(cc!=null&&cc!=undefined){
			//console.log(epp_central_data.rects[i].y,yy)
			rect.style.backgroundColor = cc
		}
		rect.setAttribute('onclick','clickCambiar('+actual_banda_ind+','+actual_banda_id+','+epp_central_data.id+')')
		if(!isresponsive){
			rect.setAttribute('onmouseover','overCambiar('+actual_banda_id+','+epp_central_data.id+')')
			rect.setAttribute('onmouseout','outCambiar('+actual_banda_id+','+epp_central_data.id+')')
		}			

		zona_div.appendChild(rect)
	}

	//mirar si está en estado de revisión
	if(estado_revision){
		getE('zonas').className = 'zonas-on'
		//swichear boton comprobar y detener
		getE('detener-btn').className = 'detener-btn-off'
		getE('comprobar-btn').className = 'comprobar-btn-on'
		//poner instrucciones de la flecha
		getE('check-flecha').className = 'check-flecha-on'
	}else{
		//continuar siguiente banda
		actual_banda_ind++
		if(actual_banda_ind==orden_bandas.length){
			//pasar estado de revisión
			estado_revision = true
			getE('zonas').className = 'zonas-on'
			//swichear boton comprobar y detener
			getE('detener-btn').className = 'detener-btn-off'
			getE('comprobar-btn').className = 'comprobar-btn-on'
			getE('tag-txt').className = "tag-txt-on"
			if(isresponsive){
				getE('tag-txt').innerHTML = 'Selecciona el epp que deseas modificar'
			}else{
				getE('tag-txt').innerHTML = 'Haz clic en el epp que deseas modificar'
			}			

			//poner instrucciones de la flecha
			getE('check-flecha').className = 'check-flecha-on'
		}else{
			findBanda(true)
		}
	}
}

function overCambiar(id_banda,id_item){
	//console.log(id_banda,id_item)
	var ep = getE('epp-'+id_banda+'-'+id_item)
	var section = ep.getElementsByTagName('section')[0]
	section.className = 'banda-epp-section-on'
}
function outCambiar(id_banda,id_item){
	//console.log(id_banda,id_item)
	var ep = getE('epp-'+id_banda+'-'+id_item)
	var section = ep.getElementsByTagName('section')[0]
	section.className = ''
}

function clickCambiar(idband,id_banda,id_item){
	//quitar efectico
	var ep = getE('epp-'+id_banda+'-'+id_item)
	var section = ep.getElementsByTagName('section')[0]
	section.className = ''

	//remover zonas
	var zona_parent = getE('zona-p'+orden_bandas[idband])
	var zona_div = zona_parent.getElementsByTagName('div')[0]
	
	zona_div.innerHTML = ''

	getE('zonas').className = 'zonas-off'
	//swichear boton comprobar y detener
	getE('detener-btn').className = 'detener-btn-on'
	getE('comprobar-btn').className = 'comprobar-btn-off'
	getE('tag-txt').className = "tag-txt-off"

	//quitar instrucciones de la flecha
	getE('check-flecha').className = 'check-flecha-off'

	actual_banda_ind = idband
	findBanda(false)
}

function comprobarJuan(){
	//console.log(items_selected)
	//console.log(actual_job_data.epps)
	getE('zonas').className = 'zonas-off'
	getE('detener-btn').className = 'detener-btn-off'
	getE('comprobar-btn').className = 'comprobar-btn-off'
	getE('check-flecha').className = 'check-flecha-off'
	getE('tag-txt').className = "tag-txt-off"
	estado_revision = false

	var correctos = 0

	for(i = 0;i<items_selected.length;i++){
		if(items_selected[i]==actual_job_data.epps[i]){
			correctos++
		}
	}

	if(correctos==items_selected.length){
		getE('listado-item-'+actual_job_data.id).classList.remove('listado-item-no')
		getE('listado-item-'+actual_job_data.id).classList.add('listado-item-yes')
		getE('listado-item-r-'+actual_job_data.id).classList.remove('listado-responsive-item-no')
		getE('listado-item-r-'+actual_job_data.id).classList.add('listado-responsive-item-yes')

		var titulo_final = '¡Muy bien!'
		var texto_final = '<p>Has vestido al personaje correctamente. <br /><br />Haz clic en el botón <span>SIGUIENTE</span> para continuar con el próximo nivel</p>'
		var value_final = 'siguiente'
		var action_final = 'siguienteEscenario'

		if(actual_job==(escenarios.length-1)){
			titulo_final = '¡Felicitaciones!'
			texto_final = '<p>Has vestido al personaje correctamente en los tres tipos de trabajo</p>'
			value_final = 'jugar otra vez'
			action_final = 'repeatGame'
		}
		setModal({
			close:false,
			title:titulo_final,
			content:texto_final,
			button:true,
			value:value_final,
			final:false,
			action:action_final
		})
	}else{
		setModal({
			close:false,
			title:'¡Incorrecto!',
			content:'<p>El personaje no está vestido con los equipos de protección adecuados para este trabajo. <br /><br />Haz clic en el botón <span>REPETIR</span> para intentarlo nuevamente</p>',
			button:true,
			value:'repetir',
			final:false,
			action:'repetirEscenario'
		})
	}
}

var animacion_repetir = null
function repetirEscenario(){
	unsetModal(function(){
		//tirar bandas al piso
		for(i = 0;i<bandas_data.length;i++){
			bandas_data[i].banda.classList.add('banda-out')
		}
		animacion_repetir = setTimeout(function(){
			clearTimeout(animacion_repetir)
			animacion_repetir = null

			continueNext(true)
		},750)
	})
}

function siguienteEscenario(){
	unsetModal(function(){
		//tirar bandas al piso
		for(i = 0;i<bandas_data.length;i++){
			bandas_data[i].banda.classList.add('banda-out')
		}
		animacion_repetir = setTimeout(function(){
			clearTimeout(animacion_repetir)
			animacion_repetir = null

			if(isresponsive){
				setMask2()
			}else{
				setMask()
			}
			
		},750)
	})	
}

var animacion_transition_fondo = null
var cuadros_transition = []
var canvas_data = {
	w:getE('fondo-mask').offsetWidth,
	h:getE('fondo-mask').offsetHeight,
}
var cuadros_total = 20
var cuadros_frame = 0

function setMask(){
	cuadros_transition = []
	cuadros_frame = 0
	
	//for(i = 0;i<1;i++){
	for(i = 0;i<cuadros_total;i++){
		var mask = document.createElement('div')
		mask.className = 'fondo-mask-sprite'
		mask.innerHTML = '<div id="mask-sprite-'+i+'"><div id="mask-sprite-sub-'+i+'" style="width:'+canvas_data.w+'px; height:'+canvas_data.h+'px;" class="fondo-'+(actual_job_data.id+1)+'"></div></div>'
		getE('fondo-mask').appendChild(mask)

		var t = getRand(100,1000)
		//t = 1000
		var r = mask.getBoundingClientRect()
		var a = (20*50)/t
		var w = r.width//mask.offsetWidth
		var h = r.height//mask.offsetHeight
		var dw = (20*w)/t
		var dh = (20*h)/t

		cuadros_transition.push({
			x:r.left,
			y:r.top,
			w:w,
			h:h,
			t:t,
			f:1,
			a:a,//border-radius
			dw:dw,
			dh:dh,
			stop:false,
			id:'mask-sprite-'+i,
			subid:'mask-sprite-sub-'+i
		})
		//console.log(dw,dh)
	}
	animacion_transition_fondo = setInterval(animateFondo,20)
}

function animateFondo(){
	for(i = 0;i<cuadros_transition.length;i++){
		var px = (cuadros_transition[i].w/2)
		var py = (cuadros_transition[i].h/2)
		var posw = (cuadros_transition[i].dw*cuadros_transition[i].f)
		var posh = (cuadros_transition[i].dh*cuadros_transition[i].f)
		var radius = 50-(cuadros_transition[i].a*cuadros_transition[i].f)

		var sx = px-(posw/2)
		var sy = py-(posh/2)
		//console.log(posw,posh)

		if(posw>=cuadros_transition[i].w){
			posw = cuadros_transition[i].w
			posh = cuadros_transition[i].h
			sx = 0
			sy = 0
			radius = 0
			cuadros_transition[i].stop = true
		}

		var div1 = getE(cuadros_transition[i].id)
		var div2 = getE(cuadros_transition[i].subid)
		div1.style.width = posw+'px'
		div1.style.height = posh+'px'
		div1.style.left = sx+'px'
		div1.style.top = sy+'px'
		div1.style.borderRadius = radius+'%'

		var rect_x = div1.getBoundingClientRect().left-getE('fondo-mask').getBoundingClientRect().left
		var rect_y = div1.getBoundingClientRect().top-getE('fondo-mask').getBoundingClientRect().top

		div2.style.left = '-'+rect_x+'px'
		div2.style.top = '-'+rect_y+'px'
		
		//getE(cuadros_transition[i].id).style.backgroundImage = 'none'

		if(!cuadros_transition[i].stop){
			cuadros_transition[i].f++
		}
		
	}

	cuadros_frame+=20
	//console.log(cuadros_frame)
	if(cuadros_frame==1000){
		console.log("ya")
		clearInterval(animacion_transition_fondo)
		animacion_transition_fondo = null

		getE('fondo-mask').innerHTML = ''
		
		actual_job++
		actual_job_data = escenarios[actual_job]
		continueNext(false)
	}
}

function setMask2(){//para responsive, solo alfa
	getE('fondo-mask').className = 'fondo-out'
	animacion_transition_fondo = setTimeout(function(){
		clearTimeout(animacion_transition_fondo)
		animacion_transition_fondo = null

		actual_job++
		actual_job_data = escenarios[actual_job]
		continueNext(false)
	},500)
}

function continueNext(repeat){
	//reset
	//repeat determina si se pasa al sigueinte o se repite
	if(!repeat){
		setFondo()
		if(isresponsive){
			getE('fondo-mask').className = 'fondo-in'
		}
	}
	
	bandas_data = []
	actual_banda_ind = 0
	actual_banda = 0//para array de los divs -> 4/5
	actual_banda2 = 0//para array elementos -> 6
	actual_banda_id = 0

	orden_bandas = []
	items_selected = []
	epp_central = null
	epp_central_section = null
	epp_central_data = null
	estado_revision = false

	getE('bandas').innerHTML = ''
	getE('zonas').innerHTML = ''
	//put zonas y bandas
	putBands()
	putZonas()
	startGame(repeat)
}

////////////////GAME FUNCTIONS///////////////////////

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