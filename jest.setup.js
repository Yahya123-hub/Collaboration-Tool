import '@testing-library/jest-dom';
import React from 'react';
//import "@testing-library/jest-dom/extend-expect";

global.scrollTo= jest.fn();
global.React = React; 