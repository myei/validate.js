/**
 *	Validate.js
 *
 *	@author: 
 *  	https://github.com/myei/validate.js
 */
var Validate = function () {

	var options = {
		type: 'all',
		group: '',
		required: true,
		warn: true,
		debug: false,
		lang: 'default',
		descriptions: true

	}, regs = {
		letters_only: /^[a-zA-Z_\-]+$/,
		letters_spaces: /^[A-Za-z ]+$/,
		numbers_only: /^[0-9_\-]+$/,
		numbers_spaces: /^[0-9 ]+$/

	}, modifiers = {
		min: function (el) {
			return el.data('min') ? el.val().length >= el.data('min') : true;
		},
		max: function (el) {
			return el.data('max') ? el.val().length <= el.data('max') : true;
		},
		numbers: function (el) {
			return el.data('numbers') ? regs.numbers(el.val()) : true;
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
		default: function (el) {
			return el.val().length > 0;
		}

	}, lang = {
		min: 'La longitud de caracters mínima para este campo es de: ',
		max: 'La longitud de caracters máxima para este campo es de: ',
		numbers: 'Este campo solo permite números',
		letters: 'Este campo solo permite letras (sin espacios)',
		lettersSpaces: 'Este campo solo permite letras',
		email: 'Esto no es una dirección email valida, por favor verifícala',
		text: 'Este campo es requerido y no puede estar vacío',
		password: 'Este campo es requerido y no puede estar vacío',
		'select-one': 'Este campo es requerido y no puede estar vacío',
		textarea: 'Este campo es requerido y no puede estar vacío',
		hidden: 'Este campo es requerido y no puede estar vacío',
		checkbox: 'Este campo es requerido y no puede estar vacío',
		radio: 'Este campo es requerido y no puede estar vacío',
		ip: 'Esto no es una dirección ip valida, por favor verifícala'
	};

	jQuery('<style>.validate-warn { border-color: red; } .validate-warn-description { color: red; font-size: 11px; font-family: Roboto, sans-serif; letter-spacing: 1px; float: right; }</style>').appendTo('head');
	
	var itsOk = function (user_options) {
		var status = true, current, target = 'input[required], select[required], textarea[required]';

		try {
			options = Object.assign(options, user_options);

			target = options.type === 'group' ? options.required ? '.' + options.group + '[required]' : '.' + options.group : target;

			setLang(options.lang);

			jQuery(target).each(function(index, el) {
				current = field(el);

				if (!current) 
					status = current;

				addWarn(el, !current);
			});

		} catch (e) {
			if (options.debug)
				console.log('Excepción validando segun solicitud: ' + JSON.stringify(options) + ' e: ' + e);
		}

		return status;
	};

	var setLang = function (_lang) {
		options.lang = _lang === 'translateJs' ? Translate.get('validateJs') : typeof _lang === 'object' ? _lang : _lang === 'default' ? lang : window[_lang].validateJs;

		options.lang = Object.assign(lang, options.lang);
	};

	var addWarn = function (el, show) {
		if (options.warn && show) {
			var aux = parseInt(jQuery(el).css('margin-left'));
			jQuery(el).addClass('validate-warn').animate({ marginLeft: (aux - 10) + 'px' }, 100)
												.animate({ marginLeft: (aux + 10) + 'px' }, 100)
												.animate({ marginLeft: (aux - 10) + 'px' }, 100)
												.animate({ marginLeft: (aux + 10) + 'px' }, 100)
												.animate({ marginLeft: aux + 'px' }, 100);
												
			if (options.descriptions)
				addDescription(el);
		} else 
			jQuery(el).removeClass('validate-warn').next('.validate-warn-description').remove();
	};

	var addDescription = function (el) {
		var msg = ' - ' + options.lang[el.type], _modifiers = Object.keys(modifiers);

		for (var i = _modifiers.length - 1; i >= 0; i--)
			if (jQuery(el).data(_modifiers[i]))
				msg += '<br /> - ' + options.lang[_modifiers[i]] + (typeof jQuery(el).data(_modifiers[i]) !== 'boolean' ? jQuery(el).data(_modifiers[i]) : '');

		if (jQuery(el).next('.validate-warn-description').length === 0)
			jQuery(el).after('<span class="validate-warn-description">' + msg + '</span>');
	};

	var email = function (text) {
		var itsOk = false, flag = text;

		try {
			text = text.split('@');

			if (text[0].length === 0)
				return false;

			text = text[1].split('.');

			if (text[0].length === 0 || text[1].length < 2)
				return false;

			itsOk = true;
		} catch (e) {
			if (options.debug)
				console.log('Excepción validando email en: ' + flag + ' e: ' + e);
		}

		return itsOk;
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
			if (options.debug) {
				console.log('Excepción validando campo de texto: ' + e);
				console.log(el);
			}
		}

		return itsOk;
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
				console.log('Excepción validando ip en: ' + flag + ' e: ' + e);
		}

		return itsOk;
	};

	var field = function (el) {
		var itsOk = true;

		try {

			switch (el.type) {

				case 'text':
				case 'password':
				case 'select-one':
				case 'textarea':
				case 'hidden':
					itsOk = text(el);
					break;

				case 'email':
					itsOk = email(el.value);
					break;

				case 'checkbox':
				case 'radio':
					itsOk = jQuery(el.nodeName.toLowerCase() + '[name=' + jQuery(el).prop('name') + ']').is(':checked');
					break;

			}


		} catch (e) {
			if (options.debug) {
				console.log('Excepción validando campo: ' + e);
				console.log(el);
			}
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

	var live = {
		alphabetic: alphabetic,
		numeric: numeric,
		international_phone: international_phone
	};

	var addLive = function (role, target) {
		target = typeof target === 'undefined' ? '.validate-' + role : '.' + target;
		jQuery(target).keydown(live[role]);
	};

	return {
		addLive: function (role, target) {
			return addLive(role, target);	
		},
		itsOk: function (options) {
			return itsOk(options);
		}
	};

}();