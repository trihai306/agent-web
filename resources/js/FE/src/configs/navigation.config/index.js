import dashboardsNavigationConfig from './dashboards.navigation.config'
import uiComponentNavigationConfig from './ui-components.navigation.config'
import conceptsNavigationConfig from './concepts.navigation.config'

const navigationConfig = [
    ...dashboardsNavigationConfig,
    ...conceptsNavigationConfig,
    ...uiComponentNavigationConfig,
]

export default navigationConfig
