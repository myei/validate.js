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
			return doIt ? el.value.length >= arg : true;
		},
		max: function (el, arg, doIt) {
			return doIt ? el.value.length <= arg : true;
		},
		email: function (el, arg, doIt) {
			if (_this.nodeName === 'email' || doIt) {
				var text = el.value, at = text.lastIndexOf('@'), dot = text.lastIndexOf('.');
				return at > 0 && dot > at + 1 && text.length > dot + 2 && regs.letters.test(text.substr(dot + 1, text.length - 1));
			} return true;
		},
		pattern: function (el, arg, doIt) {
			return doIt ? RegExp(arg).test(el.value) : true;
		},
		checkbox: function (el) {
			return _this.nodeName === 'checkbox' ? checkboxRadio(el) : true;
		},
		radio: function (el) {
			return _this.nodeName === 'radio' ? checkboxRadio(el) : true;
		},
		decimal: function (el, arg, doIt) {
			return doIt ? Number(arg ? el.value.replaceAll(arg, '.') : el.value) : true;
		},
		maxDecimal: function (el, arg, doIt) {
			return doIt ? el.value.split(el.dataset.decimal || '.').length == arg : true;
		},
		default: function (el) {
			return !!el.value[0];
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

	}, custom = {},
	   lang = {
		min: 'La longitud de caracteres mínima para este campo es de: ~',
		max: 'La longitud de caracteres máxima para este campo es de: ~',
		numbers: 'Este campo solo permite números',
		decimal: 'Este campo solo permite decimales',
		maxDecimal: 'Este campo sólo permite ~ decimales',
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
	select2 = 's2',
	speedAnimations = 500,
	scriptName = 'validate.js',
	replaceable = '~';
	_this.isSingle = false;

	var build = function (user_options) {
		try {
			options = Object.assign(options, user_options);
			console.log(options);

			if (options.type === 'group' && !Boolean(options.group))
				throw new Error('`options.group` es requerido cuando `options.type = group`');

			selectors.target = options.type === 'group' ? '.' + options.group : selectors.target;
			if (options.required) selectors.target = selectors.target.split(',').map(function(t){return t + '[required]';}).join(',');

			setLang(options.lang);
			if (!document.querySelector('#' + selectors.styles))
				document.querySelector('head').insertAdjacentHTML('beforeend', '<style id="' + selectors.styles + '">.' + selectors.warn + ' { border-color: ' + options.color + ' !important; } .' + selectors.description + ' { color: ' + options.color + ' !important; font-size: 11px; font-family: Roboto, sans-serif; letter-spacing: 1px; float: ' + (options.align) + '; }</style>');

			if (options.realTime) {
                'keyup,change'.split(',').forEach(function (ev) { 
                    document.body.addEventListener(ev, function (e) { 
						var requiredCond = options.required ? e.target.required : true,
							isMyTarget 	 = options.type === 'group' ? e.target.classList.contains(options.group) : 
											selectors.target.includes(e.target.nodeName.toLowerCase());
						console.log(requiredCond);
						if (requiredCond && isMyTarget) {
							_this.isSingle = true;
							handleField(e.target);
						}
                    });
                });
            }

		} catch (e) {
			if (options.debug)
				console.error('[' + scriptName + ']: Excepción construyendo instancia con las opciones suministradas:', options, e.message);
		}
	};

	var itsOk = function () {
		var status = true;
		_this.isSingle = false;

		try {
			document.querySelectorAll(selectors.target).forEach(function(el) {
				if (!handleField(el))
					status = false;
			});

		} catch (e) {
			if (options.debug)
				console.error('[' + scriptName + ']: Excepción validando con el target especificado:', selectors.target, 'e:', e.message);
		}

		return status;
	};

	var setLang = function (_lang) {
		if (typeof _lang != 'object' && options.debug)
			console.error('[' + scriptName + ']: options.lang debe ser JSON:', _lang);

		options.lang = Object.assign(lang, options.lang);
	};

	var addWarn = function (el, show) {
		if (options.warn && show) {
			(hasData(el, select2) ? el.nextSibling.firstChild.firstChild : el).classList.add(selectors.warn);
	      	
			if (options.animations && !_this.isSingle) {
	        	var el_margin = parseInt(el.style.marginLeft || '0px');

				(hasData(el, select2) ? el.nextSibling : el).animate([
																{ marginLeft: (el_margin - 10) + 'px' },
																{ marginLeft: (el_margin + 10) + 'px' },
																{ marginLeft: (el_margin - 10) + 'px' },
																{ marginLeft: (el_margin + 10) + 'px' },
																{ marginLeft: el_margin + 'px' }
															], {
																duration: speedAnimations
															});

	      	}

			if (options.descriptions)
				addDescription(el);
		}
	};

	var addDescription = function (el) {
		var msg = '', el_data = el.dataset || [];

		if (this.errors.indexOf('default') != -1) 
			this.errors.splice(this.errors.indexOf('default'), 1);
		
		this.errors.forEach(function (error) {
			console.log(el_data[error.concat('Msg')]);
			message = el_data[error.concat('Msg')] || options.lang[error];
			detail = el_data[error] || '';

			msg+= ' - '.concat(message.replaceAll(replaceable, detail)).concat('<br />');
		});
		
		(hasData(el, select2) ? el.nextSibling : el)
			.insertAdjacentHTML('afterend','<span class="'.concat(selectors.description).concat('">').concat(msg.length ? msg : ' - '.concat(el_data.defaultMsg || options.lang[this.nodeName])).concat('</span>'));
	};

	var validator = function (el) {
		try {
			var jobs = Object.keys(regs).concat(Object.keys(rules)).concat(Object.keys(custom));

			if (hasData(el, 'optional') && !rules['default'](el)) return true;

			this.errors = jobs.filter(function (job) {
				var doIt = hasData(el, job);
				return job in rules ? !rules[job](el, el.dataset[job], doIt) 
									: job in regs && doIt ? !regs[job].test(el.value) 
														  : doIt ? !custom[job](el, el.dataset[job]) : false;
            });
		} catch (e) {
			if (options.debug)
				console.error('[' + scriptName + ']: Excepción validando campo: ', el, ' e: ', e.message);
		}

		return this.errors.length === 0;
	};

	var checkboxRadio = function (el) {
		if (!el.name)
			throw new Error('Los campos ckeckbox y radio requieren el uso de la propiedad name para poder validar correctamente.');
		
		var isChecked = document.querySelector(el.nodeName.toLowerCase() + '[type=' + this.nodeName + '][name=' + el.name + ']:checked');

		if (_this.isSingle && isChecked)
			document.querySelectorAll(el.nodeName.toLowerCase() + '[type=' + this.nodeName + '][name=' + el.name + ']').forEach(function (node) { clean(node); });

		return isChecked;
	};

  	var handleField = function (el) {
		this.nodeName = el.type;
  		var status = validator(el);

		clean(el);
		addWarn(el, !status);

		return status;
	};

	var clean = function (el) {
		(hasData(el, select2) ? el.nextSibling.firstChild.firstChild : el).classList.remove(selectors.warn);
		
		el = (hasData(el, select2) ? el.nextSibling : el);
		
		if (el.nextSibling && (Array.prototype.slice.call(el.nextSibling.classList || '')).includes(selectors.description))
			el.nextSibling.remove();
	};

	var hasData = function (el, data) {
		return Object.keys(el.dataset || '').includes(data);
	};

	var addLive = function (role, target) {
        target = typeof target === 'undefined' ? 'validate-' + role : target;
		
		document.body.addEventListener('keydown', function (e) { 
			if (e.target.classList.contains(target) && !live[role](e))
				e.preventDefault();
		});
	};
	
	var addRule = function (name, callback, message) {
		if (name in rules) {
			console.warn('[' + scriptName + ']: La regla ' + name.toUpperCase() + ' ya existe y no puede sobreescribirla');
			return;
		}
		
		if (!Array.from(arguments).every(function (arg) { return !!arg; })) {
			console.warn('[' + scriptName + ']: Para añadir reglas personalizadas debe especificar: name, callback, message');
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
			document.querySelectorAll(selectors.target.replaceAll('[required]', '')).forEach(function (e) { e.classList.remove(selectors.warn); });
			document.querySelectorAll('.' + selectors.description).forEach(function (e) { e.parentNode.removeChild(e); });
		}
	};

};
