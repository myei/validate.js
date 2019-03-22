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
		letters_only: /^[a-zA-Z]+$/,
		letters_spaces: /^[A-Za-z ]+$/,
		numbers_only: /^[0-9]+$/,
		numbers_spaces: /^[0-9 ]+$/,
		password: /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#._\-\$%\^&\*])(?=.{1,})/

	}, modifiers = {
		min: function (el) {
			return el.data('min') ? el.val().length >= el.data('min') : true;
		},
		max: function (el) {
			return el.data('max') ? el.val().length <= el.data('max') : true;
		},
		numbers: function (el) {
			return el.data('numbers') ? regs.numbers_only.test(el.val()) : true;
		},
		letters: function (el) {
			return el.data('letters') ? regs.letters_only.test(el.val()) : true;
		},
		lettersSpaces: function (el) {
			return el.data('letters-spaces') ? regs.letters_spaces.test(el.val()) : true;
		},
		ip: function (el) {
			return el.data('ip') ? ip(el.val()) : true;
		},
		passwd: function (el) {
			return el.data('passwd') ? regs.password.test(el.val()) : true;
		},
		email: function (el) {
			if (el.data('email')) {
				var text = el.val(), at = text.lastIndexOf('@'), dot = text.lastIndexOf('.');
				return at > 0 && dot > at + 1 && text.length > dot + 2 && regs.letters_only.test(text.substr(dot + 1, text.length - 1));
			} return true;
		},
		default: function (el) {
			return el.val().length > 0;
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
		ip: 'Esto no es una dirección ip valida, por favor verifícala'
	},

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
	  		    status = false
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
		var msg = '', nodeName = el.type, _modifiers = Object.keys(modifiers), el = jQuery(el);

		for (var i = _modifiers.length - 1; i >= 0; i--)
			if (el.data(_modifiers[i]) != null && (!modifiers[_modifiers[i]](el) || !el.val().length))
				msg += ' - ' + options.lang[_modifiers[i]] + (typeof el.data(_modifiers[i]) !== 'boolean' ? el.data(_modifiers[i]) : '') + '<br />';

		if (!el.next(_warn_description_class).length)
			el.after('<span class="validate-warn-description">' + (msg.length ? msg : ' - ' + (el.data('default-msg') || options.lang[nodeName])) + '</span>');
	};

	var text = function (el) {
		var itsOk = true;

		try {
			el = jQuery(el);

			for (var key in modifiers)
				if (!modifiers[key](el)) {
					itsOk = false;
					break;
				}

		} catch (e) {
			if (options.debug)
				console.error('Excepción validando campo de texto: ' + e);
		}

		return itsOk;
	};

	var alphabetic = function (e) {
		return !(e.keyCode != 8 && (e.keyCode < 69 || e.keyCode > 90));
	};

	var numeric = function (e) {
		return !(e.keyCode != 8 && !((e.keyCode >= 48 && e.keyCode <= 57) || (e.keyCode >= 96 && e.keyCode <= 105)));
	};

	var international_phone = function (e) {
		/**
		 * VALIDACIÓN NBX<phonenumber>
		 *  N > 1
		 *  B = 0, 1, 2
		 *  X = 0 - 9
		 */
		if (!numeric(e) || jQuery(this).val().length === 10 ||

			(jQuery(this).val().length === 0 && (e.keyCode == 96 || e.keyCode == 48 || e.keyCode == 97 || e.keyCode == 49)) ||

			jQuery(this).val().length === 1 && ((e.keyCode >= 99 && e.keyCode <= 105)  || (e.keyCode >=51 && e.keyCode <= 57)))

			return false;
	};

  	var ip = function (text) {
		var itsOk = true, flag = text;

		try {
			text = text.split('.');

			if (text.length < 4)
				return false;

			text.forEach(function (i) {
				if (!regs.numbers_only.test(i) || parseInt(i) > 255)
					itsOk = false;
			});

		} catch (e) {
			if (options.debug)
				console.error('Excepción validando ip en: ' + flag + ' e: ' + e);
		}

		return itsOk;
	};

	var live = {
		alphabetic: alphabetic,
		numeric: numeric,
		international_phone: international_phone
	};

	var addLive = function (role, target) {
		target = typeof target === 'undefined' ? '.validate-' + role : '.' + target;
		jQuery(target).keydown(live[role]);
	};

  	var field = function (el) {
		var itsOk = true;

		try {
			switch (el.type) {
				case 'checkbox':
				case 'radio':
					itsOk = jQuery(el.nodeName.toLowerCase() + '[name=' + jQuery(el).prop('name') + ']').is(':checked');
					break;

				default:
					itsOk = text(el);
			}
		} catch (e) {
			if (options.debug) {
				console.error('Excepción validando campo: ' + e);
			}
		}

		return itsOk;
	};

  	var handleField = function (el, live) {
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
