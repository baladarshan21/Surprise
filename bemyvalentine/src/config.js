import userConfig from "../config.json" with { type: "json" };

const ASSET_PREFIX = "/src/assets/";
const assetUrlMap = import.meta.glob("./assets/**/*", {
  eager: true,
  import: "default",
});

const resolveAssetPath = (value) => {
  if (typeof value !== "string") {
    return value;
  }

  if (!value.startsWith(ASSET_PREFIX)) {
    return value;
  }

  const relativePath = value.slice(ASSET_PREFIX.length);
  const moduleKey = `./assets/${relativePath}`;

  if (moduleKey in assetUrlMap) {
    return assetUrlMap[moduleKey];
  }

  return value;
};

const mapConfigAssets = (value) => {
  if (Array.isArray(value)) {
    return value.map(mapConfigAssets);
  }

  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value).map(([key, nestedValue]) => [
        key,
        mapConfigAssets(nestedValue),
      ]),
    );
  }

  return resolveAssetPath(value);
};

export const config = mapConfigAssets(userConfig);
