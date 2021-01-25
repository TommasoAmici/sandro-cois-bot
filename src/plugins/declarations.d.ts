interface GifImage {
    url?: string;
    width?: string;
    height?: string;
    size?: string;
    frames?: string;
    mp4?: string;
    mp4_size?: string;
    webp?: string;
    webp_size?: string;
    hash?: string;
}

interface GifAnalytics {
    url: string;
}

interface Gif {
    type: string;
    id: string;
    slug: string;
    url: string;
    bitly_gif_url: string;
    bitly_url: string;
    embed_url: string;
    username: string | null;
    source: string;
    rating: string;
    content_url: string | null;
    source_tld: string;
    source_post_url: string;
    is_sticker: number | boolean;
    import_datetime: string;
    trending_datetime: string;
    images: {
        fixed_height_still: GifImage;
        original_still: GifImage;
        fixed_width: GifImage;
        fixed_height_small_still: GifImage;
        fixed_height_downsampled: GifImage;
        preview: GifImage;
        fixed_height_small: GifImage;
        downsized_still: GifImage;
        downsized: GifImage;
        downsized_large: GifImage;
        fixed_width_small_still: GifImage;
        preview_webp: GifImage;
        fixed_width_still: GifImage;
        fixed_width_small: GifImage;
        downsized_small: GifImage;
        fixed_width_downsampled: GifImage;
        downsized_medium: GifImage;
        original: GifImage;
        fixed_height: GifImage;
        looping: GifImage;
        original_mp4: GifImage;
        preview_gif: GifImage;
        '480w_still': GifImage;
    };
    title: string;
    analytics: {
        onload: GifAnalytics;
        onclick: GifAnalytics;
        onsent: GifAnalytics;
    };
}

interface ImageItem {
    url: string;
    width: number;
    height: number;
}
