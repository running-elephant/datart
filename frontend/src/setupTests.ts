import '@testing-library/jest-dom/extend-expect';
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';
import Enzyme from 'enzyme';
import 'locales/i18n';
import 'react-app-polyfill/ie11';
import 'react-app-polyfill/stable';
import './__tests__/helper.chart';

Enzyme.configure({ adapter: new Adapter() });
