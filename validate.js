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
 *												@author: git@github.com:m_yei/validate
 */
var Validate = function () {

	var letter_only = /^[a-zA-Z_\-]+$/;

	var letters_spaces = /^[A-Za-z ]+$/;

	var itsOk = function (request) {
		var status = false, target = 'input[required], select[required], textarea[required]', defaults = {};

		try {
			defaults.type = 'all';
			defaults.group = '';
			defaults.required = true;

			request = Object.assign(defaults, request);

			target = request.type === 'group' ? request.required ? '.' + request.group + '[required]' : '.' + request.group : target;

			jQuery(target).each(function(index, el) {
				status = Validate.field(el);

				if (!status)
					return false;
			});

		} catch (e) {
			// console.log('Excepción validando segun solicitud: ' + JSON.stringify(request) + ' e: ' + e);
		}

		return status;
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
			// console.log('Excepción validando email en: ' + flag + ' e: ' + e);
		}

		return itsOk;
	};

	var text = function (el) {
		var itsOk = true;

		try {
			el = jQuery(el);

			if ((el.data('min') && el.val().length < el.data('min')) || (el.data('max') && el.val().length > el.data('max')) || 

				(el.data('numbers') && isNaN(el.val())) || (el.data('letters') && !letter_only.test(el.val())) || 

				(el.data('letters-spaces') && !letters_spaces.test(el.val())) || el.val() === null || el.val().length === 0)

				itsOk = false;

		} catch (e) {
			// console.log('Excepción validando campo de texto: ' + e);
			// console.log(e);
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
			// console.log('Excepción validando campo: ' + e);
			// console.log(el);
		}

		return itsOk;
	};

	return {
		itsOk: function () {
			return itsOk();
		},
		email: function () {
			return email();
		},
		text: function () {
			return text();
		},
		field: function () {
			return field();	
		}
	};

}();