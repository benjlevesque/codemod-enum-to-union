# Codemod for enum to union transformation

Convert Enums to Union types, as describe in https://rlee.dev/writing/stop-misusing-typescript-string-enums

- Input
```ts
enum MyEnum {
  FOO = "foo",
  BAR = "bar2",
}
```

- Output (after running prettier)
```ts
export const MyEnum = {
    FOO: "foo",
    BAR: "bar2"
} as const;
export type MyEnum = typeof MyEnum[keyof typeof MyEnum];
```


## Usage
1. install [ts-codemod](https://github.com/tusharmath/ts-codemod/)
2. Clone this repo
3. Make sure you have no local changes in your project's repo
4. Run these commands
```
# run the transformation
ts-codemod -t ./index.ts path/to/your/project/repo/src/**/*.ts

# cleanup the code (optional)
yarn prettier --write  path/to/your/project/repo/src/**/*.ts

cd path/to/your/project/repo

# remove whitespaces difference (optional)
git diff --ignore-blank-lines | git apply --cached
git checkout -- ./
``` 