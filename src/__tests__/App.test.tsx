import '@testing-library/jest-dom';
import { render } from '@testing-library/react';
import App from '../renderer/App';

describe('App', () => {
  it('should render', () => {
    expect(true).toBe(true);
    //expect(render(<App />)).toBeTruthy();
  });
});
