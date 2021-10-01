/**
 *	Validate.js
 *										
 *  										 	https://github.com/myei/validate.js
 */
var Validate = function (user_options) {

	var options = {
		type: 			'all',
		group: 			'',
		required: 		true,
		warn: 			true,
		lang: 			{},
		descriptions:	true,
		animations:		true,
		color:			'red',
		align:			'right',
		realTime:		true,
		debug:			false

	}, regs = {
		letters: 		/^[a-zA-Z]+$/,
		lettersSpaces:	/^[A-Za-z ]+$/,
		numbers: 		/^[0-9]+$/,
		lettersNumbers: /^[a-zA-Z0-9]+$/,
		passwd: 		/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#._\-\$%\^&\*])(?=.{1,})/,
		ip: 			/^(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])$/,
		url: 			/^(https?:\/\/)+((([a-z\d]([a-z\d-]*[a-z\d])*)\.)+[a-z]{2,}|((\d{1,3}\.){3}\d{1,3}))(\:\d+)?(\/[-a-z\d%_.~+]*)*(\?[;&a-z\d%_.~+=-]*)?(\#[-a-z\d_]*)?$/

	}, rules = {
		min: function (el, arg, doIt) {
			return doIt ? el.val().length >= arg : true;
		},
		max: function (el, arg, doIt) {
			return doIt ? el.val().length <= arg : true;
		},
		email: function (el, arg, doIt) {
			if (_this.nodeName === 'email' || doIt) {
				var text = el.val(), at = text.lastIndexOf('@'), dot = text.lastIndexOf('.');
				return at > 0 && dot > at + 1 && text.length > dot + 2 && regs.letters.test(text.substr(dot + 1, text.length - 1));
			} return true;
		},
		pattern: function (el, arg, doIt) {
			return doIt ? RegExp(arg).test(el.val()) : true;
		},
		checkbox: function (el) {
			return _this.nodeName === 'checkbox' ? checkboxRadio(el) : true;
		},
		radio: function (el) {
			return _this.nodeName === 'radio' ? checkboxRadio(el) : true;
		},
		default: function (el) {
			return !!el.val()[0];
		}

	}, live = {
		alphabetic: function (e) {
	  		return regs.lettersSpaces.test(e.key) || defaultKeys.includes(e.key.toLowerCase());
	  	},
		numeric: function (e) {
			return regs.numbers.test(e.key) || defaultKeys.includes(e.key.toLowerCase());
		},
		alphanumeric: function (e) {
			return regs.lettersNumbers.test(e.key) || defaultKeys.includes(e.key.toLowerCase());
	  	}

	}, custom = {}
	, lang = {
		min: 'La longitud de caracteres mínima para este campo es de: ',
		max: 'La longitud de caracteres máxima para este campo es de: ',
		numbers: 'Este campo solo permite números',
		letters: 'Este campo solo permite letras (sin espacios)',
		lettersSpaces: 'Este campo solo permite letras',
		lettersNumbers: 'Este campo permite letras y números (sin espacios)',
		text: 'Este campo es requerido y no puede estar vacío',
		password: 'Este campo es requerido y no puede estar vacío',
		passwd: 'Al menos una letra mayúscula <br> - Al menos una letra minúscula <br> - Al menos un carácter numérico <br> - Al menos un carácter especial (!@#._-$%^&*)',
		'select-one': 'Debe seleccionar alguna opción de la lista',
		'select-multiple': 'Debe seleccionar al menos una opción de la lista',
		email: 'Debe ser un email válido',
		textarea: 'Este campo es requerido y no puede estar vacío',
		hidden: 'Este campo es requerido y no puede estar vacío',
		checkbox: 'Este campo es requerido y no puede estar vacío',
		radio: 'Este campo es requerido y no puede estar vacío',
		file: 'Debe agregar al menos un archivo',
		ip: 'Esto no es una dirección ip valida',
		url: 'Esto no es una url correcta. <br> - ej: https://google.com',
		pattern: 'Esto no cumple con el patrón especificado: '
	}, _this = this,

	selectors = {
		warn: 'validate-warn',
		description: 'validate-warn-description',
		styles: 'validate-styles',
		target: 'input,select,textarea'
	},
	defaultKeys = ['tab', 'backspace', 'delete', 'enter', 'home', 'end', 'pageup', 'pagedown'],
	select2 = 's2';



	var build = function (user_options) {
		try {
			options = Object.assign(options, user_options);

			selectors.target = options.type === 'group' ? '.' + options.group : selectors.target;
			if (options.required) selectors.target = selectors.target.split(',').map(function(t){return t + '[required]';}).join(',');

			setLang(options.lang);
			if (!jQuery('#' + selectors.styles).length)
				jQuery('<style id="' + selectors.styles + '">.' + selectors.warn + ' { border-color: ' + options.color + ' !important; } .' + selectors.description + ' { color: ' + options.color + ' !important; font-size: 11px; font-family: Roboto, sans-serif; letter-spacing: 1px; float: ' + (options.align) + '; }</style>').appendTo('head');

			if (options.realTime)
				jQuery('body').on('keyup change', selectors.target, function() { handleField(this, true); });

		} catch (e) {
			if (options.debug)
				console.error('validate.js: Excepción construyendo instancia con las opciones suministradas:', options, e.message);
		}
	};

	var itsOk = function () {
		var status = true;

		try {
			jQuery(selectors.target).each(function(index, el) {
				if (!handleField(el))
					status = false;
			});

		} catch (e) {
			if (options.debug)
				console.error('validate.js: Excepción validando con el target especificado:', selectors.target, 'e:', e.message);
		}

		return status;
	};

	var setLang = function (_lang) {
		if (typeof _lang != 'object' && options.debug)
			console.error('validate.js: options.lang debe ser JSON:', _lang);

		options.lang = Object.assign(lang, options.lang);
	};

	var addWarn = function (el, show, live) {
		if (options.warn && show) {
			var _el = jQuery(el);
			
			(hasData(_el, select2) ? _el.next().children().children() : _el).addClass(selectors.warn);

	      	if (options.animations && !live) {
	        	var aux = parseInt(_el.css('margin-left'));

		        (hasData(_el, select2) ? _el.next() : _el).animate({ marginLeft: (aux - 10) + 'px' }, 100)
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

		this.errors.forEach(function (error) {
			msg += ' - ' + (el.data(error + '-msg') || options.lang[error] + (el.data(error) && el.data(error) !== '' ? el.data(error) : '')) + '<br />';
		});
		
		(hasData(el, select2) ? el.next() : el).after('<span class="' + selectors.description + '">' + (msg.length ? msg : ' - ' + (el.data('default-msg') || options.lang[this.nodeName])) + '</span>');
	};

	var field = function (el) {
		try {
			var jobs = Object.keys(regs).concat(Object.keys(rules)).concat(Object.keys(custom));

			el = jQuery(el);
			if (hasData(el, 'optional') && !rules['default'](el)) return true;

			this.errors = jobs.filter(function (job) {
				var doIt = hasData(el, job);
				return job in rules ? !rules[job](el, el.data(job), doIt) 
									: job in regs && doIt ? !regs[job].test(el.val()) 
														  : doIt ? !custom[job](el, el.data(job)) : false;
			});
		} catch (e) {
			if (options.debug)
				console.error('validate.js: Excepción validando campo: ', el, ' e: ', e.message);
		}

		return this.errors.length === 0;
	};

	var checkboxRadio = function (el) {
		if (!el.prop('name'))
			throw new Error('Los campos ckeckbox y radio requieren el uso de la propiedad name para poder validar correctamente.');

		return jQuery(el.prop('nodeName').toLowerCase() + '[type=' + this.nodeName + '][name=' + el.prop('name') + ']').is(':checked');
	};

  	var handleField = function (el, live) {
		this.nodeName = el.type;
  		var status = field(el);

		clean(el);
		addWarn(el, !status, live);

		return status;
	};

	var clean = function (el) {
		var el = jQuery(el);
		(hasData(el, select2) ? el.next().children().children() : el).removeClass(selectors.warn);

		if ((hasData(el, select2) ? el.next() : el).next().hasClass(selectors.description))
			(hasData(el, select2) ? el.next() : el).next().remove();
	};

	var hasData = function (el, data) {
		return !!el.data(data) || el.data(data) === '';
	};

	var addLive = function (role, target) {
		target = typeof target === 'undefined' ? '.validate-' + role : '.' + target;
		jQuery('body').on('keydown keypress', target, live[role]);
	};
	
	var addRule = function (name, callback, message) {
		if (name in rules) {
			console.warn('validate.js: La regla ' + name.toUpperCase() + ' ya existe y no puede sobreescribirla');
			return;
		}
		
		if (!Array.from(arguments).every(function (arg) { return !!arg; })) {
			console.warn('validate.js: Para añadir reglas personalizadas debe especificar: name, callback, message');
			return;
		}

		custom[name] = callback;
		lang[name] = message;
	};

  	build(user_options);


	return {
		addLive: function (role, target) {
			return addLive(role, target);
		},
		addRule: function (name, callback, message) {
			addRule(name, callback, message);
		},
		itsOk: function () {
			return itsOk();
		},
		reset: function () {
			document.querySelectorAll(selectors.target).forEach(function (e) { e.classList.remove(selectors.warn); });
			document.querySelectorAll('.' + selectors.description).forEach(function (e) { e.parentNode.removeChild(e); });
		}
	};

};
