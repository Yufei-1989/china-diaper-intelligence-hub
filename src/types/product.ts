export type Product = {
  id: string;
  productFamilyId: string;

  brand: string;
  series: string;
  generation: string;
  versionName: string;

  /**
   * BabySize 表示该产品系列覆盖的宝宝尺码范围
   * 例如：NB S M L XL / L XL 2XL 3XL
   */
  babySize: string;

  tier: "SP" | "P" | "V" | "E" | string;

  launchTime: string;
  launchMonth: string;

  form: "Taped" | "Pants" | string;
  size: string;

  price: number;

  /**
   * 新版 CSV 中部分历史/待补充产品 Weight 为空
   * 所以这里允许 null，避免空值被错误显示为 0g
   */
  weight: number | null;

  /**
   * 产品主图
   */
  image: string;

  /**
   * 内表层 / Topsheet 图片
   * 如果图片文件夹中找不到，会由转换脚本写入 placeholder
   */
  imageTs: string;

  /**
   * 兼容当前网站已有页面使用的字段
   * 这些字段由新版 marketing 字段映射而来
   */
  claim1: string;
  claim2: string;
  claim3: string;

  /**
   * 产品设计
   */
  designProductDimension: string;
  designCore: string;
  designTopsheet: string;
  designBacksheet: string;
  designFasteningSystem: string;

  /**
   * 新增：外观设计 / 印花主题
   */
  designAesthetic: string;

  /**
   * 新增：包装信息
   */
  designPackage: string;

  designAccessories: string;

  /**
   * 产品性能
   */
  performanceGbAbsorbency: string;

  /**
   * 产品宣传
   */
  marketingCoreSellingPoint: string;
  marketingAbsorbency: string;
  marketingLeakProtection: string;
  marketingSkinComfort: string;
  marketingFitAntiChafe: string;
  marketingAppearanceDesign: string;

  /**
   * 产品评级
   */
  ratingConsumerFeedback: string;
  ratingMarketPerformance: string;
  ratingCostRating: string;
};