export type Clip = {
    _id: string,
    startTime: string,
    text: string,
    endTime: string,
    videoUrl: string,
    createdAt: Date,
    platform: string,
    collectionId: string | null,
    title?: string,
}
