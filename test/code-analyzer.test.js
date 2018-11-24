import assert from 'assert';
import {parseCode} from '../src/js/code-analyzer';

describe('The javascript parser', () => {
    it('is parsing an empty function correctly', () => {
        assert.equal(
            JSON.stringify(parseCode('')),
            '[]'
        );
    });

    it('is parsing a simple variable declaration correctly', () => {
        assert.equal(
            JSON.stringify(parseCode('let a = 1;')),
            '[{"line":1,"type":"VariableDeclaration","name":"a","condition":"","value":1}]');
    });
    it('is parsing a simple variable declaration 2 correctly', () => {
        assert.equal(
            JSON.stringify(parseCode('var a;')),
            '[{"line":1,"type":"VariableDeclaration","name":"a","condition":"","value":"null (or nothing)"}]');
    });

    it('is parsing a function declaration correctly', () => {
        assert.equal(
            JSON.stringify(parseCode('function max(a, b){}')),
            '[{"line":1,"type":"FunctionDeclaration","name":"max","condition":"","value":""},{"line":1,"type":"variable declaration","name":"a","condition":"","value":""},{"line":1,"type":"variable declaration","name":"b","condition":"","value":""}]');
    });

    it('is parsing a while statement correctly', () => {
        assert.equal(
            JSON.stringify(parseCode('while (i>0){\n' +
                'i= i+2;\n' +
                '}')),
            '[{"line":1,"type":"WhileStatement","name":"","condition":"i > 0","value":""},{"line":2,"type":"AssignmentExpression","name":"i","condition":"","value":"i + 2"}]');
    });

    ///from this part- write expected!!!


    // update exp should be after for dec
    it('is parsing a for statement correctly', () => {
        assert.equal(
            JSON.stringify(parseCode('for (var i=0; i<5; i++){\n' +
                'M[i]= -1;\n' +
                '}')),
            '[{"line":1,"type":"VariableDeclaration","name":"i","condition":"","value":0},{"line":1,"type":"UpdateExpression","name":"","condition":"","value":"i++"},{"line":1,"type":"ForStatement","name":"","condition":"i<5","value":""},{"line":2,"type":"AssignmentExpression","name":"M[i]","condition":"","value":" - 1"}]'
        );
    });

    it('is parsing an if_Statement correctly', () => {
        assert.equal(
            JSON.stringify(parseCode('if (x==1) x=0;\n' +
                'if (x==2) x=1;')),
            '[{"line":1,"type":"AssignmentExpression","name":"x","condition":"","value":0},{"line":1,"type":"IfStatement","name":"","condition":"x==1","value":""},{"line":2,"type":"AssignmentExpression","name":"x","condition":"","value":1},{"line":2,"type":"IfStatement","name":"","condition":"x==2","value":""}]'
        );
    });

    it('is parsing an if_else_Statement correctly', () => {
        assert.equal(
            JSON.stringify(parseCode('if (x<2) \n' +
                'x=2;\n' +
                'else if (x>3) \n' +
                'x=3;')),
            '[{"line":1,"type":"IfStatement","name":"","condition":"x < 2","value":""},{"line":2,"type":"AssignmentExpression","name":"x","condition":"","value":2},{"line":3,"type":"ElseIfStatement","name":"","condition":"x>3","value":""},{"line":4,"type":"AssignmentExpression","name":"x","condition":"","value":3}]'
        );
    });

    it('is parsing an if_else_Statement_2 correctly', () => {
        assert.equal(
            JSON.stringify(parseCode('if (x==1) x=0;\n' +
                'else if (x==2) x=1;\n' +
                'else if (x==3) x=2;')),
            '[{"line":1,"type":"AssignmentExpression","name":"x","condition":"","value":0},{"line":1,"type":"IfStatement","name":"","condition":"x==1","value":""},{"line":2,"type":"AssignmentExpression","name":"x","condition":"","value":1},{"line":2,"type":"ElseIfStatement","name":"","condition":"x==2","value":""},{"line":3,"type":"AssignmentExpression","name":"x","condition":"","value":2},{"line":3,"type":"ElseIfStatement","name":"","condition":"x==3","value":""}]'
        );
    });

    it('is parsing a return statement correctly', () => {
        assert.equal(
            JSON.stringify(parseCode('function A(){\n' +
                'return x;\n' +
                '}')),
            '[{"line":1,"type":"FunctionDeclaration","name":"A","condition":"","value":""},{"line":2,"type":"ReturnStatement","name":"","condition":"","value":"x"}]'
        );
    });

    it('is parsing a binary exp correctly', () => {
        assert.equal(
            JSON.stringify(parseCode('let x= y+2;')),
            '[{"line":1,"type":"VariableDeclaration","name":"x","condition":"","value":"y+2"}]'
        );
    });

    it('is parsing a binary exp from both sides correctly', () => {
        assert.equal(
            JSON.stringify(parseCode('if (x+1 > c-2)\n' +
                'x=3;')),
            '[{"line":1,"type":"IfStatement","name":"","condition":"x+1>c-2","value":""},{"line":2,"type":"AssignmentExpression","name":"x","condition":"","value":3}]'
        );
    });

    it('is parsing an unary exp correctly', () => {
        assert.equal(
            JSON.stringify(parseCode('let b= -1;')),
            '[{"line":1,"type":"VariableDeclaration","name":"b","condition":"","value":"-1"}]'
        );
    });

    it('is parsing a member exp correctly', () => {
        assert.equal(
            JSON.stringify(parseCode('M[1]=4;\n' +
                'x= M[i];')),
            '[{"line":1,"type":"AssignmentExpression","name":"M[1]","condition":"","value":4},{"line":2,"type":"AssignmentExpression","name":"x","condition":"","value":"M[i]"}]'
        );
    });

    it('is parsing an update exp correctly', () => {
        assert.equal(
            JSON.stringify(parseCode('i++;')),
            '[{"line":1,"type":"UpdateExpression","name":"","condition":"","value":"i++"}]'
        );
    });

    it('is parsing a remove_doubles_func correctly', () => {
        assert.equal(
            JSON.stringify(parseCode('if (x==1) \n' +
                'x=2;\n' +
                'else if (x>1) \n' +
                'x=3;\n' +
                'else if (x<0)\n' +
                'x=0;\n' +
                'else \n' +
                'x=-1;')),
            '[{"line":1,"type":"IfStatement","name":"","condition":"x==1","value":""},{"line":2,"type":"AssignmentExpression","name":"x","condition":"","value":2},{"line":3,"type":"ElseIfStatement","name":"","condition":"x>1","value":""},{"line":4,"type":"AssignmentExpression","name":"x","condition":"","value":3},{"line":5,"type":"ElseIfStatement","name":"","condition":"x<0","value":""},{"line":6,"type":"AssignmentExpression","name":"x","condition":"","value":0},{"line":8,"type":"AssignmentExpression","name":"x","condition":"","value":"-1"}]'
        );
    });

    it('is parsing an empty function correctly', () => {
        assert.equal(
            JSON.stringify(parseCode('')),
            '[]'
        );
    });

});
