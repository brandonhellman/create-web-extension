import path from "path";

// Resolve the path to the package (this package's root directory)
function resolveToPackage(relativePath: string) {
  return path.resolve(path.join(__dirname, "..", ".."), relativePath);
}

export const pathToPackage = {
  root: resolveToPackage("."),
  nodeModules: resolveToPackage("node_modules"),
  packageJson: resolveToPackage("package.json"),
  /*
  templates: {
    react: resolveToPackage("/templates/react/"),
    typescript: resolveToPackage("/templates/typescript/"),
    gitignore: resolveToPackage("/templates/.gitignore"),
    readme: resolveToPackage("/templates/README.md"),
  },
  */
};
