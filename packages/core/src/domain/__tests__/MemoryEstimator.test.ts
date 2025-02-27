/*
 * © 2021 ThoughtWorks, Inc.
 */

import MemoryEstimator from '../MemoryEstimator'
import { GCP_REGIONS } from '../../services/gcp/GCPRegions'
import { CLOUD_CONSTANTS } from '../FootprintEstimationConstants'

describe('MemoryEstimator', () => {
  it('does estimates for GCP US Central 1', () => {
    const input = [
      {
        timestamp: new Date('2021-01-01'),
        gigabyteHours: 90,
      },
    ]

    const result = new MemoryEstimator(
      CLOUD_CONSTANTS.GCP.MEMORY_COEFFICIENT,
    ).estimate(input, GCP_REGIONS.US_CENTRAL1, 'GCP')

    expect(result).toEqual([
      {
        co2e: 0.000018758023200000002,
        timestamp: new Date('2021-01-01T00:00:00.000Z'),
        kilowattHours: 0.0391608,
      },
    ])
  })
})
