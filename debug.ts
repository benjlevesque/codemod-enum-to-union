import {
  createSourceFile,
  NodeArray,
  ScriptTarget,
  Node,
  SyntaxKind,
} from "typescript";
import * as fs from "fs";

const { statements } = createSourceFile(
  process.argv[2],
  fs.readFileSync(process.argv[2]).toString(),
  ScriptTarget.ES2017
);

const debug = (statements: NodeArray<Node>) => {
  return statements.map(
    ({ kind, modifiers, flags, parent, decorators, pos, end, ...rest }) => {
      return {
        kind: SyntaxKind[kind],
        modifiers: modifiers?.map((mod) => SyntaxKind[mod.kind]),
        ...Object.keys(rest).reduce((prev, curr) => {
          const val = (rest as any)[curr];
          if (val instanceof Array) {
            prev[curr] = debug(val as any);
          } else if (typeof val === "object") {
            prev[curr] = debug([val] as any);
          } else {
            prev[curr] = val;
          }
          return prev;
        }, {} as any),
      };
    }
  );
};

console.log(JSON.stringify(debug(statements), null, 1));
