/*
 * © 2021 ThoughtWorks, Inc.
 */

import { ServiceClientCredentials } from '@azure/ms-rest-js'
import { ConsumptionManagementClient } from '@azure/arm-consumption'

import {
  ComputeEstimator,
  StorageEstimator,
  NetworkingEstimator,
  EstimationResult,
  configLoader,
} from '@cloud-carbon-footprint/core'

import {
  mockConsumptionManagementResponseFour,
  mockConsumptionManagementResponseOne,
  mockConsumptionManagementResponseThree,
  mockConsumptionManagementResponseTwo,
} from '../../test/fixtures/consumptionManagement.fixtures'

import ConsumptionManagementService from '../lib/ConsumptionManagement'
import { AZURE_CLOUD_CONSTANTS } from '../domain'

const mockUsageDetails = { list: jest.fn(), listNext: jest.fn() }

jest.mock('@cloud-carbon-footprint/core', () => ({
  ...jest.requireActual('@cloud-carbon-footprint/core'),
  configLoader: jest.fn().mockImplementation(() => {
    return {
      GROUP_QUERY_RESULTS_BY: 'day',
    }
  }),
}))

jest.mock('@azure/arm-consumption', () => {
  return {
    ConsumptionManagementClient: jest.fn().mockImplementation(() => {
      return {
        usageDetails: mockUsageDetails,
      }
    }),
  }
})

describe('Azure Consumption Management Service', () => {
  const startDate = new Date('2020-11-02')
  const endDate = new Date('2020-11-03')
  const subscriptionId = 'test-subscription'
  const mockCredentials: ServiceClientCredentials = { signRequest: jest.fn() }

  it('Returns estimates for Compute', async () => {
    mockUsageDetails.list.mockResolvedValue(
      mockConsumptionManagementResponseOne,
    )

    const consumptionManagementService = new ConsumptionManagementService(
      new ComputeEstimator(),
      new StorageEstimator(AZURE_CLOUD_CONSTANTS.SSDCOEFFICIENT),
      new StorageEstimator(AZURE_CLOUD_CONSTANTS.HDDCOEFFICIENT),
      new NetworkingEstimator(),
      // eslint-disable-next-line
      // @ts-ignore: @azure/arm-consumption is using an older version of @azure/ms-rest-js, causing a type error.
      new ConsumptionManagementClient(mockCredentials, subscriptionId),
    )

    const result = await consumptionManagementService.getEstimates(
      startDate,
      endDate,
    )

    const expectedResult: EstimationResult[] = [
      {
        timestamp: new Date('2020-11-02'),
        serviceEstimates: [
          {
            kilowattHours: 0.09810615,
            co2e: 0.000022368202200000002,
            usesAverageCPUConstant: true,
            cloudProvider: 'AZURE',
            accountName: 'test-subscription',
            serviceName: 'Virtual Machines',
            cost: 5,
            region: 'UK South',
          },
          {
            kilowattHours: 0.0012798204768000002,
            co2e: 4.991299859520001e-7,
            usesAverageCPUConstant: true,
            cloudProvider: 'AZURE',
            accountName: 'test-subscription',
            serviceName: 'Virtual Machines',
            cost: 10,
            region: 'EU West',
          },
          {
            kilowattHours: 0.020198324999999996,
            co2e: 0.000010916406927824999,
            usesAverageCPUConstant: true,
            cloudProvider: 'AZURE',
            accountName: 'test-subscription',
            serviceName: 'Azure App Service',
            cost: 10,
            region: 'US Central',
          },
        ],
      },
      {
        timestamp: new Date('2020-11-03'),
        serviceEstimates: [
          {
            kilowattHours: 0.026721749999999996,
            co2e: 0.000011353456974749998,
            usesAverageCPUConstant: true,
            cloudProvider: 'AZURE',
            accountName: 'test-subscription',
            serviceName: 'Container Instances',
            cost: 12,
            region: 'US South Central',
          },
          {
            kilowattHours: 0.0641322,
            co2e: 0.00002612745828,
            usesAverageCPUConstant: true,
            cloudProvider: 'AZURE',
            accountName: 'test-subscription',
            serviceName: 'Azure Database for MySQL',
            cost: 12,
            region: 'Unknown',
          },
        ],
      },
    ]
    expect(result).toEqual(expectedResult)
  })

  describe('When group query results by week is true', () => {
    beforeEach(() => {
      ;(configLoader as jest.Mock).mockReturnValue({
        GROUP_QUERY_RESULTS_BY: 'week',
      })
    })

    afterEach(() => {
      jest.restoreAllMocks()
    })

    it('Returns estimates for Compute grouped by week', async () => {
      mockUsageDetails.list.mockResolvedValue(
        mockConsumptionManagementResponseOne,
      )

      const consumptionManagementService = new ConsumptionManagementService(
        new ComputeEstimator(),
        new StorageEstimator(AZURE_CLOUD_CONSTANTS.SSDCOEFFICIENT),
        new StorageEstimator(AZURE_CLOUD_CONSTANTS.HDDCOEFFICIENT),
        new NetworkingEstimator(),
        // eslint-disable-next-line
        // @ts-ignore: @azure/arm-consumption is using an older version of @azure/ms-rest-js, causing a type error.
        new ConsumptionManagementClient(mockCredentials, subscriptionId),
      )

      const result = await consumptionManagementService.getEstimates(
        startDate,
        endDate,
      )

      const expectedResult: EstimationResult[] = [
        {
          timestamp: new Date('2020-11-02'),
          serviceEstimates: [
            {
              kilowattHours: 0.09810615,
              co2e: 0.000022368202200000002,
              usesAverageCPUConstant: true,
              cloudProvider: 'AZURE',
              accountName: 'test-subscription',
              serviceName: 'Virtual Machines',
              cost: 5,
              region: 'UK South',
            },
            {
              kilowattHours: 0.0012798204768000002,
              co2e: 4.991299859520001e-7,
              usesAverageCPUConstant: true,
              cloudProvider: 'AZURE',
              accountName: 'test-subscription',
              serviceName: 'Virtual Machines',
              cost: 10,
              region: 'EU West',
            },
            {
              kilowattHours: 0.020198324999999996,
              co2e: 0.000010916406927824999,
              usesAverageCPUConstant: true,
              cloudProvider: 'AZURE',
              accountName: 'test-subscription',
              serviceName: 'Azure App Service',
              cost: 10,
              region: 'US Central',
            },
            {
              kilowattHours: 0.026721749999999996,
              co2e: 0.000011353456974749998,
              usesAverageCPUConstant: true,
              cloudProvider: 'AZURE',
              accountName: 'test-subscription',
              serviceName: 'Container Instances',
              cost: 12,
              region: 'US South Central',
            },
            {
              kilowattHours: 0.0641322,
              co2e: 0.00002612745828,
              usesAverageCPUConstant: true,
              cloudProvider: 'AZURE',
              accountName: 'test-subscription',
              serviceName: 'Azure Database for MySQL',
              cost: 12,
              region: 'Unknown',
            },
          ],
        },
      ]
      expect(result).toEqual(expectedResult)
    })
  })

  it('Returns estimates for Storage', async () => {
    mockUsageDetails.list.mockResolvedValue(
      mockConsumptionManagementResponseTwo,
    )

    const consumptionManagementService = new ConsumptionManagementService(
      new ComputeEstimator(),
      new StorageEstimator(AZURE_CLOUD_CONSTANTS.SSDCOEFFICIENT),
      new StorageEstimator(AZURE_CLOUD_CONSTANTS.HDDCOEFFICIENT),
      new NetworkingEstimator(),
      // eslint-disable-next-line
      // @ts-ignore: @azure/arm-consumption is using an older version of @azure/ms-rest-js, causing a type error.
      new ConsumptionManagementClient(mockCredentials, subscriptionId),
    )

    const result = await consumptionManagementService.getEstimates(
      startDate,
      endDate,
    )

    const expectedResult: EstimationResult[] = [
      {
        timestamp: new Date('2020-11-02'),
        serviceEstimates: [
          {
            kilowattHours: 0.003458304,
            co2e: 7.88493312e-7,
            usesAverageCPUConstant: false,
            cloudProvider: 'AZURE',
            accountName: 'test-subscription',
            serviceName: 'Storage',
            cost: 10,
            region: 'UK South',
          },
          {
            kilowattHours: 0.00013651199999999998,
            co2e: 5.323967999999999e-8,
            usesAverageCPUConstant: false,
            cloudProvider: 'AZURE',
            accountName: 'test-subscription',
            serviceName: 'Storage',
            cost: 5,
            region: 'EU West',
          },
          {
            kilowattHours: 0.00006825599999999999,
            co2e: 2.6619839999999995e-8,
            usesAverageCPUConstant: false,
            cloudProvider: 'AZURE',
            accountName: 'test-subscription',
            serviceName: 'Azure Database for MySQL',
            cost: 5,
            region: 'EU West',
          },
          {
            kilowattHours: 0.00034127999999999996,
            co2e: 1.3309919999999998e-7,
            usesAverageCPUConstant: false,
            cloudProvider: 'AZURE',
            accountName: 'test-subscription',
            serviceName: 'Container Registry',
            cost: 5,
            region: 'EU West',
          },
          {
            kilowattHours: 0.018929664000000002,
            co2e: 0.000004315963392000001,
            usesAverageCPUConstant: false,
            cloudProvider: 'AZURE',
            accountName: 'test-subscription',
            serviceName: 'HDInsight',
            cost: 5,
            region: 'UK South',
          },
          {
            kilowattHours: 0.068256,
            co2e: 0.000015562368,
            usesAverageCPUConstant: false,
            cloudProvider: 'AZURE',
            accountName: 'test-subscription',
            serviceName: 'Azure Synapse Analytics',
            cost: 5,
            region: 'UK South',
          },
          {
            kilowattHours: 0.00034127999999999996,
            co2e: 2.4162623999999994e-7,
            usesAverageCPUConstant: false,
            cloudProvider: 'AZURE',
            accountName: 'test-subscription',
            serviceName: 'Storage',
            cost: 5,
            region: 'IN Central',
          },
        ],
      },
    ]
    expect(result).toEqual(expectedResult)
  })
  it('Returns estimates for Networking', async () => {
    mockUsageDetails.list.mockResolvedValue(
      mockConsumptionManagementResponseThree,
    )

    const consumptionManagementService = new ConsumptionManagementService(
      new ComputeEstimator(),
      new StorageEstimator(AZURE_CLOUD_CONSTANTS.SSDCOEFFICIENT),
      new StorageEstimator(AZURE_CLOUD_CONSTANTS.HDDCOEFFICIENT),
      new NetworkingEstimator(),
      // eslint-disable-next-line
      // @ts-ignore: @azure/arm-consumption is using an older version of @azure/ms-rest-js, causing a type error.
      new ConsumptionManagementClient(mockCredentials, subscriptionId),
    )

    const result = await consumptionManagementService.getEstimates(
      startDate,
      endDate,
    )

    const expectedResult: EstimationResult[] = [
      {
        timestamp: new Date('2020-11-02'),
        serviceEstimates: [
          {
            kilowattHours: 0.011850000000000001,
            co2e: 0.0000027018000000000005,
            usesAverageCPUConstant: false,
            cloudProvider: 'AZURE',
            accountName: 'test-subscription',
            serviceName: 'Storage',
            cost: 5,
            region: 'UK South',
          },
          {
            kilowattHours: 11.850000000000001,
            co2e: 0.0027018000000000003,
            usesAverageCPUConstant: false,
            cloudProvider: 'AZURE',
            accountName: 'test-subscription',
            serviceName: 'Bandwidth',
            cost: 5,
            region: 'UK South',
          },
        ],
      },
    ]
    expect(result).toEqual(expectedResult)
  })

  it('Ignores Unknown/Unsupported Usage Types', async () => {
    mockUsageDetails.list.mockResolvedValue(
      mockConsumptionManagementResponseFour,
    )

    const consumptionManagementService = new ConsumptionManagementService(
      new ComputeEstimator(),
      new StorageEstimator(AZURE_CLOUD_CONSTANTS.SSDCOEFFICIENT),
      new StorageEstimator(AZURE_CLOUD_CONSTANTS.HDDCOEFFICIENT),
      new NetworkingEstimator(),
      // eslint-disable-next-line
      // @ts-ignore: @azure/arm-consumption is using an older version of @azure/ms-rest-js, causing a type error.
      new ConsumptionManagementClient(mockCredentials, subscriptionId),
    )

    const result = await consumptionManagementService.getEstimates(
      startDate,
      endDate,
    )

    expect(result).toEqual([])
  })

  it('Pages through results', async () => {
    const testNextLink = 'test-next-link'
    mockUsageDetails.list.mockResolvedValue({ nextLink: testNextLink })
    mockUsageDetails.listNext.mockResolvedValue(
      mockConsumptionManagementResponseThree,
    )

    const consumptionManagementService = new ConsumptionManagementService(
      new ComputeEstimator(),
      new StorageEstimator(AZURE_CLOUD_CONSTANTS.SSDCOEFFICIENT),
      new StorageEstimator(AZURE_CLOUD_CONSTANTS.HDDCOEFFICIENT),
      new NetworkingEstimator(),
      // eslint-disable-next-line
      // @ts-ignore: @azure/arm-consumption is using an older version of @azure/ms-rest-js, causing a type error.
      new ConsumptionManagementClient(mockCredentials, subscriptionId),
    )

    const result = await consumptionManagementService.getEstimates(
      startDate,
      endDate,
    )

    const expectedResult: EstimationResult[] = [
      {
        timestamp: new Date('2020-11-02'),
        serviceEstimates: [
          {
            kilowattHours: 0.011850000000000001,
            co2e: 0.0000027018000000000005,
            usesAverageCPUConstant: false,
            cloudProvider: 'AZURE',
            accountName: 'test-subscription',
            serviceName: 'Storage',
            cost: 5,
            region: 'UK South',
          },
          {
            kilowattHours: 11.850000000000001,
            co2e: 0.0027018000000000003,
            usesAverageCPUConstant: false,
            cloudProvider: 'AZURE',
            accountName: 'test-subscription',
            serviceName: 'Bandwidth',
            cost: 5,
            region: 'UK South',
          },
        ],
      },
    ]
    expect(result).toEqual(expectedResult)
    expect(mockUsageDetails.listNext).toHaveBeenCalledWith(testNextLink)
  })

  it('Throws an error when usageDetails.list fails', async () => {
    const errorMessage = 'Something went wrong!'
    const testError = new Error(errorMessage)
    mockUsageDetails.list.mockRejectedValue(testError)

    const consumptionManagementService = new ConsumptionManagementService(
      new ComputeEstimator(),
      new StorageEstimator(AZURE_CLOUD_CONSTANTS.SSDCOEFFICIENT),
      new StorageEstimator(AZURE_CLOUD_CONSTANTS.HDDCOEFFICIENT),
      new NetworkingEstimator(),
      // eslint-disable-next-line
      // @ts-ignore: @azure/arm-consumption is using an older version of @azure/ms-rest-js, causing a type error.
      new ConsumptionManagementClient(mockCredentials, subscriptionId),
    )
    await expect(() =>
      consumptionManagementService.getEstimates(startDate, endDate),
    ).rejects.toThrow(
      `Azure ConsumptionManagementClient.usageDetails.list failed. Reason: ${errorMessage}`,
    )
  })

  it('Throws an error when usageDetails.listNext fails', async () => {
    const errorMessage = {
      message: 'Something went wrong!',
      response: {
        headers: {
          _headersMap: {
            'x-ms-ratelimit-remaining-microsoft.consumption-tenant-requests': {
              value: 1,
            },
            'x-ms-ratelimit-microsoft.consumption-tenant-retry-after': {
              value: 60,
            },
          },
        },
      },
    }

    mockConsumptionManagementResponseOne.nextLink = 'mock next link'
    mockUsageDetails.list.mockResolvedValue(
      mockConsumptionManagementResponseOne,
    )
    mockUsageDetails.listNext.mockRejectedValue(errorMessage)

    const consumptionManagementService = new ConsumptionManagementService(
      new ComputeEstimator(),
      new StorageEstimator(AZURE_CLOUD_CONSTANTS.SSDCOEFFICIENT),
      new StorageEstimator(AZURE_CLOUD_CONSTANTS.HDDCOEFFICIENT),
      new NetworkingEstimator(),
      // eslint-disable-next-line
      // @ts-ignore: @azure/arm-consumption is using an older version of @azure/ms-rest-js, causing a type error.
      new ConsumptionManagementClient(mockCredentials, subscriptionId),
    )

    await expect(() =>
      consumptionManagementService.getEstimates(startDate, endDate),
    ).rejects.toThrow(
      `Azure ConsumptionManagementClient.usageDetails.listNext failed. Reason: ${errorMessage.message}`,
    )
  })
})
