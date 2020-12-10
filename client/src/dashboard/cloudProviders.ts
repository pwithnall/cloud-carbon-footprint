/*
 * © 2020 ThoughtWorks, Inc. All rights reserved.
 */
import Config from '../Config.json'
import { DropdownOption } from './filters/DropdownFilter'

export const ALL_CLOUD_PROVIDERS_KEY = 'all'
export const ALL_CLOUD_PROVIDERS_VALUE = 'All Providers'
export const ALL_CLOUD_PROVIDERS_DROPDOWN_OPTION: DropdownOption = {
  key: ALL_CLOUD_PROVIDERS_KEY,
  name: ALL_CLOUD_PROVIDERS_VALUE,
}
export const CLOUD_PROVIDER_OPTIONS: DropdownOption[] = [
  ALL_CLOUD_PROVIDERS_DROPDOWN_OPTION,
  ...Config.CURRENT_PROVIDERS,
]
