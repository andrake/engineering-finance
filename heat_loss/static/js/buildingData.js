$( document ).ready(function() {
    getAllScenarios();
});


function getAllScenarios(){
	$.ajax({
		type: "GET",
		contentType: "application/json",
		url: "occupancy/all",
		error: function(jqXHR, textStatus, errorThrown) {
			  console.log(textStatus, errorThrown, jqXHR.error());
			},
		success: function(data){
			console.log(data.buildings);
			for(var i=0; i<data.buildings.length; i++){
				$("#saved-scenarios").append('<option value="' + data.buildings[i] + '">' + data.buildings[i] + '</option>');
			}
			}
});
}

function saveBuilding(){
	var building = $("#buildingname").val();
	var rows = $('#building-grid').jqxGrid('getrows');
	//var table = $("#reference-select").val();
	console.log(rows);
	
	$.ajax({
		type: "POST",
		contentType: "application/json",
		url: "occupancy/" + building,
		//headers:  { 'X-CSRF-Token': token },
		data: JSON.stringify({"building":building, "occupancy":rows}),
		error: function(jqXHR, textStatus, errorThrown) {
			  console.log(textStatus, errorThrown, jqXHR.error());
			},
		success: function(data){
			console.log(data);
			alert("Schedule saved")
			//accountgrids(data);
			}
});
}


function getSavedScenario(){
	var building = $("#saved-scenarios").val();
	var refdata = [];
	
	$.ajax({
		type: "GET",
		contentType: "application/json",
		url: "occupancy/" + building,

		error: function(jqXHR, textStatus, errorThrown) {
			  console.log(textStatus, errorThrown, jqXHR.error());
			//empty rows
		  		for (var i=0; i<50; i++){
		  			refdata.push({'hour':''});
		  		}
		  		buildtable(refdata);
			},

		success: function(data){
			console.log(data);
			$("#buildingname").val(data.building);
			  var rows = data.occupancy;
			  if(rows){
				  for (var i=0; i< rows.length; i++){
					  refdata.push({'hour': rows[i].hour, '1': rows[i].sun,
						  '2': rows[i].mon, '3': rows[i].tue, '4': rows[i].wed,
						  '5': rows[i].thu, '6': rows[i].fri, '7': rows[i].sat});
				  }
				  	buildtable(rows);				  
			  } else {
			  		for (var i=0; i<50; i++){
			  			refdata.push({'hour':''});
			  		}
			  		buildtable(refdata);
			  }

		}
	});
}

function buildtable(rows){
	var refdatafields = [{ name: 'hour', type: 'integer' }, { name: '1', type: 'bool' }, { name: '2', type: 'bool' }, {name: '3', type: 'bool'}, {name: '4', type: 'bool'},
	                     {name: '5', type: 'bool'}, {name: '6', type: 'bool'}, {name: '7', type: 'bool'}];
	var varcolumns = [
	        	          { text: 'Hour', datafield: 'hour', width: 100, align: 'center', cellsalign:'center' },
	        	          { text: 'Sun', datafield: '1', width: 100, align: 'center', cellsalign:'center' },
	        	          { text: 'Mon', datafield: '2', width: 100, align: 'center', cellsalign:'center' },
	        	          { text: 'Tue', datafield: '3', width: 100, align: 'center', cellsalign:'center'},
	        	          { text: 'Wed', datafield: '4', width: 100, align: 'center', cellsalign:'center' },
	        	          { text: 'Thu', datafield: '5', width: 100, align: 'center', cellsalign:'center' },
	        	          { text: 'Fri', datafield: '6', width: 100, align: 'center', cellsalign:'center' },
	        	          { text: 'Sat', datafield: '7', width: 100, align: 'center', cellsalign:'center' },
	        	      ];

	var source =
	{
	    datatype: "array",
	    localdata: rows,
	    datafields: refdatafields,
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
	
	$("#building-grid").jqxGrid(
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
        //filterable: true,
        //sortable: true,
        //pageable: true,
	    selectionmode: 'multiplecellsadvanced',
	    columns: varcolumns
	});	
}