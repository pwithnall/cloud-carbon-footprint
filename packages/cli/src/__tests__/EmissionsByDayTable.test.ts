/*
 * © 2021 ThoughtWorks, Inc.
 */

import { EstimationResult } from '@cloud-carbon-footprint/core'
import EmissionsByDayTable from '../EmissionsByDayTable'
import moment = require('moment')

describe('EmissionsByDayTable', () => {
  const region = 'us-east-1'
  const timestamp = moment.utc('2020-07-10').toDate()

  const input: EstimationResult[] = [
    {
      timestamp: timestamp,
      serviceEstimates: [
        {
          cloudProvider: 'aws',
          accountName: 'test account',
          serviceName: 'ebs',
          kilowattHours: 1,
          co2e: 1,
          cost: 0,
          region: region,
          usesAverageCPUConstant: false,
        },
        {
          cloudProvider: 'aws',
          accountName: 'test account',
          serviceName: 's3',
          kilowattHours: 2,
          co2e: 2,
          cost: 0,
          region: region,
          usesAverageCPUConstant: false,
        },
        {
          cloudProvider: 'aws',
          accountName: 'test account',
          serviceName: 'ec2',
          kilowattHours: 3,
          co2e: 3,
          cost: 0,
          region: region,
          usesAverageCPUConstant: false,
        },
        {
          cloudProvider: 'aws',
          accountName: 'test account',
          serviceName: 'elasticache',
          kilowattHours: 4,
          co2e: 4,
          cost: 0,
          region: region,
          usesAverageCPUConstant: false,
        },
        {
          cloudProvider: 'aws',
          accountName: 'test account',
          serviceName: 'rds',
          kilowattHours: 4,
          co2e: 4,
          cost: 0,
          region: region,
          usesAverageCPUConstant: false,
        },
        {
          cloudProvider: 'aws',
          accountName: 'test account',
          serviceName: 'lambda',
          kilowattHours: 1,
          co2e: 1,
          cost: 0,
          region: region,
          usesAverageCPUConstant: false,
        },
      ],
    },
    {
      timestamp: moment.utc('2020-07-09').toDate(),
      serviceEstimates: [
        {
          cloudProvider: 'aws',
          accountName: 'test account',
          serviceName: 'ebs',
          kilowattHours: 7,
          co2e: 8,
          cost: 6,
          region: region,
          usesAverageCPUConstant: false,
        },
        {
          cloudProvider: 'aws',
          accountName: 'test account',
          serviceName: 's3',
          kilowattHours: 55,
          co2e: 1,
          cost: 6,
          region: region,
          usesAverageCPUConstant: false,
        },
        {
          cloudProvider: 'aws',
          accountName: 'test account',
          serviceName: 'ec2',
          kilowattHours: 90,
          co2e: 77,
          cost: 6,
          region: region,
          usesAverageCPUConstant: false,
        },
        {
          cloudProvider: 'aws',
          accountName: 'test account',
          serviceName: 'elasticache',
          kilowattHours: 747,
          co2e: 787,
          cost: 6,
          region: region,
          usesAverageCPUConstant: false,
        },
        {
          cloudProvider: 'aws',
          accountName: 'test account',
          serviceName: 'rds',
          kilowattHours: 747,
          co2e: 787,
          cost: 6,
          region: region,
          usesAverageCPUConstant: false,
        },
        {
          cloudProvider: 'aws',
          accountName: 'test account',
          serviceName: 'lambda',
          kilowattHours: 300,
          co2e: 300,
          cost: 6,
          region: region,
          usesAverageCPUConstant: false,
        },
      ],
    },
  ]

  let result: { table: string[][]; colWidths: number[] }

  beforeEach(() => {
    result = EmissionsByDayTable(input)
  })

  it('prints out the given estimation results grouped by service', () => {
    expect(result.table).toEqual([
      ['Date', 'kilowatt hours', 'metric tons CO2e Emissions'],
      ['2020-07-10', '15.00', '15.000000'],
      ['2020-07-09', '1946.00', '1960.000000'],
      ['Total', '1961.00', '1975.000000'],
    ])
  })

  it('does the right columns', () => {
    expect(result.colWidths).toEqual([15, 20, 25])
  })
})
