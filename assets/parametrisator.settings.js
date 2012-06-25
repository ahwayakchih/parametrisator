
(function($) {
	/**
	 * This plugin adds "Parametrisator" settings on data-source edit pages.
	 *
	 * @author: Marcin Konicki, ahwayakchih@neoni.net
	 * @source: http://github.com/ahwayakchih/parametrisator
	 */

	// Language strings
	Symphony.Language.add({
		'Untitled': false,
		'Parametrisator': false,
		'XSLT Utility': false,
		'Name': false,
		'XPath': false
	});

	$(document).ready(function() {

		// Find context path.
		var env = Symphony.Context.get('env');
		if (env.length < 1) return;

		// Build form action URL by which we will find data source edit form.
		var action = Symphony.Context.get('root') + '/symphony/blueprints/datasources';
		if (env[0] == 'new') action += '/new/';
		else if (env[0] == 'edit' && env.length > 1) action += '/edit/' + env[1] + '/';

		// Find form.
		var form = $('div#contents form[action^="'+action+'"]');
		if (form.length < 1) return;

		// Get current settings.
		var params = Symphony.Context.get('parametrisator');

		// Add fieldset
		var actions = $('div.actions', form);
		actions.before('<fieldset class="settings parametrisator"><legend>'+Symphony.Language.get('Parametrisator')+'</legend></fieldset>');

		// Add XSLT and XPath fields
		var fieldset = $('fieldset.parametrisator', form);

		fieldset.append('<div class="frame"><label>'+Symphony.Language.get('XSLT Utility')+' <select name="parametrisator[xslt]">'+params['xslt']+'</select></label></div>');

		var handle = (env[0] == 'new' ? Symphony.Language.get('Untitled') : (params['handle'] != '' ? params['handle'] : env[1])),
		    langName = Symphony.Language.get('Name'),
		    langXPath = Symphony.Language.get('XPath');
		    list = $('<ol class="xpaths"></ol>').appendTo($('<div class="frame"><p class="label">Parameters</p></div>').appendTo(fieldset));
		$.each(params['xpaths'], function(index, value){
			list.append('<li data-handle="'+index+'"><header><h4><strong>$ds-'+handle+'-'+index+'</strong></h4></header><div class="two columns"><label class="column">'+langName+' <input name="parametrisator[xpaths][name][]" class="name" type="text" value="'+index+'"/></label><label class="column">'+langXPath+' <input name="parametrisator[xpaths][xpath][]" class="xpath" type="text" value="'+value.replace(/"/g, '&quot;')+'"/></label></div></li>');
		});

		list.append('<li class="template" data-handle="?"><header><h4><strong>$ds-'+handle+'-?</strong></h4></header><div class="two columns"><label class="column">'+langName+' <input name="parametrisator[xpaths][name][]" class="name" type="text" value=""/></label><label class="column">'+langXPath+' <input name="parametrisator[xpaths][xpath][]" class="xpath" type="text" value=""/></label></div></li>');
		list.symphonyDuplicator();

		function parametrisatorRegenerateHeaders(element){
			if (!element) {
				$('ol.xpaths li').each(function(){
					$('header h4 strong', this).html('$ds-'+handle+'-'+$(this).attr('data-handle'));
				});
			}
			else {
				$('header h4 strong', element).html('$ds-'+handle+'-'+element.attr('data-handle'));
			}
		}

		function parametrisatorGetHandle(text, element){
				// From Symphony's admin.js
				$.ajax({
					type: 'GET',
					data: { 'string': text },
					dataType: 'json',
					async: true,
					url: Symphony.Context.get('root') + '/symphony/ajax/handle/',
					success: function(result) {
						if (!element) handle = result;
						else element.attr('data-handle', result);
						parametrisatorRegenerateHeaders(element);
						return false;
					}
				});
				// 
		}


		// Regenerate headers, every time user changes data-source name or param name.
		form.find('input[name="fields[name]"]').on('blur.admin input.admin', function(){
			parametrisatorGetHandle($(this).val());
		});
		form.on('blur.admin input.admin', 'ol.xpaths input.name', function(){
			parametrisatorGetHandle($(this).val(), $(this).closest('li'));
		});

	});
	
})(jQuery.noConflict());
