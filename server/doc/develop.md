# Development Setup

I got tired of there being too much magic around the tool chain.
So I started over.

## To Do

1. Configure CodeLens the way I want it.
1. Figure out which settings go where.

## Notes

* Settings can be found in several places.

  1. `~/.vscode/extensions`.

  1. `~/Library/Application Support/Code/User/`
     1. `globalStorage`
     1. `settings.json`
     1. `snippets`
     1. `workspaceStorage`

  1. Local `.vscode/` directory

     1. `settings.json` contains various generic settings (e.g., location of TypeScript compiler)

* `CodeLens` is apparently the thingy that annotates code in line.

## Steps

1. Install Visual Studio Code.

2. Install NestJS modules manually (no `init` magic).

       @nestjs/core @nestjs/common rxjs reflect-metadata

   > At this point, VS Code is already detecting issues with TypeScript sources,
   reporting them in the **Problems** window,
   offering IntelliSense completion, snippets,
   etc.

   > VS Code docs: "Visual Studio Code includes TypeScript language support but does not include the TypeScript compiler."

3. Install `typescript` as a development dependency. Because VSCode ships with a TS
implementation, this step is apparently just to pick the desired version of the transpiler.

4. Create an initial `tsconfig.json` file

## Concurrent Execution

    parallel --tag --linebuffer yarn ::: build:watch serve:watch
