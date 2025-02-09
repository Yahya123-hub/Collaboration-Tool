
jest.mock('react-chartjs-2', () => ({
  Line: () => <div data-testid="mock-line-chart" />,
  Bar: () => <div data-testid="mock-bar-chart" />,
  Doughnut: () => <div data-testid="mock-doughnut-chart" />,
  Pie: () => <div data-testid="mock-pie-chart" />,
  Radar: () => <div data-testid="mock-radar-chart" />,
  PolarArea: () => <div data-testid="mock-polararea-chart" />,
  Bubble: () => <div data-testid="mock-bubble-chart" />,
  Scatter: () => <div data-testid="mock-scatter-chart" />,
}));
