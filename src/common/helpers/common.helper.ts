import {
    BinaryLike,
    createHmac,
} from 'crypto'

export const CommonHelpers = {
    sha256(data: BinaryLike, secret: string): string {
        return createHmac('sha256', secret).update(data).digest('hex')
    },
    uuid() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
            const r = (Math.random() * 16) | 0,
                v = c == 'x' ? r : (r & 0x3) | 0x8
            return v.toString(16)
        })
    },
}
