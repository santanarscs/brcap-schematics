import {
  Rule,
  SchematicContext,
  Tree,
  apply,
  url,
  mergeWith,
  MergeStrategy,
  move,
  template,
  filter,
  SchematicsException,
  chain,
} from "@angular-devkit/schematics";
import { normalize, strings } from "@angular-devkit/core";
import * as ts from "typescript";

import { NodePackageInstallTask } from "@angular-devkit/schematics/tasks";
import { NodePackageTaskOptions } from "@angular-devkit/schematics/tasks/package-manager/options";

export function featuresModule(_options: any): Rule {
  console.log("asldkjf");
  return (tree: Tree, _context: SchematicContext) => {
    const folderPath = normalize(
      strings.dasherize(_options.path + "/" + _options.name)
    );
    // const workspace = getWorkspace(_options, tree);

    let files = url("./files");

    const newTree = apply(files, [
      move(folderPath),
      template({
        ...strings,
        ..._options,
      }),
      specFilter(_options),
    ]);

    const templateRule = mergeWith(newTree, MergeStrategy.Default);
    // const updateModuleRule = updateRootModule(_options, workspace);
    const installBrCapViewComponentRule = installBrCapViewComponent();
    const chainedRule = chain([
      templateRule,
      // updateModuleRule,
      installBrCapViewComponentRule,
    ]);
    return chainedRule(tree, _context);
  };
}
function specFilter(_options: any): Rule {
  if (_options.spec === "false") {
    return filter((path) => {
      return !path.match(/\.spec\.ts$/) && !path.match(/test\.ts$/);
    });
  }
  return filter((path) => !path.match(/test\.ts$/));
}

// function getWorkspace(_options: any, tree: Tree) {
//   const workspace = tree.read("/angular.json");

//   if (!workspace) {
//     throw new SchematicsException("angular.json file not found!");
//   }

//   return JSON.parse(workspace.toString());
// }

// function updateRootModule(_options: any, workspace: any): Rule {
//   return (tree: Tree, _context: SchematicContext): Tree => {
//     _options.project =
//       _options.project === "defaultProject"
//         ? workspace.defaultProject
//         : _options.project;

//     const project = workspace.projects[_options.project];
//     const moduleName = strings.dasherize(_options.name);
//     const exportedModuleName = strings.classify(_options.name);
//     const modulePath = strings.dasherize(_options.path);
//     const rootModulePath =
//       `${project.root}/` +
//       `${project.sourceRoot}/` +
//       `${project.prefix}/` +
//       `${project.prefix}.module.ts`;

//     const importContent =
//       `import { ${exportedModuleName}Module } ` +
//       `from './${modulePath}/${moduleName}/${moduleName}.module';`;

//     const moduleFile = getAsSourceFile(tree, rootModulePath);
//     const lastImportEndPos = findlastImportEndPos(moduleFile);
//     const importArrayEndPos = findImportArray(moduleFile);

//     const rec = tree.beginUpdate(rootModulePath);

//     rec.insertLeft(lastImportEndPos + 1, importContent);
//     rec.insertLeft(importArrayEndPos - 1, `, ${exportedModuleName}Module`);
//     tree.commitUpdate(rec);

//     return tree;
//   };
// }

function getAsSourceFile(tree: Tree, path: string): ts.SourceFile {
  const file = tree.read(path);
  if (!file) {
    throw new SchematicsException(`${path} not found`);
  }
  return ts.createSourceFile(
    path,
    file.toString(),
    ts.ScriptTarget.Latest,
    true
  );
}

// function findlastImportEndPos(file: ts.SourceFile): number {
//   let pos: number = 0;
//   file.forEachChild((child: ts.Node) => {
//     if (child.kind === ts.SyntaxKind.ImportDeclaration) {
//       pos = child.end;
//     }
//   });
//   return pos;
// }

// function findImportArray(file: ts.SourceFile): number {
//   let pos: number = 0;

//   file.forEachChild((node: ts.Node) => {
//     if (node.kind === ts.SyntaxKind.ClassDeclaration) {
//       node.forEachChild((classChild: ts.Node) => {
//         if (classChild.kind === ts.SyntaxKind.Decorator) {
//           classChild.forEachChild((moduleDeclaration: ts.Node) => {
//             moduleDeclaration.forEachChild((objectLiteral: ts.Node) => {
//               objectLiteral.forEachChild((property: ts.Node) => {
//                 if (property.getFullText().includes("imports")) {
//                   pos = property.end;
//                 }
//               });
//             });
//           });
//         }
//       });
//     }
//   });

//   return pos;
// }

export function installBrCapViewComponent(): Rule {
  return (tree: Tree, _context: SchematicContext): Tree => {
    const packageJsonPath = "/package.json";
    const materialDepName = "brcap-view-componentsv14";
    const packageJson = getAsSourceFile(tree, packageJsonPath);
    let materialInstalled = false;

    packageJson.forEachChild((node: ts.Node) => {
      if (node.kind === ts.SyntaxKind.ExpressionStatement) {
        node.forEachChild((objectLiteral) => {
          objectLiteral.forEachChild((property) => {
            if (property.getFullText().includes("dependencies")) {
              property.forEachChild((dependency) => {
                if (dependency.getFullText().includes(materialDepName)) {
                  _context.logger.info(
                    "✅️ BrCapViewComponent already installed"
                  );
                  materialInstalled = true;
                }
              });
            }
          });
        });
      }
    });

    if (!materialInstalled) {
      const options = <NodePackageTaskOptions>{
        packageName: materialDepName,
      };
      _context.addTask(new NodePackageInstallTask(options));
      _context.logger.info("🔍 Installing BrCapViewComponent");
    }

    return tree;
  };
}
