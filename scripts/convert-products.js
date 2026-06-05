const fs = require("fs");
const path = require("path");

const projectRoot = process.cwd();

const sourcePath = path.join(projectRoot, "src", "data", "products-source.csv");
const outputPath = path.join(projectRoot, "src", "data", "products.json");
const publicImagesDir = path.join(projectRoot, "public", "images");

function parseCsv(csvText) {
  const rows = [];
  let currentRow = [];
  let currentCell = "";
  let insideQuotes = false;

  const text = csvText.replace(/^\uFEFF/, "");

  for (let i = 0; i < text.length; i += 1) {
    const char = text[i];
    const nextChar = text[i + 1];

    if (char === '"') {
      if (insideQuotes && nextChar === '"') {
        currentCell += '"';
        i += 1;
      } else {
        insideQuotes = !insideQuotes;
      }

      continue;
    }

    if (char === "," && !insideQuotes) {
      currentRow.push(currentCell);
      currentCell = "";
      continue;
    }

    if ((char === "\n" || char === "\r") && !insideQuotes) {
      if (char === "\r" && nextChar === "\n") {
        i += 1;
      }

      currentRow.push(currentCell);

      const hasContent = currentRow.some((cell) => cell.trim() !== "");

      if (hasContent) {
        rows.push(currentRow);
      }

      currentRow = [];
      currentCell = "";
      continue;
    }

    currentCell += char;
  }

  if (currentCell.length > 0 || currentRow.length > 0) {
    currentRow.push(currentCell);

    const hasContent = currentRow.some((cell) => cell.trim() !== "");

    if (hasContent) {
      rows.push(currentRow);
    }
  }

  return rows;
}

function cleanText(value) {
  return String(value || "")
    .replace(/\r\n/g, "\n")
    .replace(/\r/g, "\n")
    .trim();
}

function toNumber(value) {
  const number = Number(cleanText(value));

  if (Number.isNaN(number)) {
    return 0;
  }

  return number;
}

function toNumberOrNull(value) {
  const cleanedValue = cleanText(value);

  if (!cleanedValue) {
    return null;
  }

  const number = Number(cleanedValue);

  if (Number.isNaN(number)) {
    return null;
  }

  return number;
}

function getValue(rowObject, key) {
  return cleanText(rowObject[key]);
}

function normalizeImagePath(imageValue) {
  const rawImage = cleanText(imageValue);

  if (!rawImage) {
    return "/images/placeholder.svg";
  }

  const hasExtension = /\.(jpg|jpeg|png|webp|svg)$/i.test(rawImage);
  const fileName = hasExtension ? rawImage : `${rawImage}.jpg`;

  const imageFilePath = path.join(publicImagesDir, fileName);

  if (fs.existsSync(imageFilePath)) {
    return `/images/${fileName}`;
  }

  return "/images/placeholder.svg";
}

function convertCsvToProducts() {
  if (!fs.existsSync(sourcePath)) {
    throw new Error(`找不到源文件：${sourcePath}`);
  }

  const csvText = fs.readFileSync(sourcePath, "utf8");
  const rows = parseCsv(csvText);

  if (rows.length < 2) {
    throw new Error("CSV 内容不足，至少需要表头和一行产品数据。");
  }

  const headers = rows[0].map((header) => cleanText(header));

  const products = rows
    .slice(1)
    .map((row) => {
      const rowObject = {};

      headers.forEach((header, index) => {
        rowObject[header] = row[index] || "";
      });

      return rowObject;
    })
    .filter((rowObject) => getValue(rowObject, "ID") !== "")
    .map((rowObject) => {
      const marketingCoreSellingPoint = getValue(
        rowObject,
        "Marketing_CoreSellingPoint"
      );
      const marketingAbsorbency = getValue(rowObject, "Marketing_Absorbency");
      const marketingLeakProtection = getValue(
        rowObject,
        "Marketing_LeakProtection"
      );
      const marketingSkinComfort = getValue(rowObject, "Marketing_SkinComfort");
      const marketingFitAntiChafe = getValue(
        rowObject,
        "Marketing_FitAntiChafe"
      );
      const marketingAppearanceDesign = getValue(
        rowObject,
        "Marketing_AppearanceDesign"
      );

      return {
        id: getValue(rowObject, "ID"),
        productFamilyId: getValue(rowObject, "ProductFamilyID"),

        brand: getValue(rowObject, "Brand"),
        series: getValue(rowObject, "Series"),
        generation: getValue(rowObject, "Generation"),
        versionName: getValue(rowObject, "VersionName"),
        babySize: getValue(rowObject, "BabySize"),
        tier: getValue(rowObject, "Tier"),

        launchTime: getValue(rowObject, "LaunchTime"),
        launchMonth: getValue(rowObject, "LaunchMonth"),

        form: getValue(rowObject, "Form"),
        size: getValue(rowObject, "Size"),

        price: toNumber(rowObject.Price),

        /**
         * 注意：
         * 新版 CSV 2.2 中部分历史/待补充产品 Weight 为空。
         * 这里不能转成 0，否则会影响最轻重量、高亮和排序。
         */
        weight: toNumberOrNull(rowObject.Weight),

        image: normalizeImagePath(rowObject.Image),
        imageTs: normalizeImagePath(rowObject.Image_TS),

        /**
         * 兼容旧页面字段
         */
        claim1: marketingCoreSellingPoint,
        claim2: marketingAbsorbency || marketingLeakProtection,
        claim3: marketingSkinComfort || marketingFitAntiChafe,

        /**
         * 产品设计
         */
        designProductDimension: getValue(rowObject, "Design_ProductDimension"),
        designCore: getValue(rowObject, "Design_Core"),
        designTopsheet: getValue(rowObject, "Design_Topsheet"),
        designBacksheet: getValue(rowObject, "Design_Backsheet"),
        designFasteningSystem: getValue(rowObject, "Design_FasteningSystem"),
        designAesthetic: getValue(rowObject, "Design_Aesthetic"),
        designPackage: getValue(rowObject, "Design_Package"),
        designAccessories: getValue(rowObject, "Design_Accessories"),

        /**
         * 产品性能
         */
        performanceGbAbsorbency: getValue(
          rowObject,
          "Performance_GBAbsorbency"
        ),

        /**
         * 产品宣传
         */
        marketingCoreSellingPoint,
        marketingAbsorbency,
        marketingLeakProtection,
        marketingSkinComfort,
        marketingFitAntiChafe,
        marketingAppearanceDesign,

        /**
         * 产品评级
         */
        ratingConsumerFeedback: getValue(rowObject, "Rating_ConsumerFeedback"),
        ratingMarketPerformance: getValue(rowObject, "Rating_MarketPerformance"),
        ratingCostRating: getValue(rowObject, "Rating_CostRating"),
      };
    });

  fs.writeFileSync(outputPath, JSON.stringify(products, null, 2), "utf8");

  console.log(`转换完成：${products.length} 个产品`);
  console.log(`输出文件：${outputPath}`);

  const missingMainImageProducts = products.filter(
    (product) => product.image === "/images/placeholder.svg"
  );

  const missingTopsheetImageProducts = products.filter(
    (product) => product.imageTs === "/images/placeholder.svg"
  );

  const missingWeightProducts = products.filter(
    (product) => product.weight === null
  );

  if (missingMainImageProducts.length > 0) {
    console.log("");
    console.log(
      `提示：有 ${missingMainImageProducts.length} 个产品未找到主图，已使用 placeholder.svg 兜底。`
    );
    console.log("缺主图产品：");

    missingMainImageProducts.forEach((product) => {
      console.log(`- ${product.id}`);
    });
  }

  if (missingTopsheetImageProducts.length > 0) {
    console.log("");
    console.log(
      `提示：有 ${missingTopsheetImageProducts.length} 个产品未找到内表层图片，已使用 placeholder.svg 兜底。`
    );
    console.log("缺内表层图片产品：");

    missingTopsheetImageProducts.forEach((product) => {
      console.log(`- ${product.id}`);
    });
  }

  if (missingWeightProducts.length > 0) {
    console.log("");
    console.log(
      `提示：有 ${missingWeightProducts.length} 个产品 Weight 为空，已写入 null。`
    );
    console.log("缺 Weight 产品：");

    missingWeightProducts.forEach((product) => {
      console.log(`- ${product.id}`);
    });
  }
}

convertCsvToProducts();