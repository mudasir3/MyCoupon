// NavigationService.js

import { NavigationActions } from 'react-navigation';

let _navigator;

function setTopLevelNavigator(navigatorRef) {
  _navigator = navigatorRef;
}

function navigate(routeName, params) {
  _navigator.dispatch(
    NavigationActions.navigate({
      routeName,
      params,
    })
  );
}
// add other navigation functions that you need and export them
export default {
  navigate,
  setTopLevelNavigator,
};
// const prefix = Platform.OS == 'android' ? 'myapp://' : 'myapp://';
// const App = createAppContainer(AppNavigator)
// const MainApp = () => <App uriPrefix={prefix} />;
// export default MainApp;