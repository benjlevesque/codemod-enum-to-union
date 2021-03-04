import { transform } from "ts-codemod";

import EnumToUnionTransformation from "../src/EnumToUnionTransformation";

describe("EnumToUnionTransformation", () => {
  it("should transform an enum", () => {
    expect(
      transform({
        content: `
       enum MyEnum {
          FOO = "foo",
          BAR = "bar2",
        }`,
        transformationCtor: EnumToUnionTransformation,
        params: {},
        path: "./fixture/test.tsfixture",
      }).newContent
    ).toMatchInlineSnapshot(`
      "export const MyEnum = ({
          FOO: \\"foo\\",
          BAR: \\"bar2\\"
      } as const);
      ;
      export type MyEnum = typeof MyEnum[keyof typeof MyEnum];
      "
    `);
  });
});
