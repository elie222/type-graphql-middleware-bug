import { SegmentService } from './SegmentService'

export const WEB_NAME = 'Web'
export const IOS_NAME = 'iOS'
export const ANDROID_NAME = 'Android'

const DEFAULT_SEGMENTS = [
  { name: WEB_NAME, parentSegmentId: null },
  { name: IOS_NAME, parentSegmentId: null },
  { name: ANDROID_NAME, parentSegmentId: null },
]

export const setUpSegments = async () => {
  const service = new SegmentService()

  const segments = await service.find()

  if (!segments.length) {
    console.log('Adding default segments')

    DEFAULT_SEGMENTS.forEach(segment => {
      service.create(segment)
    })
  }
}
