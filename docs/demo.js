(function(){
	var validate;

	setInstance();

	$('.validate').click(function() {
		if (validate.itsOk())
			$('.good').fadeIn();
		else
			$('.bad').fadeIn();

		setTimeout(function() { $('.alert').fadeOut(); }, 2000);
	});

	$('.add-field').click(function() {
		var node = $(this).parent().siblings().length + 1;

		$(this).parent().before(`
			<div class="col-md-6" style="display:none" id="` + node + `">
					<div class="toolbox text-right" style="color: #ccc; cursor: pointer;">
						<span class="badge badge-default control-prop" data-opt="required">required</span>
						<span class="badge badge-default control-data control-data-in" data-opt="min">min</span>
						<span class="badge badge-default control-data control-data-in" data-opt="max">max</span>
						<span class="badge badge-default control-data" data-opt="letters">letters</span>
						<span class="badge badge-default control-data" data-opt="letters-spaces">letters-spaces</span>
						<span class="badge badge-default control-data" data-opt="numbers">numbers</span>
						<span class="badge badge-default control-data" data-opt="ip">ip</span>
						<span class="badge badge-default control-data" data-opt="passwd">passwd</span>
						<span class="badge badge-default control-data" data-opt="email">email</span>
						<span class="badge badge-default control join-group">join-group</span>
						<span class="badge badge-default control control-live" data-opt="alphabetic">alphabetic</span>
						<span class="badge badge-default control control-live" data-opt="numeric">numeric</span> <br>
						<span class="badge badge-default control control-data control-data-in" data-opt="default-msg">default-msg</span>
					</div>

					<input class="form-control" placeholder="field ` + node + `">
				</div>
			</div>
		`);

		$('#' + node).fadeIn();
	});

	$('body').delegate('.toolbox .control-prop', 'click', function() {
		var target = $(this).parent().siblings('input, select, textarea');
		target.prop($(this).data('opt'), !target.prop('required'));

		endisable(this);

		setInstance();
		$('.validate').trigger('click');
	});

	$('body').delegate('.toolbox .control-data', 'click', function() {
		var target = $(this).parent().siblings('input, select, textarea'), val = !$(this).parent().siblings('input, select, textarea').data($(this).data('opt'));

		if ($(this).hasClass('badge-primary')) {
			endisable(this);
			target.removeData($(this).data('opt'));
			return true;
		}

		if ($(this).hasClass('control-data-in')) {
			val = prompt($(this).data('opt'));

			if (val === null || val === '')
				return false;
		}

		target.data($(this).data('opt'), val);
		endisable(this);

		setInstance();
		$('.validate').trigger('click');
	});

	$('.set').click(function() {
		if ($(this).hasClass('single'))
			endisable('.single');

		if ($(this).hasClass('set-in') && !$(this).hasClass('badge-primary')) {
			val = prompt($(this).data('in'));

			if (val.length === 0)
				return false;

			$('#' + $(this).data('opt')).val(val);
		} else
			$('#' + $(this).data('opt')).val($(this).hasClass('single') ? $(this).html() : $('#' + $(this).data('opt')).val() == 'true' ? false : true);

		endisable(this);

		setInstance();
		$('.validate').trigger('click');

		if ($(this).html() === 'realTime' && $('#' + $(this).data('opt')).val() == 'false')
			$('input, select, textarea').off('keyup change');
	});

	$('body').delegate('.join-group', 'click', function() {
		var target = $(this).parent().siblings('input, select, textarea');
		endisable(this);

		if (!target.hasClass('validate-me'))
			target.addClass('validate-me');
		else
			target.removeClass('validate-me');

			setInstance();
			$('.validate').trigger('click');
	});

	$('body').delegate('.control-live', 'click', function() {
		var target = $(this).parent().siblings('input, select, textarea');

		if ($(this).hasClass('badge-primary'))
			target.off('keydown').removeClass('validate-' + $(this).data('opt'))
		else
			target.addClass('validate-' + $(this).data('opt'))

		endisable(this);
		validate.addLive($(this).data('opt'));
	});

	var endisable = function (el, dis) {
		if (!dis) {
			if (!$(el).hasClass('badge-primary'))
				$(el).removeClass('badge-default').addClass('badge-primary');
			else
				$(el).removeClass('badge-primary').addClass('badge-default');
		} else
			$(this).removeClass('badge-primary').addClass('badge-default');

	};

	$('.dark-btn').click(function() {
		if (!$('body').hasClass('dark-mode')){
			$('body').addClass('dark-mode');
			$(this).html('Light Mode <i class="far fa-moon"></i>');
		} else {
			$('body').removeClass('dark-mode');
			$(this).html('Dark Mode <i class="fas fa-moon"></i>');
		}
	});

	function setInstance () {
		validate = Validate({
											type: $('#target').val(),
											group: 'validate-me',
											required: ($('#required').val() == 'true'),
											warn: ($('#warn').val() == 'true'),
											debug: ($('#debug').val() == 'true'),
											descriptions: ($('#descriptions').val() == 'true'),
											animations: ($('#animations').val() == 'true'),
											color: $('#color').val(),
											realTime: ($('#realTime').val() == 'true')
										});
	};

})();
