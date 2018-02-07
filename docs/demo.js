(function(){

	$('.validate').click(function() {
		if (Validate.itsOk({
						type: $('#target').val(), 
						group: 'validate-me', 
						required: ($('#required').val() == 'true'),
						warn: ($('#warn').val() == 'true'),
						debug: ($('#debug').val() == 'true'),
						descriptions: ($('#descriptions').val() == 'true')
					}))
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
						<span class="badge badge-default control join-group">join-group</span>
						<span class="badge badge-default control control-live" data-opt="alphabetic">alphabetic</span>
						<span class="badge badge-default control control-live" data-opt="numeric">numeric</span>
						<span class="badge badge-default control control-live" data-opt="international_phone">international_phone</span>
					</div>

					<input class="form-control" placeholder="field ` + node + `">
				</div>
			</div>
		`);

		$('#' + node).fadeIn();
	});

	$('body').delegate('.toolbox .control-prop', 'click', function() {
		var target = $(this).parent().siblings('input');
		target.prop($(this).data('opt'), !target.prop('required'));

		endisable(this);
	});

	$('body').delegate('.toolbox .control-data', 'click', function() {
		var target = $(this).parent().siblings('input'), val = !$(this).parent().siblings('input').data($(this).data('opt'));

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
	});

	$('.set').click(function() {
		if ($(this).hasClass('single'))
			endisable('.single');

		endisable(this);

		$('#' + $(this).data('opt')).val($(this).hasClass('single') ? $(this).html() : $('#' + $(this).data('opt')).val() == 'true' ? false : true);
	});

	$('body').delegate('.join-group', 'click', function() {
		var target = $(this).parent().siblings('input');
		endisable(this);

		if (!target.hasClass('validate-me'))
			target.addClass('validate-me');
		else
			target.removeClass('validate-me');
	});

	$('body').delegate('.control-live', 'click', function() {
		var target = $(this).parent().siblings('input');

		if ($(this).hasClass('badge-primary'))
			target.off('keydown').removeClass('validate-' + $(this).data('opt'))
		else
			target.addClass('validate-' + $(this).data('opt'))

		endisable(this);
		Validate.addLive($(this).data('opt'));
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

})();