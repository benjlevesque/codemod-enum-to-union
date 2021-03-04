import * as ts from "typescript";
import { Transformation } from "ts-codemod";

export default class EnumToUnionTransformation extends Transformation {
  constructor(path: string, ctx: ts.TransformationContext, params: {}) {
    super(path, ctx, params);
  }
  visit(node: ts.Node): ts.VisitResult<ts.Node> {
    if (!ts.isEnumDeclaration(node)) {
      return node;
    }
    if (node.members[0]?.initializer?.kind !== ts.SyntaxKind.StringLiteral) {
      return node;
    }

    // Convert enum values to variable body "{...}""
    const constEnumDeclaration = ts.createObjectLiteral(
      node.members.map((x) =>
        ts.createPropertyAssignment(x.name, x.initializer!)
      ),
      true
    );

    // "(...) as const" to avoid typing as string
    const enumAsConst = ts.createAsExpression(
      constEnumDeclaration,
      ts.createTypeReferenceNode("const", [])
    );

    // convert "export enum MyEnum {...}" to "export const MyEnum = {...} as const"
    const constEnum = ts.createVariableStatement(
      [ts.createModifier(ts.SyntaxKind.ExportKeyword)],
      ts.createVariableDeclarationList(
        [ts.createVariableDeclaration(node.name, undefined, enumAsConst)],
        ts.NodeFlags.Const
      )
    );

    // "typeof MyEnum"
    const typeofIdentifer = ts.createTypeQueryNode(
      ts.createIdentifier(node.name.getText())
    );
    // keyof typeof MyEnum
    const keyofTypeof = ts.createTypeOperatorNode(
      ts.SyntaxKind.KeyOfKeyword,
      typeofIdentifer
    );

    // export type MyEnum = typeof MyEnum[keyof typeof MyEnum]
    const typeAlias = ts.createTypeAliasDeclaration(
      [],
      [ts.createModifier(ts.SyntaxKind.ExportKeyword)],
      node.name,
      [],
      ts.createIndexedAccessTypeNode(typeofIdentifer, keyofTypeof)
    );

    return [constEnum, ts.createEmptyStatement(), typeAlias];
  }
}
