$( document ).ready(function() {
    getAllScenarios();
});


function getAllScenarios(){
	$.ajax({
		type: "GET",
		contentType: "application/json",
		url: "heatlossscenarios/all",
		error: function(jqXHR, textStatus, errorThrown) {
			  console.log(textStatus, errorThrown, jqXHR.error());
			},
		success: function(data){
			console.log(data.scenarios);
			for(var i=0; i<data.scenarios.length; i++){
				$("#saved-scenarios").append('<option value="' + data.scenarios[i] + '">' + data.scenarios[i] + '</option>');
			}
			for(var i=0; i<data.weather.length; i++){
				$("#weather").append('<option value="' + data.weather[i] + '">' + data.weather[i] + '</option>');
			}
			for(var i=0; i<data.occupancy.length; i++){
				$("#occupancy").append('<option value="' + data.occupancy[i] + '">' + data.occupancy[i] + '</option>');
			}
			
			}
});
}

function getSavedScenario(){
	var scenario = $("#saved-scenarios").val();
	$.ajax({
		type: "GET",
		contentType: "application/json",
		url: "heatlossscenarios/"+scenario,
		error: function(jqXHR, textStatus, errorThrown) {
			  console.log(textStatus, errorThrown, jqXHR.error());
			},
		success: function(data){
			console.log(data);
			//debugger;
			var scenarioform = data.reftable.scenario;
			var heatlossdata = data.reftable.heatlossdata;
			var rows = []
			$('#table-title').val(scenarioform.scenarioname);
			for (var formkey in scenarioform){
				$("#" + formkey).val(scenarioform[formkey]);
			}
			for (var i=0; i<heatlossdata.timestamp.length; i++){
				rows.push({
					'timestamp':heatlossdata.timestamp[i], 'clockhour':heatlossdata.clockhour[i],
					'dayofweek':heatlossdata.dayofweek[i], 'occupancy': heatlossdata.occupancy[i],
					'temperature': heatlossdata.temperature[i], 'deltat':heatlossdata.deltat[i],
					'belowgradedeltat': heatlossdata.belowgradedeltat[i], 'designloaddeltat': heatlossdata.designloaddeltat[i],
					'ceilingheatfactor': heatlossdata.ceilingheatfactor[i].toFixed(3), 'ceilingheatloss': heatlossdata.ceilingheatloss[i].toFixed(3),
					'doorheatfactor': heatlossdata.doorheatfactor[i].toFixed(3), 'doorheatloss': heatlossdata.doorheatloss[i].toFixed(3),
					'floorheatfactor': heatlossdata.floorheatfactor[i].toFixed(3), 'floorheatloss': heatlossdata.floorheatloss[i].toFixed(3),
					'wallheatfactorabove': heatlossdata.wallheatfactorabove[i].toFixed(3),
					'wallheatfactorbelow': heatlossdata.wallheatfactorbelow[i].toFixed(3),
					'wallheatloss': heatlossdata.wallheatloss[i].toFixed(3),
					'infiltration': heatlossdata.infiltration[i].toFixed(3),
					'windownorthheatfactor': heatlossdata.windownorthheatfactor[i].toFixed(3), 'windownorthheatloss': heatlossdata.windownorthheatloss[i].toFixed(3),
					'windowwestheatfactor': heatlossdata.windowwestheatfactor[i].toFixed(3), 'windowwestheatloss': heatlossdata.windowwestheatloss[i].toFixed(3),
					'windoweastheatfactor': heatlossdata.windoweastheatfactor[i].toFixed(3), 'windoweastheatloss': heatlossdata.windoweastheatloss[i].toFixed(3),
					'windowsouthheatfactor': heatlossdata.windowsouthheatfactor[i].toFixed(3), 'windowsouthheatloss': heatlossdata.windowsouthheatloss[i].toFixed(3),
					'windowsheatloss': heatlossdata.windowsheatloss[i].toFixed(3),
					'totalheatlossscaled': heatlossdata.totalheatlossscaled[i].toFixed(3),
					'totalheatloss': heatlossdata.totalheatloss[i].toFixed(3),
				});
			}
			buildtable(rows);
			}
			
	});
	
	return false;
}


function createInputs(){
	var tempfields = inputfield(tempinputs);
	inputblock(temptitle, tempfields, "temp");
	
	var bldgfields = inputfield(bldginputs);
	inputblock(bldgtitle, bldgfields, 'building');
	
	var compfields = inputfield(compinputs);
	inputblock(comptitle, compfields, 'components');
	
	var ufields = inputfield(uinputs);
	inputblock(utitle, ufields, 'uvalues');
	
	var infilfields = inputfield(infilinputs);
	inputblock(infiltitle, infilfields, 'infiltration');
	
	
}

var weather = [{'weather': 'Weather'}];
var occupancy = [{'occupancy': 'Occupancy'}];
var utilitybill = [{'utilitybill': 'Utility Bill'}];

var temptitle = "Temperature   &deg;";
var tempinputs = [{"indoortemp":"Indoor Temp"}, {"setbacktemp":"Set-Back Temp"}, {"designtemp":"Design Temp"}, {"meangroundtemp":"Mean Ground Temp"}, {"soiltemp":"Soil Temp"}];

var bldgtitle = "Building Dimensions";
var bldginputs = [{"bldgheight":"Height"}, {"bldgfloorarea":"Floor Area"}, {"bldgvolume":"Volume"}, {"belowgradeflag":"Below Grade Flag"}, {"bldgdepth":"Depth"}, {"belowgradeamount":"Below Grade Amount"}];

var comptitle = "Component Dimensions   Area(ft2)";
var compinputs = [{"northwindowarea":"North Window"}, {"westwindowarea":"West Window"}, {"eastwindowarea":"East Window"}, {"southwindowarea":"South Window"},
                  {"ceilingarea":"Ceiling"}, {"doorsarea":"Doors"}, {"windowsarea":"Windows"}, {"wallsexposed":"Walls Exposed"}, {"wallsexposednet":"Walls Exposed-net"}, {"floorperimeter":"Floor Perimeter(ft)"}];

var utitle = "Overall U values  U or Fp";
var uinputs = [{"uvalueceiling":'Ceiling'}, {"uvaluewall":'Wall'}, {"uvaluedoor":'Door'}, {"uvaluefloor":'Floor'}, {"uvaluenorthwindow":'North Window'}, {"uvaluewestwindow":'West Window'}, {"uvalueeastwindow":'East Window'}, {"uvaluesouthwindow":'South Window'}];

var infiltitle = "Infiltration";
var infilinputs = [{"insulationtype": "Type of Insulation"}, {"ach":"ACH"}, {"airflowcfm":"Airflow CFM"}];

function inputblock(title, inputs, blockid){
	
	var inputgroup = 
			'<div class="form-group">' +
				'<div class="row">' +
					'<div class="col-sm-12 pull-left">' +
						'<h3><small>' + title + '</small></h3>'	+		
					'</div>' +
					
					inputs + 
					
				'</div>' +
			'</div>' ;
	
	$("#"+ blockid).append(inputgroup);
}

function inputfield(inputlist){
	console.log(inputlist, inputlist.length);
	//TODO use input var names as id
	var inputs = '';
	for (var i=0; i < inputlist.length; i ++){
		var varkey = Object.keys(inputlist[i])[0];
		inputs +=
	
		'<div class="row">' +
			'<div class = "col-sm-6">' +
				'<p><small>' + inputlist[i][varkey] + '</small></p>' +
			'</div>' +
	 		'<div class="col-sm-2">' +
				'<input id="' + varkey + '" type=""></input>' +
			'</div>' +
	 	'</div>' ;
	console.log(inputlist[i]);
	}
	return inputs;
}


function saveScenario(){
	var scenario = {};
	if  ($("#scenarioname").val() == ""){
		alert("Scenario must have a name");
		return;
	}
	scenario['scenarioname'] = $("#scenarioname").val();
	
	//TODO add building occupancy and utility bill choice
	
	function addvariables(varlist){
		for(var i=0; i<varlist.length; i++){
			varkey = Object.keys(varlist[i])[0];
			//regex strips all special characters
			console.log($("#" + varkey).val());
			if($("#" + varkey).val() != null){
				scenario[varkey] = $("#" + varkey).val().replace(/[^\w\s]/gi, '');
			} else {
				scenario[varkey] = $("#" + varkey).val();
			}
			
		}
	}
	
	addvariables(weather);
	addvariables(occupancy);
	addvariables(utilitybill);
	addvariables(tempinputs);
	addvariables(bldginputs);
	addvariables(compinputs);
	addvariables(uinputs);
	addvariables(infilinputs);
	console.log(scenario);
	$.ajax({
		type: "POST",
		contentType: "application/json",
		url: "heatlossscenarios/post",
		data: JSON.stringify({"scenario":scenario}),
		error: function(jqXHR, textStatus, errorThrown) {
			  console.log(textStatus, errorThrown, jqXHR.error());
			},
		success: function(data){
			//console.log(data);
			alert("Scenario Saved");
			//accountgrids(data);
			}
});
	
}


function buildtable(rows){
	var refdatafields = [{ name: 'timestamp', type: 'date' }, { name: 'clockhour', type: 'integer' }, { name: 'dayofweek', type: 'integer' },
	                     {name:'occupancy', type: 'integer'}, {name:'temperature', type:'float'}, {name: 'deltat', type: 'integer'},
	                     {name: 'belowgradedeltat', type: 'integer'},
	                     {name: 'designloaddeltat', type: 'integer'}, {name: 'ceilingheatfactor', type: 'float'}, {name: 'ceilingheatloss', type: 'float'},
	                     
	                     {name: 'doorheatfactor', type: 'float'}, {name: 'doorheatloss', type: 'float'},
	                     {name: 'floorheatfactor', type: 'float'}, {name: 'floorheatloss', type: 'float'},
	                     {name: 'wallheatfactorabove', type: 'float'},
	                     {name: 'wallheatfactorbelow', type: 'float'},
	                     {name: 'wallheatloss', type: 'float'},
	                     {name: 'infiltration', type: 'float'}, 
	                     {name: 'windownorthheatfactor', type: 'float'}, {name: 'windownorthheatloss', type: 'float'},
	                     {name: 'windowwestheatfactor', type: 'float'}, {name: 'windowwestheatloss', type: 'float'},
	                     {name: 'windoweastheatfactor', type: 'float'}, {name: 'windoweastheatloss', type: 'float'},
	                     {name: 'windowsouthheatfactor', type: 'float'}, {name: 'windowsouthheatloss', type: 'float'},
	                     {name: 'windowsheatloss', type: 'float'},
	                     {name: 'totalheatlossscaled', type: 'float'},
	                     {name: 'totalheatloss', type: 'float'}

	                     ];
	
	var refcolumns = [
	        	          { text: 'Hour', datafield: 'timestamp', width: 150, align: 'center', cellsalign:'center' },
	        	          { text: 'Clock Hour', datafield: 'clockhour', width: 100, align: 'center', cellsalign:'center' },
	        	          { text: 'Day', datafield: 'dayofweek', width: 100, align: 'center', cellsalign:'center' },
	        	          { text: 'Occupancy', datafield: 'occupancy', width: 100, align: 'center', cellsalign:'center'},
	        	          { text: 'Temp F', datafield: 'temperature', width: 100, align: 'center', cellsalign:'center' },
	        	          { text: 'DeltaT', datafield: 'deltat', width: 100, align: 'center', cellsalign:'center' },
	        	          { text: 'BGDeltaT', datafield: 'belowgradedeltat', width: 100, align: 'center', cellsalign:'center' },
	        	          { text: 'DLDelatT', datafield: 'designloaddeltat', width: 100, align: 'center', cellsalign:'center' },
	        	          { text: 'Ceiling HF', datafield: 'ceilingheatfactor', width: 100, align: 'center', cellsalign:'center' },
	        	          { text: 'Ceiling HL', datafield: 'ceilingheatloss', width: 100, align: 'center', cellsalign:'center' },
	        	          
	        	          { text: 'Door HF', datafield: 'doorheatfactor', width: 100, align: 'center', cellsalign:'center' },
	        	          { text: 'Door HL', datafield: 'doorheatloss', width: 100, align: 'center', cellsalign:'center' },
	        	          
	        	          { text: 'Floor HF', datafield: 'floorheatfactor', width: 100, align: 'center', cellsalign:'center' },
	        	          { text: 'Floor HL', datafield: 'floorheatloss', width: 100, align: 'center', cellsalign:'center' },
	        	          
	        	          { text: 'Wall HFA', datafield: 'wallheatfactorabove', width: 100, align: 'center', cellsalign:'center' },
	        	          { text: 'Wall HFB', datafield: 'wallheatfactorbelow', width: 100, align: 'center', cellsalign:'center' },
	        	          { text: 'Wall HL', datafield: 'wallheatloss', width: 100, align: 'center', cellsalign:'center' },
	        	          
	        	          { text: 'Infiltration', datafield: 'infiltration', width: 100, align: 'center', cellsalign:'center' },
	        	          
	        	          { text: 'WinN HF', datafield: 'windownorthheatfactor', width: 100, align: 'center', cellsalign:'center' },
	        	          { text: 'WinN HL', datafield: 'windownorthheatloss', width: 100, align: 'center', cellsalign:'center' },
	        	          
	        	          { text: 'WinW HF', datafield: 'windowwestheatfactor', width: 100, align: 'center', cellsalign:'center' },
	        	          { text: 'WinW HL', datafield: 'windowwestheatloss', width: 100, align: 'center', cellsalign:'center' },
	        	          
	        	          { text: 'WinE HF', datafield: 'windoweastheatfactor', width: 100, align: 'center', cellsalign:'center' },
	        	          { text: 'WinE HL', datafield: 'windoweastheatloss', width: 100, align: 'center', cellsalign:'center' },
	        	          
	        	          { text: 'WinS HF', datafield: 'windowsouthheatfactor', width: 100, align: 'center', cellsalign:'center' },
	        	          { text: 'WinS HL', datafield: 'windowsouthheatloss', width: 100, align: 'center', cellsalign:'center' },
	        	          
	        	          { text: 'Windows HL', datafield: 'windowsheatloss', width: 100, align: 'center', cellsalign:'center' },
	        	          { text: 'T HL Scaled', datafield: 'totalheatlossscaled', width: 100, align: 'center', cellsalign:'center' },
	        	          { text: 'T HL Gross', datafield: 'totalheatloss', width: 100, align: 'center', cellsalign:'center' }
	        	          
	        	      ];

	var source =
	{
	    datatype: "array",
	    localdata: rows,
	    datafields: refdatafields,
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
		    if (row == 0) {
		        //editor.jqxDropDownList({autoDropDownHeight: true,  width: width, height: height, source: ['Lighting', 'Heating', 'Cooling']});
		    }
		
		}
		var initGridEditor = function (row, cellValue, editor, cellText, width, height) {
		    // set the editor's current value. The callback is called each time the editor is displayed.
		    if (row == 0) {
		        //editor.jqxDropDownList('selectItem', cellValue);
		    }
		
		}
		var gridEditorValue = function (row, cellValue, editor) {
		
		}
	
	$("#reference-grid").jqxGrid(
	{
	    source: dataAdapter,
	    columnsresize: true,
	    width: 1000,
	    //theme: 'energyblue',
	    //autoheight: true,
	    altrows: true,
	    enabletooltips: true,
	    editable: true,
        filterable: true,
        sortable: true,
        pageable: true,
	    selectionmode: 'multiplecellsadvanced',
	    columns: refcolumns
	});	
}

$("#excelExport").click(function () {
	alert('starting upload');
    $("#reference-grid").jqxGrid('exportdata', 'xls', 'jqxGrid');           
});

$(document).ready(function(){
    $(document).ajaxStart(function(){
        $("#wait").css("display", "block");
    });
    $(document).ajaxComplete(function(){
        $("#wait").css("display", "none");
    });

});