
export enum ScriptType {
  ONESHOT = 'quay onshot',
  REVIEW = 'quay review lồng voice',
}

export enum Gender {
  MALE = 'Nam',
  FEMALE = 'Nữ',
}

export enum Industry {
  FASHION = 'Thời trang & Phụ kiện',
  BEAUTY = 'Làm đẹp & Mỹ phẩm',
  TECH = 'Công nghệ & Đồ điện tử',
  HOME = 'Nhà cửa & Đời sống',
  FOOD = 'Ẩm thực & Đồ uống',
  HEALTH = 'Sức khỏe & Thực phẩm chức năng',
  EDUCATION = 'Giáo dục & Khóa học',
  TRAVEL = 'Du lịch & Trải nghiệm',
  OTHER = 'Ngành nghề khác',
}

export enum TargetAudience {
  GEN_Z = 'Gen Z (Sành điệu, bắt trend)',
  OFFICE_WORKERS = 'Dân văn phòng (Tiện lợi, chuyên nghiệp)',
  PARENTS = 'Phụ huynh (An toàn, chất lượng)',
  STUDENTS = 'Học sinh/Sinh viên (Giá rẻ, trẻ trung)',
  ENTREPRENEURS = 'Chủ doanh nghiệp/Kinh doanh',
  HOUSEWIVES = 'Nội trợ (Tiết kiệm, hữu dụng)',
  TECH_ENTHUSIASTS = 'Người yêu công nghệ',
  BEAUTY_LOVERS = 'Tín đồ làm đẹp',
  GENERAL = 'Khách hàng đại chúng',
}

// Viral Content Creator Types
export enum ViralTargetAudience {
  BEGINNER = 'Người mới',
  EXPERT = 'Chuyên gia',
  CHILDREN = 'Trẻ em',
  ADULTS = 'Người lớn',
  STUDENTS = 'Học sinh/Sinh viên',
  OFFICE_WORKERS = 'Dân văn phòng',
}

export enum ViralEmotion {
  HUMOR = 'Hài hước',
  DRAMATIC = 'Kịch tính',
  EMPATHY = 'Đồng cảm',
  INSPIRATIONAL = 'Truyền cảm hứng',
  CURIOUS = 'Tò mò',
  ANGRY = 'Phẫn nộ (Cảnh báo)',
}

export enum ViralStyle {
  EDUCATION = 'Giáo dục',
  STORYTELLING = 'Kể chuyện',
  SALES = 'Bán hàng',
  REVIEW = 'Review',
  BEHIND_THE_SCENES = 'Hậu trường',
}

export enum ViralPlatform {
  TIKTOK = 'TikTok',
  YOUTUBE_SHORTS = 'YouTube Shorts',
  FACEBOOK_REELS = 'Facebook Reels',
}

export enum ViralDuration {
  S15 = '15s',
  S30 = '30s',
  S60 = '60s',
}

export interface ViralInput {
  hook: string;
  subject: string;
  targetAudience: ViralTargetAudience;
  emotion: ViralEmotion;
  style: ViralStyle;
  platform: ViralPlatform;
  duration: ViralDuration;
}

export interface ViralScript {
  id: string;
  input: ViralInput;
  content: string;
  timestamp: string;
}

export enum AppMode {
  PRODUCT_INPUT = 'PRODUCT_INPUT',
  HOOK_GENERATOR = 'HOOK_GENERATOR',
  SCRIPT_GENERATOR = 'SCRIPT_GENERATOR',
}

export enum AgeGroup {
  GEN_Z = 'Gen Z (18-24)',
  MILLENNIALS = 'Millennials (25-34)',
  ADULTS = 'Người lớn (35-45)',
  SENIORS = 'Trung niên (45+)',
}

export enum SellingFactor {
  SALES = 'Bán hàng trực tiếp',
  REVIEW = 'Review trải nghiệm',
  LIFESTYLE = 'Phong cách sống',
  PROBLEM_SOLVING = 'Giải quyết nỗi đau',
  TRENDY = 'Bắt trend viral',
}

export interface ProductInfo {
  name: string;
  image?: File | null;
  imagePreview?: string;
  targetAudience: TargetAudience;
  industry: Industry;
}

export interface ViralHookSubject {
  id: string;
  hook: string;
  subject: string;
  description: string;
}

export interface HookGeneratorInput {
  productInfo: ProductInfo;
  ageGroup: AgeGroup;
  sellingFactor: SellingFactor;
  specificDetails: string;
}

export enum ContentStyle {
  SALES = 'Chốt đơn (Mạnh mẽ, trực diện)',
  TRUST = 'Review thật (Uy tín, trải nghiệm)',
  AESTHETIC = 'Aesthetic (Sang trọng, đẹp mắt)',
  TRENDY = 'Bắt trend (Năng động, viral)',
  PROBLEM_SOLVING = 'Giải pháp (Đánh vào nỗi đau)',
}

export enum ScriptGoal {
  REVIEW = 'Review sản phẩm',
  SALES = 'Bán hàng chuyển đổi',
}

export enum HookType {
  AUTO = 'Tự động (AI đề xuất)',
  FEAR = 'Mở đầu bằng nỗi sợ',
  DESIRE = 'Mở đầu bằng ham muốn',
  EMPATHY = 'Mở đầu bằng đồng cảm',
  WARNING = 'Mở đầu bằng cảnh báo',
}

export enum GenerationMode {
  IMAGE = 'create_from_image',
  CLONE = 'clone_content',
}

export interface SingleScript {
  title: string;
  voiceOver?: string;
  shotsTable?: string;
  scriptTable?: string;
  textOverlays: string; // Câu chữ hiển thị trên màn hình
  musicVibe: string;    // Gợi ý phong cách nhạc
  hashtags: string[];   // Hashtags SEO
}

export interface ScriptData {
  id: string;
  productName: string;
  idea?: string;
  scripts: SingleScript[];
  imagePreview?: string;
  scriptType: ScriptType;
  timestamp: string;
  duration?: number;
  gender?: Gender;
  industry?: Industry;
  targetAudience?: TargetAudience;
  contentStyle?: ContentStyle;
  scriptGoal?: ScriptGoal;
  hookType?: HookType;
  generationMode?: GenerationMode;
  originalContent?: string;
}
