
export const STYLE_PROMPTS: Record<string, string> = {
    // LinkedIn / Professional
    'business': 'Professional business portrait, wearing a sharp tailored suit, office background, cinematic lighting, 8k, photorealistic, confident expression',
    'street-casual': 'Professional street casual portrait, stylish smart casual outfit, city street background with bokeh, natural lighting, 8k, photorealistic',
    'black-background': 'Professional studio portrait, wearing elegant clothing, pure black background, dramatic rim lighting, 8k, photorealistic',
    'white-background': 'Professional studio portrait, wearing smart business casual, pure white background, soft even lighting, 8k, photorealistic',
    'casual-selfie': 'High quality casual selfie, natural makeup, friendly smile, looking directly at camera, soft natural lighting, 8k, photorealistic',

    // Legacy / Trends
    'decades': 'Vintage 1950s style portrait, retro aesthetic, film grain',
    'classy': 'Elegant classy portrait, evening wear, sophisticated atmosphere',
    'hair': 'Artistic hair style showcase, dynamic hair volume, fashion photography',
    'y2k': 'Y2K aesthetic, 2000s fashion, vibrant colors, retro-futuristic',
    'suit': 'Professional business suit portrait, corporate atmosphere',
    'office': 'Modern office environment portrait, professional attire'
};

export function getPromptForStyle(styleId: string): string {
    const normalizeId = styleId.toLowerCase().replace(/\s+/g, '-');
    return STYLE_PROMPTS[normalizeId] || `${styleId} style`;
}
