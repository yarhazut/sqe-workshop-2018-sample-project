import * as esprima from 'esprima';

var toTable = [];
let main_types= ['FunctionDeclaration', 'VariableDeclarator', 'AssignmentExpression', 'WhileStatement',
    'IfStatement', 'ReturnStatement', 'ForStatement', 'UpdateExpression'];
let main_types_funcs= {
    'FunctionDeclaration': funcDecleration,
    'VariableDeclarator': varDeclerator,
    'AssignmentExpression': assignmentExp,
    'WhileStatement': whileStatement,
    'IfStatement': ifStatement,
    'ReturnStatement': returnStatement,
    'ForStatement': forStatement,
    'UpdateExpression': update_exp
};
let exp_types= {
    'Identifier': identifier,
    'Literal': literal,
    'BinaryExpression': binary_exp,
    'UnaryExpression': unary_exp,
    'MemberExpression': member_exp
};

// const parseCode = (codeToParse) => {
//     return esprima.parseScript(codeToParse);
// };

const parseCode = (codeToParse) => {
    //return esprima.parseScript(codeToParse,{loc: true});
    toTable = [];
    esprima.parseScript(codeToParse,{loc: true}, function(node,metadata){
        //et c= metadata.start.line;
        if (main_types.includes(node.type))
            main_types_funcs[node.type](node, metadata);
    });
    toTable.sort((a, b) => Number(a.line) - Number(b.line));
    // toTable.sort(function(a, b) {
    //     return cmp(a.line,b.line) || cmp(a.type,b.type);
    // })
    doubles_remove();
    doubles_remove_2();
    return toTable;
};

function funcDecleration(node, metadata){//v
    toTable.push({'line':metadata.start.line, 'type': node.type, 'name': node.id.name, 'condition': '', 'value':''});
    //for (param in node.params)
    node.params.forEach(function (param) {
        toTable.push({'line':metadata.start.line, 'type': 'variable declaration', 'name': param.name, 'condition': '', 'value':''});
    });
}

function varDeclerator(node, metadata){//v
    var init;
    if (node.init == null)
        init= 'null (or nothing)';
    else
        init= exp_types[node.init.type](node.init);
    toTable.push({'line':metadata.start.line, 'type': 'VariableDeclaration', 'name': node.id.name, 'condition': '', 'value':init});
}

function whileStatement(node, metadata){//v
    let test= exp_types[node.test.type](node.test);
    toTable.push({'line':metadata.start.line, 'type': node.type, 'name': '', 'condition': test, 'value':''});
}

function forStatement(node, metadata){//v
    let test= exp_types[node.test.type](node.test);
    toTable.push({'line':metadata.start.line, 'type': node.type, 'name': '', 'condition': test, 'value':''});
}


function assignmentExp(node, metadata){//v
    let rightVal= exp_types[node.right.type](node.right);
    let leftVal= exp_types[node.left.type](node.left);
    toTable.push({'line':metadata.start.line, 'type': node.type, 'name': leftVal, 'condition': '', 'value':rightVal});
}


function ifStatement(node, metadata){
    let test= exp_types[node.test.type](node.test);
    toTable.push({'line':metadata.start.line, 'type': node.type, 'name': '', 'condition': test, 'value':''});
    if (node.alternate!= null)
        if_elseStatement(node.alternate);
}



function if_elseStatement(node){
    if (node.type=='IfStatement')
    {
        let test= exp_types[node.test.type](node.test);
        toTable.push({'line':node.loc.start.line, 'type': 'ElseIfStatement', 'name': '', 'condition': test, 'value':''});
        if (node.alternate!= null)
            if_elseStatement(node.alternate);
    }
}

function returnStatement(node, metadata){
    let returnd_val= exp_types[node.argument.type](node.argument);
    toTable.push({'line':metadata.start.line, 'type': node.type, 'name': '', 'condition': '', 'value':returnd_val});
}



//exp_types
function binary_exp(node){
    let left='';
    let right='';
    if (node.left.type!='BinaryExpression')
        left= exp_types[node.left.type](node.left);
    else
        left+=binary_exp(node.left);
    if (node.right.type!='BinaryExpression')
        right= exp_types[node.right.type](node.right);
    else
        right+=binary_exp(node.right);
    return left +' ' +node.operator +' ' +right;
}

function unary_exp(node){
    let operator= node.operator;
    let arg_value= exp_types[node.argument.type](node.argument);
    return operator+arg_value;
}

function member_exp(node){
    let object= exp_types[node.object.type](node.object);
    let property= exp_types[node.property.type](node.property);
    return object + '[' + property + ']';
}

function update_exp(node, metadata){
    let up_val= exp_types[node.argument.type](node.argument)+ node.operator;
    toTable.push({'line':metadata.start.line, 'type': node.type, 'name': '', 'condition': '', 'value':up_val});
}

function identifier(node){
    return node.name;
}

function literal(node){
    return node.value;
}

function doubles_remove() {// if vs if- else
    for (var i = 0; i < toTable.length - 1; i++) {
        if (is_double(i))
            toTable.splice(insexOfIF(i), 1);
    }
}

function is_double(i) {
    if (toTable[i].type.includes('IfStatement') && toTable[i + 1].type.includes('IfStatement') && toTable[i].line == toTable[i + 1].line)
        return true;
    return false;
}


function doubles_remove_2(){// if-else vs if-else
    for(var j=0; j< toTable.length-1; j++)
    {
        if (is_double_2(j))
            toTable.splice(insexOfIF(j),1);
    }
}

function is_double_2(j) {
    if (toTable[j].type.includes('ElseIfStatement') && toTable[j+1].type.includes('ElseIfStatement') && (toTable[j].line==toTable[j+1].line))
        return true;
    return false;
}

function insexOfIF(i){
    if (toTable[i].type.valueOf()== 'IfStatement'.valueOf())
        return i;
    return i+1;
}


export {parseCode};
export {toTable};


