import $ from 'jquery';
import {parseCode} from './code-analyzer';
//import toTable from './code-analyzer';

$(document).ready(function () {
    $('#codeSubmissionButton').click(() => {
        //toTable=[];
        let codeToParse = $('#codePlaceholder').val();
        // let parsedCode = parseCode(codeToParse);
        // $('#parsedCode').val(JSON.stringify(parsedCode, null, 2));
        let table = parseCode(codeToParse);
        table.forEach(function(item){
            $('#parsedCode').append('<tr><td>'+item.line+'</td><td>'+item.type+'</td><td>'+item.name+'</td><td>'+item.condition+'</td><td>'+item.value+'</td></tr>');
        });
        //console.log(JSON.stringify(table));
    });


});
