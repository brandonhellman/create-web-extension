import path from "path";
import { type Configuration } from "webpack";
import { getWebExtension } from "./getWebExtension";

export async function getConfig(
  mode: "development" | "production"
): Promise<Configuration> {
  const webExtension = await getWebExtension();

  const config = {
    entry: webExtension.entries,

    module: {
      rules: [
        {
          test: /\.(ts|tsx)$/,
          use: "ts-loader",
          exclude: /node_modules/,
        },
      ],
    },

    resolve: {
      extensions: [".ts", ".tsx", ".js", ".jsx", ".css"],
    },

    output: {
      path: path.resolve(__dirname, "dist"),
    },
  };

  if (mode === "development") {
    return {
      ...config,
      mode: "development",
      devtool: "inline-source-map",
      plugins: [],
    };
  }

  return {
    ...config,
    mode: "production",
    plugins: [],
  };
}
