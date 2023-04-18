const { getParser } = require('codemod-cli').jscodeshift;
const { getOptions } = require('codemod-cli');

const DEFAULT_OPTIONS = {
  macros: ['alias', 'and', 'equal', 'gt', 'gte', 'lt', 'lte', 'or', 'readOnly'],
  addComputedDecorator: false,
};

function removeMacroImport(j, root, macro) {
  // Remove macro from import specifier
  root
    .find(j.ImportDeclaration)
    .filter((path) => path.node.source.value === '@ember/object/computed')
    .find(j.ImportSpecifier)
    .filter((path) => path.node.imported.name === macro)
    .remove();

  // Remove import if it's empty
  root
    .find(j.ImportDeclaration)
    .filter((path) => path.node.source.value === '@ember/object/computed')
    .filter((path) => path.node.specifiers.length === 0)
    .remove();
}

function addComputedImport(j, root) {
  // Finding all ember object imports
  const emberObjectImports = root
    .find(j.ImportDeclaration)
    .filter((path) => path.node.source.value === '@ember/object');

  // Build our new import specifier
  const importSpecifier = j.importSpecifier(j.identifier('computed'));

  if (emberObjectImports.length) {
    // If there is an existing import, add it there
    emberObjectImports
      .filter((emberObjectImport) =>
        emberObjectImport.node.specifiers.some(
          (specifier) => specifier.imported.name !== 'computed'
        )
      )
      .forEach((emberObjectImport) =>
        // Replace the existing node with a new one
        j(emberObjectImport).replaceWith(
          // Build a new import declaration node based on the existing one
          j.importDeclaration(
            [...emberObjectImport.node.specifiers, importSpecifier], // Insert our new import specificer
            emberObjectImport.node.source
          )
        )
      );
  } else {
    // If there is no existing import, add a new one
    const newImport = j.importDeclaration([importSpecifier], j.stringLiteral('@ember/object'));
    root.get().node.program.body.unshift(newImport);
  }
}

function addComputedDecorator(j, getter, dependentKeys) {
  const decoratorExpression = j.callExpression(
    j.identifier('computed'),
    dependentKeys.map((dependentKey) => j.literal(dependentKey))
  );

  getter.decorators = getter.decorators || [];
  getter.decorators.push(j.decorator(decoratorExpression));
}

module.exports = function transformer(file, api) {
  const j = getParser(api);
  const root = j(file.source);
  const configOptions = Object.assign({}, DEFAULT_OPTIONS, getOptions());
  let shouldAddComputedImport = false;
  const isClassSyntax = root.find(j.ClassProperty, {
    decorators: [{}],
  }).length;

  root
    .find(j.ClassProperty, {
      decorators: [{}],
    })
    .forEach((path) => {
      let decorator = path.node.decorators[0];
      if (!decorator.expression.callee) {
        return;
      }

      let macro = decorator.expression.callee.name;
      if (!configOptions.macros.includes(macro)) {
        return;
      }
      let propertyName = path.node.key.name;

      switch (macro) {
        case 'readOnly': {
          let dependentKey = decorator.expression.arguments[0].value;
          let returned = j.memberExpression(j.thisExpression(), j.identifier(dependentKey));
          let body = j.blockStatement([j.returnStatement(returned)]);
          let getter = j.methodDefinition(
            'get',
            j.identifier(propertyName),
            j.functionExpression(null, [], body)
          );

          if (configOptions.addComputedDecorator) {
            addComputedDecorator(j, getter, [dependentKey]);
            shouldAddComputedImport = true;
          }

          j(path).replaceWith(getter);
          break;
        }
        case 'equal': {
          let dependentKey = decorator.expression.arguments[0].value;
          let compareLiteral = decorator.expression.arguments[1];
          let returned = j.memberExpression(j.thisExpression(), j.identifier(dependentKey));
          let returnedEqualCheck = j.binaryExpression('===', returned, compareLiteral);
          let body = j.blockStatement([j.returnStatement(returnedEqualCheck)]);
          let getter = j.methodDefinition(
            'get',
            j.identifier(propertyName),
            j.functionExpression(null, [], body)
          );

          if (configOptions.addComputedDecorator) {
            addComputedDecorator(j, getter, [dependentKey]);
            shouldAddComputedImport = true;
          }

          j(path).replaceWith(getter);
          break;
        }
        case 'alias': {
          let dependentKey = decorator.expression.arguments[0].value;
          let returned = j.memberExpression(j.thisExpression(), j.identifier(dependentKey));
          let getterBody = j.blockStatement([j.returnStatement(returned)]);
          let getter = j.methodDefinition(
            'get',
            j.identifier(propertyName),
            j.functionExpression(null, [], getterBody)
          );

          let setterBody = j.blockStatement([
            j.expressionStatement(j.assignmentExpression('=', returned, j.identifier('value'))),
          ]);
          let setter = j.methodDefinition(
            'set',
            j.identifier(propertyName),
            j.functionExpression(null, [j.identifier('value')], setterBody)
          );

          if (configOptions.addComputedDecorator) {
            addComputedDecorator(j, getter, [dependentKey]);
            shouldAddComputedImport = true;
          }

          j(path).replaceWith([getter, setter]);
          break;
        }
        case 'and':
        case 'or': {
          let operator = macro === 'or' ? '||' : '&&';
          let dependentKey1 = decorator.expression.arguments[0].value;
          let dependentKey2 = decorator.expression.arguments[1].value;
          let chainedOperators = j.logicalExpression(
            operator,
            j.memberExpression(j.thisExpression(), j.identifier(dependentKey1), false),
            j.memberExpression(j.thisExpression(), j.identifier(dependentKey2), false)
          );
          decorator.expression.arguments.slice(2).forEach((dependentKey) => {
            chainedOperators = j.logicalExpression(
              operator,
              chainedOperators,
              j.memberExpression(j.thisExpression(), j.identifier(dependentKey.value), false)
            );
          });
          let body = j.blockStatement([j.returnStatement(chainedOperators)]);
          let getter = j.methodDefinition(
            'get',
            j.identifier(propertyName),
            j.functionExpression(null, [], body)
          );

          if (configOptions.addComputedDecorator) {
            addComputedDecorator(
              j,
              getter,
              decorator.expression.arguments.map((argument) => argument.value)
            );
            shouldAddComputedImport = true;
          }

          j(path).replaceWith(getter);
          break;
        }
        case 'gt':
        case 'gte':
        case 'lt':
        case 'lte': {
          let operatorMap = {
            gt: '>',
            gte: '>=',
            lt: '<',
            lte: '<=',
          };
          let operator = operatorMap[macro];
          let dependentKey = decorator.expression.arguments[0].value;
          let compareValue = decorator.expression.arguments[1];
          let returned = j.memberExpression(j.thisExpression(), j.identifier(dependentKey));
          let returnedCompare = j.binaryExpression(operator, returned, compareValue);
          let body = j.blockStatement([j.returnStatement(returnedCompare)]);
          let getter = j.methodDefinition(
            'get',
            j.identifier(propertyName),
            j.functionExpression(null, [], body)
          );

          if (configOptions.addComputedDecorator) {
            addComputedDecorator(j, getter, [dependentKey]);
            shouldAddComputedImport = true;
          }

          j(path).replaceWith(getter);
          break;
        }
      }
    });

  // Remove computed macro imports
  if (isClassSyntax) {
    configOptions.macros.forEach((macro) => removeMacroImport(j, root, macro));
  }

  if (shouldAddComputedImport) {
    addComputedImport(j, root);
  }

  return root.toSource({ quote: 'single' });
};

module.exports.type = 'js';
