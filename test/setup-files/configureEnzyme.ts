/*
    This is a global setup, which is executed by Jest setupFilesAfterEnv
    configuration (https://jestjs.io/docs/en/configuration#setupfilesafterenv-array).
    See jest.config.js
*/
import { configure } from "enzyme";
import Adapter from "enzyme-adapter-react-16";

configure({ adapter: new Adapter() });
