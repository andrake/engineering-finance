$( document ).ready(function() {
	//make loaded ref tables abailable
    var reftables = {"column-radiator": "Column Radiator", "tube-radiator":"Tube Radiator",
    		"groundtemp":"Ground Temp"};

    for (var ref in reftables){
    	$("#reference-select").append($('<option>', {value: ref, text:reftables[ref]}));
    }
    
    referencegrid();
});

var references = {'column-radiator': 'radiators/column-radiator',
		'tube-radiator': 'radiators/tube-radiator',
		'groundtemp': 'soiltemp/soiltemp'};

$("#reference-select").change(function(){
	var ref = $("#reference-select").val();
	$("#table-title").text(ref);
	referencegrid();
});

function saveReference(){
	
	var rows = $('#reference-grid').jqxGrid('getrows');
	var table = $("#reference-select").val();
	console.log(rows);
	//debugger;
	$.ajax({
		type: "POST",
		contentType: "application/json",
		url: references[table],
		data: JSON.stringify({"table": table, "reference":rows}),
		error: function(jqXHR, textStatus, errorThrown) {
			  console.log(textStatus, errorThrown, jqXHR.error());
			},
		success: function(data){
			console.log(data);
			}
});
}


function referencegrid(){
	var refdata = [];
	var table = $("#reference-select").val();
	var reference = '';
	if (table.indexOf('radiator') != -1){
		reference = 'radiators';
	} else if(table.indexOf('groundtemp') != -1){
		reference = 'groundtemp';
	}
	//debugger;
	$.ajax({
		type: "GET",
		url: references[table],
		error: function(jqXHR, textStatus, errorThrown) {
			  console.log(textStatus, errorThrown, jqXHR.error());
			  buildtable(refdata, reference);
			  //empty rows
			  if(refdata.length == 0){
				  emptyrows();
			  }
		  		
			},

		success: function(data){
			if (data.reftable){
			  var rows = loaddata(reference, data.reftable);
			  buildtable(rows, reference);
			  if (rows.length ==0){
					emptyrows();
				}
			} else {
				buildtable(rows, reference);
				emptyrows();
			}	
		}
	});
}

function buildtable(rows, reference){

	var refdatafields = {
			"radiators":[{ name: 'height', type: 'integer' }, { name: 'one', type: 'float' }, { name: 'two', type: 'float' }, {name: 'three', type: 'float'}, {name: 'four', type: 'float'},
	                     {name: 'five', type: 'float'}, {name: 'six', type: 'float'}, {name: 'window', type: 'float'}],
			"groundtemp":[{name: 'depth', type: 'integer'}, {name:'temp', type:'integer'}]
	};
	
	var refcolumns = {
			"radiators":[
	        	          { text: 'Height (in)', datafield: 'height', width: 100, align: 'center', cellsalign:'center' },
	        	          { text: 'one', datafield: 'one', width: 100, align: 'center', cellsalign:'right' },
	        	          { text: 'two', datafield: 'two', width: 100, align: 'center', cellsalign:'right' },
	        	          { text: 'three', datafield: 'three', width: 100, align: 'center', cellsalign:'right'},
	        	          { text: 'four', datafield: 'four', width: 100, align: 'center', cellsalign:'right' },
	        	          { text: 'five', datafield: 'five', width: 100, align: 'center', cellsalign:'right' },
	        	          { text: 'six', datafield: 'six', width: 100, align: 'center', cellsalign:'right' },
	        	          { text: 'window seven', datafield: 'window', width: 100, align: 'center', cellsalign:'right' },
	        	      ],
    	      "groundtemp":[
  	        	          { text: 'Depth (ft)', datafield: 'depth', width: 75, align: 'center', cellsalign:'right' },
	        	          { text: 'Temp F', datafield: 'temp', width: 75, align: 'center', cellsalign:'right' },
    	                    ]
	};

	var source =
	{
	    datatype: "array",
	    localdata: rows,
	    datafields: refdatafields[reference],
/*            pagenum: 0,
        pagesize: 50,
        pager: function (pagenum, pagesize, oldpagenum) {
            // callback called when a page or page size is changed.
        }*/
	    
	};
	
	var dataAdapter = new $.jqx.dataAdapter(source);
	
		var createGridEditor = function(row, cellValue, editor, cellText, width, height)
		{
		    // construct the editor.
		    if (row == 0) {
		        editor.jqxDropDownList({autoDropDownHeight: true,  width: width, height: height, source: ['Lighting', 'Heating', 'Cooling']});
		    }
		
		}
		var initGridEditor = function (row, cellValue, editor, cellText, width, height) {
		    // set the editor's current value. The callback is called each time the editor is displayed.
		    if (row == 0) {
		        editor.jqxDropDownList('selectItem', cellValue);
		    }
		
		}
		var gridEditorValue = function (row, cellValue, editor) {
		
		}
	
	$("#reference-grid").jqxGrid(
	{
	    source: dataAdapter,
	    //columnsresize: true,
	    width: 800,
	    //theme: 'energyblue',
	    autoheight: true,
	    altrows: true,
	    enabletooltips: true,
	    editable: true,
        //filterable: true,
        //sortable: true,
        //pageable: true,
	    selectionmode: 'multiplecellsadvanced',
	    columns: refcolumns[reference]
	});	
}

function loaddata(reference, rows){

	refdata = [];
	if(reference.indexOf("radiators") != -1){
	  for (var i=0; i< rows.length; i++){
		  refdata.push({'height': rows[i].height, 'one': rows[i].one,
			  'two': rows[i].two, 'three': rows[i].three, 'four': rows[i].four,
			  'five': rows[i].five, 'six': rows[i].six, 'window': rows[i].window});
	  }
	} else if (reference == 'groundtemp'){
		for (var i=0; i<rows.length; i++){
			refdata.push({'depth': rows[i].depth, 'temp': rows[i].temp});
		}
	}
	return refdata;
	
}

function emptyrows(){
	for (var i=0; i<50; i++){
		$("#reference-grid").jqxGrid('addrow', null, {});
	}
}