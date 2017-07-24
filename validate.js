/**
 *	Validate.js
 *
 *	Esta colección de funciones sirven para validar los siguientes campos HTML:
 *
 *		- input (text, checkbox, radio, password, email)
 *		- select
 *		- textarea
 *
 *	según una serie de parámetros que pueden personalizar el proceso de validación
 *	especificados en la propiedad data:
 *
 *		- min
 *		- max
 *		- numbers
 *		- letters only
 *		- letters and spaces
 *
 *	si ninguno de los anteriores es especificado siplemente validan vacíos
 *
 * 	Permite validacion de grupos de elementos (según clase), solo los requeridos de un
 *  grupo (clase + required), individuales, o simplemente todos los campos de una página
 * 	con el atributo 'required'
 *
 *												@author: https://github.com/myei/Validate
 */
var Validate = function () {

	var options = {
		type: 'all',
		group: '',
		required: true,
		warn: true,
		debug: false
	};

	var regs = {
		letters_only: /^[a-zA-Z_\-]+$/,
		letters_spaces: /^[A-Za-z ]+$/,
		numbers_only: /^[0-9_\-]+$/,
		numbers_spaces: /^[0-9 ]+$/
	};



	jQuery('<style>.validate-warn { border-color: red; }</style>').appendTo('head');

	var itsOk = function (user_options) {
		var status = true, current, target = 'input[required], select[required], textarea[required]';

		try {
			options = Object.assign(options, user_options);

			target = options.type === 'group' ? options.required ? '.' + options.group + '[required]' : '.' + options.group : target;

			jQuery(target).each(function(index, el) {
				current = Validate.field(el);

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

	var addWarn = function (el, show) {
		if (options.warn && show) {
			var aux = parseInt(jQuery(el).css('margin-left'));
			jQuery(el).addClass('validate-warn').animate({ marginLeft: (aux - 10) + 'px' }, 100)
												.animate({ marginLeft: (aux + 10) + 'px' }, 100)
												.animate({ marginLeft: (aux - 10) + 'px' }, 100)
												.animate({ marginLeft: (aux + 10) + 'px' }, 100)
												.animate({ marginLeft: aux + 'px' }, 100);
		} else 
			jQuery(el).removeClass('validate-warn');
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

			if ((el.data('min') && el.val().length < el.data('min')) || (el.data('max') && el.val().length > el.data('max')) || 

				(el.data('numbers') && isNaN(el.val())) || (el.data('letters') && !regs.letters_only.test(el.val())) || 

				(el.data('letters-spaces') && !regs.letters_spaces.test(el.val())) || el.val() === null || el.val().length === 0)

				itsOk = false;

		} catch (e) {
			if (options.debug) {
				console.log('Excepción validando campo de texto: ' + e);
				console.log(el);
			}
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
					itsOk = Validate.text(el);
					break;

				case 'email':
					itsOk = Validate.email(el.value);
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
		itsOk: function (options) {
			return itsOk(options);
		},
		email: function (text) {
			return email(text);
		},
		text: function (el) {
			return text(el);
		},
		field: function (el) {
			return field(el);	
		},
		ip: function (text) {
			return ip(text);	
		},
		addLive: function (role, target) {
			return addLive(role, target);	
		}
	};

}();