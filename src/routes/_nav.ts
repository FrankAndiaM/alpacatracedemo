// import { object } from 'yup';
// eslint-disable-next-line
import routesName, { moduleRoute } from './routes';

const routesNew: any = [];

Object.values(moduleRoute).forEach((value: any) => {
  if (value.divider) {
    routesNew.push({
      divider: true
    });
  } else if (value.submodule) {
    const children: any = [];
    Object.values(value.submodule).forEach((value: any) => {
      children.push(value);
    });

    routesNew.push({
      path: value.path,
      module_code: value.module_code,
      text: value.text,
      icon: value.icon,
      children: children
    });
  } else {
    routesNew.push({
      path: value.path,
      module_code: value.module_code,
      text: value.text,
      icon: value.icon
    });
  }
});

const routes = routesNew;

export { routes };
