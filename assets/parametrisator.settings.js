
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

		fieldset.append('<label>'+Symphony.Language.get('XSLT Utility')+' <select name="parametrisator[xslt]">'+params['xslt']+'</select></label>');

		var handle = (env[0] == 'new' ? Symphony.Language.get('Untitled') : (params['handle'] != '' ? params['handle'] : env[1])),
		    langName = Symphony.Language.get('Name'),
		    langXPath = Symphony.Language.get('XPath');
		    list = $('<ol class="xpaths"></ol>').appendTo($('<div class="subsection"><p class="label">Parameters</p></div>').appendTo(fieldset));
		$.each(params['xpaths'], function(index, value){
			list.append('<li class=""><h4>$ds-'+handle+'-'+index+'</h4><div class="group"><label>'+langName+' <input name="parametrisator[xpaths][name][]" value="'+index+'"/></label><label>'+langXPath+' <input name="parametrisator[xpaths][xpath][]" value="'+value.replace(/"/g, '&quot;')+'"/></label></div></li>');
		});

		list.append('<li class="template"><h4>$ds-'+handle+'-?</h4><div class="group"><label>'+langName+' <input name="parametrisator[xpaths][name][]" value=""/></label><label>'+langXPath+' <input name="parametrisator[xpaths][xpath][]" value=""/></label></div></li>');
		list.symphonyDuplicator();
	});
	
})(jQuery.noConflict());
