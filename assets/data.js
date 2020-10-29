var elementos = [
	{
		id:1,
		seccion:'cabeza',
		height:0,//alto del elemento maximo
		elementos:[
			{
				id:1,
				nombre:'Casco de seguridad',
				size:{w:0,h:0,x:-4,y:0},
				url:""
			},
			{
				id:2,
				nombre:'Casco con linterna',
				size:{w:0,h:0,x:-3,y:0},
				url:""
			},
			{
				id:3,
				nombre:'Gorra',
				size:{w:0,h:0,x:-4,y:0},
				url:""
			},
			{
				id:4,
				nombre:'Capucha',
				size:{w:0,h:0,x:-2,y:7},
				url:""
			}
		]
	},
	{
		id:2,
		seccion:'ojos',
		height:0,//alto del elemento maximo
		elementos:[
			{
				id:1,
				nombre:'Gafas de buseo',
				size:{w:0,h:0,x:0,y:0},
				url:""
			},
			{
				id:2,
				nombre:'Gafas protectoras',
				size:{w:0,h:0,x:0,y:0},
				url:""
			},
			{
				id:3,
				nombre:'Careta esmerilar',
				size:{w:0,h:0,x:0,y:0},
				url:""
			},
			{
				id:4,
				nombre:'Careta soldador',
				size:{w:0,h:0,x:0,y:0},
				url:""
			}
		]
	},
	{
		id:3,
		seccion:'boca',
		height:0,//alto del elemento maximo
		elementos:[
			{
				id:1,
				nombre:'Tapabocas quirúrgico',
				size:{w:0,h:0,x:0,y:0},
				url:""
			},
			{
				id:2,
				nombre:'Tapabocas tipo concha',
				size:{w:0,h:0,x:0,y:0},
				url:""
			},
			{
				id:3,
				nombre:'Tapabocas quirúrgico roto',
				size:{w:0,h:0,x:0,y:0},
				url:""
			},
			{
				id:4,
				nombre:'Respirador',
				size:{w:0,h:0,x:0,y:0},
				url:""
			}
		]
	},
	{
		id:4,
		seccion:'cuerpo',
		height:0,//alto del elemento maximo
		elementos:[
			{
				id:1,
				nombre:'Arnés de seguridad',
				size:{w:0,h:0,x:-2,y:3},
				url:""
			},
			{
				id:2,
				nombre:'Bata de químico',
				size:{w:0,h:0,x:-4,y:0},
				url:""
			},
			{
				id:3,
				nombre:'Arnés roto',
				size:{w:0,h:0,x:-1,y:3},
				url:""
			},
			{
				id:4,
				nombre:'Delantal de carnaza',
				size:{w:0,h:0,x:-2,y:4},
				url:""
			}
		]
	},
	{
		id:5,
		seccion:'manos',
		height:0,//alto del elemento maximo
		elementos:[
			{
				id:1,
				nombre:'Guantes de tela',
				size:{w:0,h:0,x:-2,y:25},
				url:""
			},
			{
				id:2,
				nombre:'Guantes de latex',
				size:{w:0,h:0,x:-2,y:0},
				url:""
			},
			{
				id:3,
				nombre:'Guantes de nitrilo',
				size:{w:0,h:0,x:-2,y:20},
				url:""
			},
			{
				id:4,
				nombre:'Guantes de carnaza',
				size:{w:0,h:0,x:-2,y:-4},
				url:""
			}
		]
	},
	{
		id:6,
		seccion:'pies',
		height:0,//alto del elemento maximo
		elementos:[
			{
				id:1,
				nombre:'Botas de caucho',
				size:{w:0,h:0,x:0,y:0},
				url:""
			},
			{
				id:2,
				nombre:'Botas',
				size:{w:0,h:0,x:0,y:19},
				url:""
			},
			{
				id:3,
				nombre:'Botas de cuero blanco',
				size:{w:0,h:0,x:0,y:0},
				url:""
			},
			{
				id:4,
				nombre:'Tenis deportivos',
				size:{w:0,h:0,x:0,y:40},
				url:""
			}
		]
	}
]

var escenarios = [
	{
		id:1,
		nombre:'Alcantarilla',
		parts:[4,5,6,1],
		epps:[1,2,1,2]
	},
	{
		id:2,
		nombre:'Químico',
		parts:[2,3,4,5,6],
		epps:[2,1,2,3,3]
	},
	{
		id:3,
		nombre:'Soldadura',
		parts:[2,4,5,1],
		epps:[4,4,4,4]
	}
]