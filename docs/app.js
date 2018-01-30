(function(){

	$('.validate-group').click(function() {
		if (Validate.itsOk({ type: 'group', group: 'validate-me', required: false}))
			alert('All good');
	});

})();