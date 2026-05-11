
export type BlogPost = {
    title: string;
    slug: string;
    description: string;
    body: any;
    date: string;
    author: string;
    coverImage?: {
        fields: {
            file: {
                url: string;
            };
        };
    };
};

export type BlogPostEntry = {
    sys: { id: string };
    fields: BlogPost;
};