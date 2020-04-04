/**
 *	Validate.js
 *
 *	@author:
 *  	https://github.com/myei/validate.js
 */
var Validate = function (user_options) {

	var options = {
		type: 'all',
		group: '',
		required: true,
		warn: true,
		lang: 'default',
		descriptions: true,
	    animations: true,
      	color: 'red',
	    realTime: true,
	    debug: false

	}, regs = {
		letters: /^[a-zA-Z]+$/,
		lettersSpaces: /^[A-Za-z ]+$/,
		numbers: /^[0-9]+$/,
		passwd: /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#._\-\$%\^&\*])(?=.{1,})/,
		ip: /^(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])$/,
		url: /^(https?:\/\/)?((([a-z\d]([a-z\d-]*[a-z\d])*)\.)+[a-z]{2,}|((\d{1,3}\.){3}\d{1,3}))(\:\d+)?(\/[-a-z\d%_.~+]*)*(\?[;&a-z\d%_.~+=-]*)?(\#[-a-z\d_]*)?$/

	}, modifiers = {
		min: function (el) {
			return !!el.data('min') ? el.val().length >= el.data('min') : true;
		},
		max: function (el) {
			return !!el.data('max') ? el.val().length <= el.data('max') : true;
		},
		email: function (el) {
			if (_this.nodeName === 'email' || !!el.data('email')) {
				var text = el.val(), at = text.lastIndexOf('@'), dot = text.lastIndexOf('.');
				return at > 0 && dot > at + 1 && text.length > dot + 2 && regs.letters.test(text.substr(dot + 1, text.length - 1));
			} return true;
		},
		checkbox: function (el) {
			return _this.nodeName === 'checkbox' ? checkboxRadio(el) : true;
		},
		radio: function (el) {
			return _this.nodeName === 'radio' ? checkboxRadio(el) : true;
		},
		default: function (el) {
			return !!el.val();
		}

	}, jobs = Object.keys(regs).concat(Object.keys(modifiers))

	,  live = {
		alphabetic: function (e) {
	  		return !(![8, 16, 32].includes(e.keyCode) && (e.keyCode < 69 || e.keyCode > 90));
	  	},
		numeric: function (e) {
	  		return !(e.keyCode != 8 && !((e.keyCode >= 48 && e.keyCode <= 57) || (e.keyCode >= 96 && e.keyCode <= 105)));
	  	}

	}, lang = {
		min: 'La longitud de caracters mínima para este campo es de: ',
		max: 'La longitud de caracters máxima para este campo es de: ',
		numbers: 'Este campo solo permite números',
		letters: 'Este campo solo permite letras (sin espacios)',
		lettersSpaces: 'Este campo solo permite letras',
		text: 'Este campo es requerido y no puede estar vacío',
		password: 'Este campo es requerido y no puede estar vacío',
		passwd: 'Al menos una letra mayúscula <br> - Al menos una letra minúscula <br> - Al menos un carácter numérico <br> - Al menos un carácter especial (!@#._-$%^&*)',
		'select-one': 'Este campo es requerido y no puede estar vacío',
		email: 'Debe ser un email válido',
		textarea: 'Este campo es requerido y no puede estar vacío',
		hidden: 'Este campo es requerido y no puede estar vacío',
		checkbox: 'Este campo es requerido y no puede estar vacío',
		radio: 'Este campo es requerido y no puede estar vacío',
		file: 'Debe agregar al menos un archivo',
		ip: 'Esto no es una dirección ip valida',
		url: 'Esto no es una url correcta. <br> - ej: https://google.com'
	}, _this = this,

	warn_class = '.validate-warn', _warn_class = warn_class.substr(1),
	warn_description_class = '.validate-warn-description', _warn_description_class = warn_description_class.substr(1),
  	target = 'input, select, textarea', target_req = 'input[required], select[required], textarea[required]';



	var build = function (user_options) {
		try {
		  options = Object.assign(options, user_options);
		  target = options.type === 'group' ? options.required ? '.' + options.group + '[required]' : '.' + options.group : options.required ? target_req : target;

		  setLang(options.lang);
		  jQuery('<style>.validate-warn { border-color: ' + options.color + '; } .validate-warn-description { color: ' + options.color + '; font-size: 11px; font-family: Roboto, sans-serif; letter-spacing: 1px; float: right; }</style>').appendTo('head');

		  if (options.realTime)
		    jQuery(target).bind('keyup change', function() { handleField(this, true); });

		} catch (e) {
			if (options.debug)
				console.error('Excepción construyendo instancia con las opciones suministradas:', options, e.message);
		}
	};

	var itsOk = function () {
		var status = true;

	    try {
	  		jQuery(target).each(function(index, el) {
	  		  if (!handleField(el))
	  		    status = false;
	  		});

	    } catch (e) {
	    	if (options.debug)
	        	console.error('Excepción validando con el target especificado: ' + target + ' e: ' + e);
	    }

		return status;
	};

	var setLang = function (_lang) {
		options.lang = _lang === 'translateJs' ? Translate.get('validateJs') : _lang;

		options.lang = Object.assign(lang, options.lang);
	};

	var addWarn = function (el, show, live) {
		if (options.warn && show) {
			jQuery(el).addClass(_warn_class);

	      	if (options.animations && !live) {
	        	var aux = parseInt(jQuery(el).css('margin-left'));

		        jQuery(el).animate({ marginLeft: (aux - 10) + 'px' }, 100)
					        .animate({ marginLeft: (aux + 10) + 'px' }, 100)
					        .animate({ marginLeft: (aux - 10) + 'px' }, 100)
					        .animate({ marginLeft: (aux + 10) + 'px' }, 100)
					        .animate({ marginLeft: aux + 'px' }, 100);
	      	}

			if (options.descriptions)
				addDescription(el);
		}
	};

	var addDescription = function (el) {
		var msg = '', el = jQuery(el);

		if (this.errors.indexOf('default') != -1) 
			this.errors.splice(this.errors.indexOf('default'), 1);

		this.errors.forEach(error => {
			msg += ' - ' + options.lang[error] + (el.data(error) && el.data(error) !== '' ? el.data(error) : '') + '<br />';
		});
		
		if (!el.next(_warn_description_class).length)
			el.after('<span class="validate-warn-description">' + (msg.length ? msg : ' - ' + (el.data('default-msg') || options.lang[this.nodeName])) + '</span>');
	};

	var field = function (el) {
		try {
			el = jQuery(el);

			this.errors = jobs.filter(job => {
				return job in modifiers ? !modifiers[job](el) : !!el.data(job) ? !regs[job].test(el.val()) : false;
			});
		} catch (e) {
			if (options.debug)
				console.error('Excepción validando campo: ' + e);
		}

		return this.errors.length === 0;
	};

	var checkboxRadio = function (el) {
		if (!el.prop('name'))
			throw new Error('Los campos ckeckbox y radio requieren el uso de la propiedad name para poder validar correctamente.');

		return jQuery(el.prop('nodeName').toLowerCase() + '[type=' + this.nodeName + '][name=' + el.prop('name') + ']').is(':checked');
	};

	var addLive = function (role, target) {
		target = typeof target === 'undefined' ? '.validate-' + role : '.' + target;
		jQuery(target).keydown(live[role]);
	};

  	var handleField = function (el, live) {
		this.nodeName = el.type;
  		var status = field(el);

	    clean(el);
	    addWarn(el, !status, live);

	    return status;
	};

	var clean = function (el) {
    	jQuery(el).removeClass(_warn_class);

		if (jQuery(el).next().hasClass(_warn_description_class))
      		jQuery(el).next().remove();
	};

  	build(user_options);


	return {
		addLive: function (role, target) {
			return addLive(role, target);
		},
		itsOk: function () {
			return itsOk();
		}
	};

};
