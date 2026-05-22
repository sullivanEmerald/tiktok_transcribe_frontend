
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
                details: {
                    image: {
                        width: number,
                        height: number
                    }
                }
            };
        };
    };
};

export type BlogPostEntry = {
    sys: { id: string, createdAt: string };
    fields: BlogPost;
};