import { DeviceWidth } from "./hooks/useDeviceWidth"

export const itemsPerCarrousel = (screen: DeviceWidth): number => {
  switch (screen) {
    case DeviceWidth.xs:
      return 1
    case DeviceWidth.sm:
      return 2
    case DeviceWidth.md:
      return 2
    case DeviceWidth.lg:
      return 4
    case DeviceWidth.xl:
      return 5
    default:
      return 3
  }
}
