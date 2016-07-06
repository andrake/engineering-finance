
function saveVariables(){
	
	var rows = $('#variables-grid').jqxGrid('getrows');
	console.log(rows);
	
	$.ajax({
		type: "POST",
		contentType: "application/json",
		url: "variablestable",
		//headers:  { 'X-CSRF-Token': token },
		data: JSON.stringify({"variables":rows}),
		error: function(jqXHR, textStatus, errorThrown) {
			  console.log(textStatus, errorThrown, jqXHR.error());
			},
		success: function(data){
			console.log(data);
			//accountgrids(data);
			}
});
}


function variablegrid(){
	var vardata = [];
	
	var jqxhrRequest = $.get("variablestable", function(data){	
		  var variables = data.variables;
		  for (var i=0; i< variables.length; i++){
			  vardata.push({'variable': variables[i].variable, 'code': variables[i].code,
				  'category': variables[i].category, 'type': variables[i].type, 'comment': variables[i].comment});
		  }
		  createTable(vardata);
		  console.log(vardata);
	})
	.fail(function(){
		for (var i=0; i<100; i++){
			vardata.push({'variable':''});
		}
		createTable(vardata);
	});
}


function createTable(vardata){
	var vardatafields = [{ name: 'variable', type: 'string' }, { name: 'code', type: 'string' }, { name: 'type', type: 'string' }, {name: 'category', type: 'string'}, {name: 'comment', type: 'string'}];
	var varcolumns = [
	        	          { text: 'Variable', datafield: 'variable', width: 200 },
	        	          { text: 'Code', datafield: 'code', width: 150 },
	        	          { text: 'Category', datafield: 'category', width: 100 },
	        	          { text: 'Type', datafield: 'type', width: 150},
	        	          { text: 'Comment', datafield: 'comment', width: 300 }
	        	      ];

	var source =
	{
	    datatype: "array",
	    localdata: vardata,
	    datafields: vardatafields,
        pagenum: 0,
        pagesize: 50,
        pager: function (pagenum, pagesize, oldpagenum) {
            // callback called when a page or page size is changed.
        }
	    
	};
	
	var dataAdapter = new $.jqx.dataAdapter(source);
	
		var createGridEditor = function(row, cellValue, editor, cellText, width, height)
		{
		    // construct the editor.
		
		}
		var initGridEditor = function (row, cellValue, editor, cellText, width, height) {
		    // set the editor's current value. The callback is called each time the editor is displayed.
		
		}
		var gridEditorValue = function (row, cellValue, editor) {
		
		}
	
	$("#variables-grid").jqxGrid(
	{
	    source: dataAdapter,
	    //columnsresize: true,
	    width: 850,
	    //theme: 'energyblue',
	    autoheight: true,
	    altrows: true,
	    enabletooltips: true,
	    editable: true,
        filterable: true,
        sortable: true,
        pageable: true,
	    selectionmode: 'multiplecellsadvanced',
	    columns: varcolumns
	});	

}